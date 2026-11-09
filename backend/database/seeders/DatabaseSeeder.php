<?php
// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. Foundations
            ModuleSeeder::class,
            PermissionSeeder::class,
            OrganizationSeeder::class,      // 3 orgs + 3 branches + 5 depts + 3 locations
            RoleSeeder::class,              // 5 roles per org
            UserSeeder::class,              // 5 users + 3 login_history rows
            OrganizationModuleSeeder::class,

            // 2. Business data
            CrmSeeder::class,               // 20 customers, 6 leads, 3 contacts, 3 opps, 3 groups
            InventorySeeder::class,         // 12 products, 2 warehouses, 2 batches, 20 movements
            SalesSeeder::class,             // 12 invoices, 4 orders, 3 quotes, 2 returns, 3 payments, 2 targets
            PurchaseSeeder::class,          // 5 suppliers, 4 POs, 2 requests, 2 RFQs, 2 GRNs, 2 payments
            FinanceSeeder::class,           // 9 COA, 8 transactions, 3 journals, 3 bank, 4 budgets
            HrSeeder::class,                // 15 employees, 5 attendance, 3 leaves, 3 shifts, 3 payroll runs, 3 jobs, 3 reviews
            ProjectSeeder::class,           // 5 projects, 6 tasks, 4 milestones, 3 time entries
            DocumentSeeder::class,          // 5 documents
            ManufacturingSeeder::class,     // 2 BOMs, 2 MOs, 3 work centers
            QualitySeeder::class,           // 2 inspections, 2 NCRs
            AssetSeeder::class,             // 4 assets, 2 maintenance
            HelpdeskSeeder::class,          // 3 tickets, 3 KB
            ActivitySeeder::class,          // 5 activity logs + 2 announcements
        ]);
    }
}
