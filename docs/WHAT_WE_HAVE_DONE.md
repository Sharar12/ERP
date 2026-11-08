# Universal ERP — Build Log

Living document. Keep updated after each phase.

---

## Phase 1 — Frontend (Mock Data) · ✅ Complete

### Stack
- Next.js 14 (App Router) · TypeScript strict · Tailwind CSS
- lucide-react · recharts · next-themes
- Path aliases `@/*` → `src/*` · ESLint `next/core-web-vitals`

### Architecture (Phase 1 → Phase 3 ready)
- **Service contracts** in `src/types/index.ts` — `CrudService<T>` is the universal shape
- **Mock impls** in `src/services/mock/` — every service built on one `mockCrud(key, prefix)` factory
- **Facade** in `src/services/index.ts` — the ONLY thing UI imports
- **Provider switch** in `src/services/config/data-provider.ts` — flip `"mock"` → `"api"`
- **API placeholders** in `src/services/api/placeholder.ts`
- Every mock file tagged `MOCK DATA`, `MOCK SERVICE`, `MOCK CRUD`, `MOCK CONFIG` with its intended endpoint
- No UI component imports mock data directly

### Reusable UI
- **Primitives:** Button, Input, Select, Textarea, DatePicker, CurrencyInput, MultiSelect, FileUpload, Repeatable
- **Structure:** Card, Badge, Tabs, Tooltip, Modal, Drawer, ConfirmDialog
- **Feedback:** Toast (provider + hook), Skeleton/Spinner, EmptyState, ErrorState
- **Layout:** AppShell, Sidebar, Topbar, MobileNav, PageHeader, PageTransition

### UniversalDataTable
Config columns · sort · search · filters · pagination · row selection · bulk actions · column visibility · density · row actions · CSV export · custom cells · loading state · responsive.

### Modules shipped
| Module | Pages | Highlights |
|---|---|---|
| **Dashboard** | 1 | KPIs, revenue area, category donut, monthly bar, cash-flow line, recent tx, activity feed, pending approvals, upcoming tasks, low-stock, attendance overview, date filters, widget show/hide |
| **CRM** | 5 | Dashboard, Customers (CRUD + profile page), Leads (CRUD), Contacts (CRUD), Pipeline (drag-drop Kanban) |
| **Sales** | 7 | Dashboard, Invoices (list + detail modal), Orders, Quotations, Payments, Returns, Rep targets |
| **Purchases** | 8 | Dashboard, Suppliers, Orders, Requests, RFQs, GRNs, Returns, Payments |
| **Inventory** | 8 | Dashboard, Products (CRUD + detail), Warehouses, Transfers, Adjustments, Movements, Valuation, Batches |
| **Finance** | 11 | Dashboard, COA, Ledger, Journal, Receivables, Payables, Bank, Reconciliation, Budgets, Statements (P&L / BS / CF tabs), Transactions |
| **HR** | 9 | Dashboard, Employees (CRUD + profile with Attendance / Leaves / Docs tabs), Attendance, Leaves (approve/reject), Shifts, Payroll, Recruitment, Performance |
| **Projects** | 4 | Dashboard, Listing, Detail (Tasks / Milestones / Time / Timeline tabs), Kanban, Time Tracking |
| **Tasks** | 1 | List / Board / Calendar views |
| **Documents** | 1 | Library, folders, upload zone, version display |
| **Manufacturing** | 1 | BOMs, orders, work centers |
| **Quality** | 1 | Inspections, NCRs |
| **Assets** | 1 | Registry, maintenance history |
| **Helpdesk** | 1 | Tickets + Knowledge base tabs |
| **Notifications** | 1 | Inbox + announcements |
| **Activity** | 1 | Org-wide activity log |
| **Reports** | 1 | Report catalogue + custom report builder |
| **Users** | 2 | Listing + CRUD + profile with login history and permission display |
| **Roles** | 2 | Listing + permission matrix editor |
| **Organization** | 5 | Profile, Modules (toggle + dependencies), Branches, Departments, Locations |
| **Auth** | 1 | Login (mock auth) |

