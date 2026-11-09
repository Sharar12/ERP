#!/usr/bin/env bash
# backend/scripts/smoke.sh — full E2E against real DB
set -euo pipefail

API="${API:-http://localhost:8000/api/v1}"
EMAIL="${EMAIL:-alice@acme.test}"
PASS="${PASS:-password}"
PASS_COUNT=0; FAIL_COUNT=0
ok()   { echo "  ✅ $1"; PASS_COUNT=$((PASS_COUNT+1)); }
fail() { echo "  ❌ $1"; FAIL_COUNT=$((FAIL_COUNT+1)); }

echo "━━━ Phase 4 smoke test ━━━"

# ── 1. Login ──────────────────────────────────────────────
echo "→ Auth"
TOKEN=$(curl -sf -X POST "$API/auth/login" \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" | jq -r '.data.token')
[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] && ok "Login → token issued" || { fail "Login"; exit 1; }
AUTH=(-H "Authorization: Bearer $TOKEN" -H 'Accept: application/json')

# ── 2. Me ─────────────────────────────────────────────────
ME=$(curl -sf "$API/auth/me" "${AUTH[@]}")
[ "$(echo "$ME" | jq -r '.data.email')" = "$EMAIL" ] && ok "GET /auth/me" || fail "GET /auth/me"

# ── 3. CRM — list, create, read, update, delete ───────────
echo "→ CRM"
LIST=$(curl -sf "$API/crm/customers?per_page=15" "${AUTH[@]}")
TOTAL=$(echo "$LIST" | jq -r '.meta.total')
[ "$TOTAL" -gt 0 ] && ok "List customers ($TOTAL total)" || fail "List customers"

NEW=$(curl -sf -X POST "$API/crm/customers" "${AUTH[@]}" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Smoke E2E Co","email":"smoke-'$(date +%s)'@test.io"}')
NEW_ID=$(echo "$NEW" | jq -r '.data.id')
[ "$NEW_ID" != "null" ] && ok "Create customer (#$NEW_ID)" || fail "Create customer"

DETAIL=$(curl -sf "$API/crm/customers/$NEW_ID" "${AUTH[@]}")
[ "$(echo "$DETAIL" | jq -r '.data.name')" = "Smoke E2E Co" ] && ok "Get customer detail" || fail "Get customer detail"

curl -sf -X PUT "$API/crm/customers/$NEW_ID" "${AUTH[@]}" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Smoke E2E Co (updated)"}' >/dev/null && ok "Update customer" || fail "Update customer"

curl -sf -X DELETE "$API/crm/customers/$NEW_ID" "${AUTH[@]}" >/dev/null && ok "Delete customer" || fail "Delete customer"

# ── 4. Sales — invoice → payment flow ─────────────────────
echo "→ Sales"
CUST_ID=$(curl -sf "$API/crm/customers?per_page=1" "${AUTH[@]}" | jq -r '.data[0].id')
INV=$(curl -sf -X POST "$API/sales/invoices" "${AUTH[@]}" \
  -H 'Content-Type: application/json' \
  -d '{
    "customer_id":'$CUST_ID',
    "issue_date":"'$(date +%F)'",
    "due_date":"'$(date -d '+30 days' +%F 2>/dev/null || date -v+30d +%F 2>/dev/null || date +%F)'",
    "items":[{"description":"Widget","quantity":10,"unit_price":50,"tax_percent":10}]
  }')
INV_ID=$(echo "$INV" | jq -r '.data.id')
INV_TOTAL=$(echo "$INV" | jq -r '.data.total')
[ "$INV_TOTAL" = "550" ] && ok "Create invoice (total $INV_TOTAL)" || fail "Invoice total expected 550, got $INV_TOTAL"

curl -sf -X POST "$API/sales/invoices/$INV_ID/post" "${AUTH[@]}" >/dev/null && ok "Post invoice" || fail "Post invoice"

curl -sf -X POST "$API/sales/invoices/$INV_ID/payments" "${AUTH[@]}" \
  -H 'Content-Type: application/json' -d '{"amount":550,"method":"bank"}' >/dev/null \
  && ok "Record full payment" || fail "Record payment"

STATUS=$(curl -sf "$API/sales/invoices/$INV_ID" "${AUTH[@]}" | jq -r '.data.status')
[ "$STATUS" = "paid" ] && ok "Invoice status → paid" || fail "Invoice status=$STATUS (expected paid)"

# ── 5. Purchase — PO → GRN → stock ────────────────────────
echo "→ Purchase / Inventory"
SUP=$(curl -sf "$API/purchases/suppliers?per_page=1" "${AUTH[@]}" | jq -r '.data[0].id')
PROD=$(curl -sf "$API/inventory/products?per_page=1" "${AUTH[@]}" | jq -r '.data[0].id')
WH=$(curl -sf "$API/inventory/warehouses?per_page=1" "${AUTH[@]}" | jq -r '.data[0].id')

PO=$(curl -sf -X POST "$API/purchases/orders" "${AUTH[@]}" \
  -H 'Content-Type: application/json' -d '{
    "supplier_id":'$SUP',
    "order_date":"'$(date +%F)'",
    "items":[{"product_id":'$PROD',"description":"X","quantity":50,"unit_price":20}]
  }')
PO_ID=$(echo "$PO" | jq -r '.data.id')
ok "Create PO (#$PO_ID)"

curl -sf -X POST "$API/purchases/orders/$PO_ID/approve" "${AUTH[@]}" >/dev/null && ok "Approve PO" || fail "Approve PO"

GRN=$(curl -sf -X POST "$API/purchases/grns" "${AUTH[@]}" \
  -H 'Content-Type: application/json' -d '{
    "purchase_order_id":'$PO_ID',
    "warehouse_id":'$WH',
    "received_date":"'$(date +%F)'",
    "items":[{"product_id":'$PROD',"quantity_ordered":50,"quantity_received":50}]
  }')
GRN_ID=$(echo "$GRN" | jq -r '.data.id')
curl -sf -X POST "$API/purchases/grns/$GRN_ID/receive" "${AUTH[@]}" >/dev/null && ok "Receive GRN" || fail "Receive GRN"

QTY=$(curl -sf "$API/inventory/levels?filter[warehouse_id]=$WH&filter[product_id]=$PROD" "${AUTH[@]}" | jq -r '.data[0].quantity // 0')
[ "$QTY" -ge 50 ] && ok "Stock incremented (qty=$QTY)" || fail "Stock increment (qty=$QTY)"

# ── 6. HR — leave approve ─────────────────────────────────
echo "→ HR"
LEAVE_ID=$(curl -sf "$API/hr/leaves?filter[status]=pending&per_page=1" "${AUTH[@]}" | jq -r '.data[0].id')
if [ "$LEAVE_ID" != "null" ] && [ -n "$LEAVE_ID" ]; then
  curl -sf -X PATCH "$API/hr/leaves/$LEAVE_ID/approve" "${AUTH[@]}" \
    -H 'Content-Type: application/json' -d '{"note":"OK"}' >/dev/null \
    && ok "Approve leave #$LEAVE_ID" || fail "Approve leave"
else
  echo "  ⚠ no pending leave to approve"
fi

# ── 7. Tasks — kanban move ────────────────────────────────
echo "→ Tasks"
TASK_ID=$(curl -sf "$API/tasks?per_page=1" "${AUTH[@]}" | jq -r '.data[0].id')
curl -sf -X PATCH "$API/tasks/$TASK_ID/move-status" "${AUTH[@]}" \
  -H 'Content-Type: application/json' -d '{"status":"in_progress","position":0}' >/dev/null \
  && ok "Move task to in_progress" || fail "Move task"

# ── 8. Cross-tenant isolation ─────────────────────────────
echo "→ Security"
FOREIGN_ID=$((999999))
curl -sf "$API/crm/customers/$FOREIGN_ID" "${AUTH[@]}" -o /dev/null -w "%{http_code}" 2>/dev/null | grep -q 404 \
  && ok "Cross-tenant access blocked" || fail "Cross-tenant access"

# ── 9. Logout ─────────────────────────────────────────────
curl -sf -X POST "$API/auth/logout" "${AUTH[@]}" >/dev/null && ok "Logout" || fail "Logout"

# ── 10. Token revoked ─────────────────────────────────────
CODE=$(curl -s "$API/auth/me" "${AUTH[@]}" -o /dev/null -w "%{http_code}")
[ "$CODE" = "401" ] && ok "Token revoked after logout" || fail "Token still valid (code=$CODE)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " PASS: $PASS_COUNT"
echo " FAIL: $FAIL_COUNT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit $FAIL_COUNT

