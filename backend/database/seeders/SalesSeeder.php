<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Crm\Customer;
use App\Models\Sales\{Invoice, SalesOrder, Quotation, SalesReturn, Payment, SalesTarget};
use App\Models\Auth\User;
use Illuminate\Database\Seeder;

class SalesSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            $customers = Customer::where('organization_id', $org->id)->get();
            $users = User::where('organization_id', $org->id)->get();

            // Phase 1 mock: 12 invoices
            Invoice::factory()->count(12)->create(['organization_id' => $org->id]);

            // 4 sales orders
            SalesOrder::factory()->count(4)->create([
                'organization_id' => $org->id,
                'customer_id' => fn () => $customers->random()->id,
                'sales_rep_id' => fn () => $users->random()->id,
            ]);

            // 3 quotations
            Quotation::factory()->count(3)->create([
                'organization_id' => $org->id,
                'customer_id' => fn () => $customers->random()->id,
            ]);

            // 2 sales returns
            SalesReturn::factory()->count(2)->create([
                'organization_id' => $org->id,
                'customer_id' => fn () => $customers->random()->id,
            ]);

            // 3 payments
            foreach (Invoice::where('organization_id', $org->id)->take(3)->get() as $inv) {
                Payment::create([
                    'organization_id' => $org->id,
                    'customer_id' => $inv->customer_id,
                    'payable_type' => Invoice::class,
                    'payable_id' => $inv->id,
                    'payment_date' => now()->subDays(5),
                    'amount' => round($inv->total * 0.5, 2),
                    'method' => 'bank',
                ]);
            }

            // 2 sales targets
            foreach ($users->take(2) as $user) {
                SalesTarget::create([
                    'organization_id' => $org->id,
                    'user_id' => $user->id,
                    'period' => now()->format('Y-m'),
                    'target_amount' => 50000,
                    'achieved_amount' => fake()->numberBetween(10000, 50000),
                ]);
            }
        }
    }
}
