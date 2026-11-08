# Universal ERP — Frontend (Phase 1)

Next.js + TypeScript + Tailwind CSS. **All data is mock** and lives under `src/mock-data/`. UI components consume data via `src/services/` — never directly from mock files.

## Running

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 → redirects to `/dashboard`.

## Mock → API migration map

| Concern | Mock (Phase 1) | API (Phase 3) |
|---|---|---|
| Data source | `src/mock-data/seed.ts` | Laravel `/api/v1/*` |
| Provider | `src/services/mock/*` | `src/services/api/*` |
| Config | `src/services/config/data-provider.ts` | flip `PROVIDER` |
| Auth | `authService` in `src/services/index.ts` | Sanctum token flow |

Every mock file starts with a `MOCK`-prefixed comment describing the endpoint that will replace it.

## Searchable markers

```bash
grep -rn "MOCK" src/
```

## Phase 1 completion summary

- ✅ Full layout (sidebar, topbar, breadcrumbs, org switcher, notifications, theme)
- ✅ Reusable UI kit (button, input, select, textarea, field, card, badge, modal, empty state)
- ✅ Universal DataTable (search, sort, pagination, column visibility, bulk actions)
- ✅ Dashboard with KPIs, revenue & category charts, recent invoices, low-stock alerts
- ✅ CRM Customers (full mock CRUD)
- ✅ Sales Invoices (list + detail modal)
- ✅ Purchases Suppliers + Purchase Orders
- ✅ Inventory Products (full mock CRUD) + Warehouses
- ✅ Finance Transactions
- ✅ HR Employees (full mock CRUD)
- ✅ Projects board
- ✅ Reports catalogue
- ✅ Module configuration (enable/disable, dependency-aware)
- ✅ Organization profile
- ✅ Login (mock auth)
- ✅ Dark mode, responsive layouts
- ✅ Service abstraction (contracts + mock impls + provider switch)
- ✅ Centralized, interconnected mock data with all Phase-1 datasets

## Notes

- Datasets are session-scoped (refreshing the browser restores the seed).
- Additional modules (Manufacturing, Quality, Assets, Helpdesk) have nav entries gated behind `MOCK_MODULES` and can be wired identically using the `mockCrud` helper.