### Design system
- Light + dark theme (persisted via `next-themes`)
- Modern tech aesthetic: near-black ink, one indigo accent, border-first cards, tight radii (6–8 px), tabular numerals, small-caps labels
- Grid/dot background textures (`.bg-grid`, `.bg-dots`, `.bg-grid-fade`)
- GPU-safe animations (transform/opacity only) · `prefers-reduced-motion` respected
- Toast system, confirm dialogs, drawers, skeletons, empty & error states
- Full mobile → desktop responsiveness

### Mock data inventory
| Entity | Count |
|---|---|
| Organizations / Branches / Roles / Users | 3 / 3 / 5 / 5 |
| Customers / Leads / Contacts / Opportunities | 20 / 6 / 3 / 3 |
| Invoices / Sales orders / Quotations / Returns / Payments / Targets | 12 / 4 / 3 / 2 / 3 / 2 |
| Suppliers / POs / Requests / RFQs / GRNs / Supplier payments | 5 / 4 / 2 / 2 / 2 / 2 |
| Products / Warehouses / Batches / Movements | 12 / 2 / 2 / 20 |
| Transactions / COA / Journal / Bank / Budgets | 8 / 9 / 3 / 3 / 4 |
| Employees / Attendance / Leaves / Shifts / Payroll / Jobs / Reviews | 15 / 5 / 3 / 3 / 3 / 3 / 3 |
| Projects / Tasks / Milestones / Time entries | 5 / 6 / 4 / 3 |
| Documents / BOMs / MOs / Work centers | 5 / 2 / 2 / 3 |
| Inspections / NCRs / Assets / Maintenance | 2 / 2 / 4 / 2 |
| Tickets / KB / Announcements / Activity | 3 / 3 / 2 / 5 |
| Departments / Locations / Login history | 5 / 3 / 3 |

All entities are cross-referenced (invoices → customers, POs → suppliers, MOs → products, etc.).

### Quality gates passed
- ✅ Every sidebar link resolves
- ✅ Every CRUD flow works end-to-end (create / read / update / delete + toast feedback)
- ✅ Every filter, sort, search, pagination operates
- ✅ Every chart renders & animates
- ✅ Dark mode + responsive tested on 3 breakpoints
- ✅ Loading, empty, error states present on all data views
- ✅ Every mock touched by UI is behind a service

---

## Phase 2 — MySQL Database · ⬜ Not started

**Gate:** Phase 1 must be signed off first.

Planned scope:
- Multi-tenant schema (org → branch → user scoping)
- Module-per-org configuration tables
- RBAC (roles / permissions / role_permissions / user_roles)
- Business module tables for every Phase 1 entity
- Audit logs, notifications, custom fields
- Laravel migrations + seeders matching Phase 1 seed counts

## Phase 3 — Laravel Backend · ⬜ Not started

**Gate:** Phase 2 migrations approved.

Planned scope:
- REST API `/api/v1/{module}/{entity}` matching Phase 1 service contracts
- Sanctum auth · RBAC middleware · org/branch isolation
- Business-logic services (sales workflow, inventory calc, payroll)
- API impls dropped into `src/services/api/*.api-service.ts`
- Flip `PROVIDER = "api"` in `data-provider.ts` — UI unchanged

---

## Running locally

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000 → redirects to /dashboard
```

Login page: `http://localhost:3000/login` (any credentials work).

## Mock → API migration checklist

1. `grep -rn "MOCK" src/` — every entry is annotated with its target endpoint
2. Implement `src/services/api/*.api-service.ts` matching the same `CrudService<T>` contract
3. Change `PROVIDER = "api"` in `src/services/config/data-provider.ts`
4. Delete `src/services/mock/*` (or keep for tests)
5. Verify no UI file still imports from `src/mock-data/*` directly (should be zero)

