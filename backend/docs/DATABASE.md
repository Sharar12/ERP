# Universal ERP — Database Reference

## Conventions
- **PKs** — `id` (bigint unsigned, auto-increment) on every table.
- **Timestamps** — `created_at`, `updated_at` on all tables. `deleted_at` (soft delete) on business tables.
- **Tenant column** — every business table has `organization_id` FK → `organizations.id`.
- **Branch column** — tables under a branch (inventory, sales, purchases, finance, HR, projects) also have `branch_id` FK → `branches.id`, nullable.
- **Money** — `decimal(15,2)`. **Quantity** — `decimal(15,3)`. **Rates/percent** — `decimal(5,2)`. **Unit cost** — `decimal(15,4)`.
- **Enums** — modelled as MySQL `enum` for status fields. Changing a status requires a migration — intentional to prevent drift.
- **JSON columns** — settings, snapshots, custom data. Indexed via generated columns where queried.
- **Polymorphic relations** — `payable`, `subject`, `shareable`, `reference` (morphs) — each generates a `*_type` + `*_id` pair with a compound index.

## Table map

| Domain | Tables |
|---|---|
| **Core** | organizations, branches, departments, business_units, locations, document_sequences |
| **Auth** | users, roles, permissions, role_permissions, user_roles, user_invitations, login_history, password_reset_tokens, sessions |
| **System** | modules, module_dependencies, organization_modules, module_settings, organization_settings, audit_logs, activity_logs, notifications, announcements, custom_fields, custom_field_values |
| **CRM** | customer_groups, companies, customers, leads, contacts, pipelines, pipeline_stages, opportunities, follow_ups, customer_activities, customer_notes |
| **Sales** | sales_document_items, quotations, sales_orders, invoices, sales_returns, credit_notes, payments, sales_targets, discounts |
| **Purchase** | suppliers, purchase_requests, purchase_requisitions, rfqs, rfq_suppliers, supplier_quotations, purchase_orders, purchase_order_items, goods_received_notes, goods_received_items, purchase_invoices, purchase_returns, supplier_payments, approval_workflows, approval_steps, approval_requests |
| **Inventory** | product_categories, uoms, products, product_variants, warehouses, storage_locations, stock_levels, stock_movements, stock_transfers, stock_transfer_items, stock_adjustments, stock_adjustment_items, product_batches, serial_numbers |
| **Finance** | chart_of_accounts, journal_entries, journal_entry_lines, bank_accounts, bank_transactions, bank_reconciliations, taxes, financial_periods, cost_centers, budgets, transactions, ledger_entries |
| **HR** | designations, employees, employment_contracts, shifts, attendance, leave_types, leaves, salary_structures, employee_benefits, payroll_runs, payroll_items, performance_reviews, recruitment_jobs, job_applications, employee_documents, onboarding_tasks |
| **Projects** | projects, project_members, milestones, project_expenses, project_budgets |
| **Tasks** | task_lists, tasks, task_comments, task_attachments, task_dependencies, task_reminders, workflow_rules, time_entries |
| **Documents** | document_folders, documents, document_versions, document_shares, document_approvals |
| **Manufacturing** | work_centers, boms, bom_items, bom_operations, manufacturing_orders, work_orders, material_consumptions, production_plans |
| **Quality** | quality_standards, quality_inspections, non_conformance_reports, corrective_actions |
| **Assets** | asset_categories, assets, asset_assignments, maintenance_records, depreciation_records |
| **Helpdesk** | ticket_categories, sla_policies, tickets, ticket_replies, knowledge_base_articles |
| **Queue** | jobs, job_batches, failed_jobs, personal_access_tokens |

## Indexes summary
- Tenant scope: `(organization_id, <status/date>)` composite on every high-volume business table.
- Search: `email` on customers/suppliers/users; `sku` on products; `number` on every numbered document.
- Lookup: `(entity_type, entity_id)` on polymorphic tables.
- Time-series: `(organization_id, moved_at)` on stock_movements, `(organization_id, account_id, entry_date)` on ledger_entries.

## Seeder inventory (matches Phase 1 mock counts)

| Entity | Seeded count / org |
|---|---|
| Organizations | 3 (global) |
| Branches / Departments / Locations | 3 / 5 / 3 |
| Roles / Users / Login history | 5 / 5 total / 3 |
| Customer groups / Companies / Customers | 3 / 3 / 20 |
| Leads / Contacts / Opportunities | 6 / 3 / 3 |
| Invoices / Sales orders / Quotations / Returns / Payments / Targets | 12 / 4 / 3 / 2 / 3 / 2 |
| Suppliers / POs / Requests / RFQs / GRNs / Supplier payments | 5 / 4 / 2 / 2 / 2 / 2 |
| Products / Warehouses / Batches / Movements | 12 / 2 / 2 / 20 |
| COA / Transactions / Journal entries / Bank accounts / Budgets | 9 / 8 / 3 / 3 / 4 |
| Employees / Attendance / Leaves / Shifts / Payroll runs / Jobs / Reviews | 15 / 5 / 3 / 3 / 3 / 3 / 3 |
| Projects / Tasks / Milestones / Time entries | 5 / 6 / 4 / 3 |
| Documents / BOMs / MOs / Work centers | 5 / 2 / 2 / 3 |
| Inspections / NCRs / Assets / Maintenance | 2 / 2 / 4 / 2 |
| Tickets / KB / Announcements / Activity logs | 3 / 3 / 2 / 5 |
