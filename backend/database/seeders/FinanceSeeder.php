<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Finance\{ChartOfAccount, Transaction, JournalEntry, BankAccount, Budget};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FinanceSeeder extends Seeder
{
    public function run(): void
    {
        $coaTemplate = [
            ['1000', 'Cash',            'asset',     'debit'],
            ['1100', 'Bank',            'asset',     'debit'],
            ['1200', 'Accounts Receivable', 'asset', 'debit'],
            ['2000', 'Accounts Payable','liability', 'credit'],
            ['2100', 'Tax Payable',     'liability', 'credit'],
            ['3000', 'Owner Equity',    'equity',    'credit'],
            ['4000', 'Sales Revenue',   'income',    'credit'],
            ['5000', 'Cost of Goods Sold','expense', 'debit'],
            ['6000', 'Operating Expenses','expense', 'debit'],
        ];

        foreach (Organization::all() as $org) {
            // Phase 1 mock: 9 COA per org
            $accounts = collect($coaTemplate)->map(fn ($row) => ChartOfAccount::create([
                'organization_id' => $org->id,
                'code' => $row[0],
                'name' => $row[1],
                'type' => $row[2],
                'normal_balance' => $row[3],
                'opening_balance' => 0,
            ]));

            // 3 bank accounts
            $banks = collect(['Operating Account', 'Payroll Account', 'Savings Account'])
                ->map(fn ($name, $i) => BankAccount::create([
                    'organization_id' => $org->id,
                    'name' => $name,
                    'account_number' => '****' . fake()->numerify('####'),
                    'bank_name' => fake()->company(),
                    'currency' => 'USD',
                    'opening_balance' => fake()->numberBetween(10000, 100000),
                    'current_balance' => fake()->numberBetween(10000, 100000),
                ]));

            // 8 transactions
            for ($i = 0; $i < 8; $i++) {
                Transaction::create([
                    'organization_id' => $org->id,
                    'bank_account_id' => $banks->random()->id,
                    'number' => 'TXN-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                    'type' => $i % 2 === 0 ? 'income' : 'expense',
                    'transaction_date' => now()->subDays(fake()->numberBetween(0, 60)),
                    'description' => fake()->sentence(3),
                    'amount' => fake()->randomFloat(2, 100, 15000),
                ]);
            }

            // 3 journal entries
            for ($i = 0; $i < 3; $i++) {
                $je = JournalEntry::create([
                    'organization_id' => $org->id,
                    'number' => 'JE-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                    'entry_date' => now()->subDays(fake()->numberBetween(0, 30)),
                    'status' => 'posted',
                    'posted_at' => now(),
                ]);
                DB::table('journal_entry_lines')->insert([
                    ['journal_entry_id' => $je->id, 'account_id' => $accounts->firstWhere('code', '1100')->id, 'debit' => 5000, 'credit' => 0, 'created_at' => now(), 'updated_at' => now()],
                    ['journal_entry_id' => $je->id, 'account_id' => $accounts->firstWhere('code', '4000')->id, 'debit' => 0, 'credit' => 5000, 'created_at' => now(), 'updated_at' => now()],
                ]);
            }

            // 4 budgets
            foreach ($accounts->take(4) as $account) {
                Budget::create([
                    'organization_id' => $org->id,
                    'account_id' => $account->id,
                    'name' => $account->name . ' budget',
                    'start_date' => now()->startOfYear(),
                    'end_date' => now()->endOfYear(),
                    'budgeted_amount' => fake()->numberBetween(50000, 500000),
                ]);
            }
        }
    }
}
