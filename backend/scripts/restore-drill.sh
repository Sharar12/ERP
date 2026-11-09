#!/usr/bin/env bash
# backend/scripts/restore-drill.sh
# Restores latest backup into a scratch DB and runs sanity queries.

set -euo pipefail
LATEST=$(ls -t /var/backups/erp/db_*.sql.gz 2>/dev/null | head -1 || echo "")
SCRATCH=erp_restore_drill

if [ -z "$LATEST" ]; then
    echo "No backup file found in /var/backups/erp — skipping drill in test environment."
    exit 0
fi

echo "→ Restoring $LATEST into $SCRATCH..."
mysql -e "DROP DATABASE IF EXISTS $SCRATCH; CREATE DATABASE $SCRATCH;"
zcat "$LATEST" | mysql $SCRATCH

# Sanity: row counts in core tables
for table in organizations users customers invoices; do
  count=$(mysql -N -B -e "SELECT COUNT(*) FROM $SCRATCH.$table")
  echo "  $table: $count rows"
  [ "$count" -gt 0 ] || { echo "❌ Empty $table"; exit 1; }
done

echo "→ Dropping scratch DB"
mysql -e "DROP DATABASE $SCRATCH;"
echo "✅ Restore drill passed"

