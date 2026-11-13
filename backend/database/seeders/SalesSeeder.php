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
            Invoice::factory()->count(12)->create([
                'organization_id' => $org->id,
                'customer_id' => fn () => $customers->random()->id,
            ]);

            // 4 sales orders
            for ($i = 0; $i < 4; $i++) {
                $sub = fake()->randomFloat(2, 500, 20000);
                $tax = round($sub * 0.1, 2);
                SalesOrder::create([
                    'organization_id' => $org->id,
                    'customer_id' => $customers->random()->id,
                    'sales_rep_id' => $users->isNotEmpty() ? $users->random()->id : null,
                    'number' => 'SO-' . fake()->unique()->numerify('#####'),
                    'order_date' => now()->subDays(fake()->numberBetween(1, 30)),
                    'expected_delivery' => now()->addDays(fake()->numberBetween(5, 20)),
                    'subtotal' => $sub,
                    'tax_total' => $tax,
                    'total' => $sub + $tax,
                    'status' => fake()->randomElement(['draft', 'confirmed', 'processing', 'delivered']),
                ]);
            }

            // 3 quotations
            for ($i = 0; $i < 3; $i++) {
                $sub = fake()->randomFloat(2, 500, 15000);
                $tax = round($sub * 0.1, 2);
                Quotation::create([
                    'organization_id' => $org->id,
                    'customer_id' => $customers->random()->id,
                    'sales_rep_id' => $users->isNotEmpty() ? $users->random()->id : null,
                    'number' => 'QT-' . fake()->unique()->numerify('#####'),
                    'issue_date' => now()->subDays(fake()->numberBetween(1, 20)),
                    'valid_until' => now()->addDays(fake()->numberBetween(10, 30)),
                    'subtotal' => $sub,
                    'tax_total' => $tax,
                    'total' => $sub + $tax,
                    'status' => fake()->randomElement(['draft', 'sent', 'accepted']),
                ]);
            }

            // 2 sales returns
            for ($i = 0; $i < 2; $i++) {
                SalesReturn::create([
                    'organization_id' => $org->id,
                    'customer_id' => $customers->random()->id,
                    'number' => 'RET-' . fake()->unique()->numerify('#####'),
                    'return_date' => now()->subDays(fake()->numberBetween(1, 15)),
                    'total' => fake()->randomFloat(2, 50, 1000),
                    'status' => fake()->randomElement(['draft', 'approved', 'received']),
                    'reason' => 'Defective or incorrect item',
                ]);
            }

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
