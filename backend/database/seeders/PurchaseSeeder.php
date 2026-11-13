<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Purchase\{
    Supplier, PurchaseRequest, PurchaseOrder, Rfq, GoodsReceivedNote, SupplierPayment
};
use Illuminate\Database\Seeder;

class PurchaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            // 5 suppliers (Phase 1 count)
            $suppliers = Supplier::factory()->count(5)->create(['organization_id' => $org->id]);

            // 4 purchase orders
            PurchaseOrder::factory()->count(4)->create([
                'organization_id' => $org->id,
                'supplier_id' => fn () => $suppliers->random()->id,
            ]);

            // 2 purchase requests
            for ($i = 0; $i < 2; $i++) {
                PurchaseRequest::create([
                    'organization_id' => $org->id,
                    'number' => 'PR-' . fake()->unique()->numerify('#####'),
                    'request_date' => now()->subDays(fake()->numberBetween(1, 15)),
                    'required_date' => now()->addDays(fake()->numberBetween(5, 30)),
                    'status' => fake()->randomElement(['draft', 'submitted', 'approved']),
                ]);
            }

            // 2 RFQs
            for ($i = 0; $i < 2; $i++) {
                Rfq::create([
                    'organization_id' => $org->id,
                    'number' => 'RFQ-' . fake()->unique()->numerify('#####'),
                    'issue_date' => now()->subDays(fake()->numberBetween(1, 10)),
                    'deadline' => now()->addDays(fake()->numberBetween(5, 20)),
                    'status' => fake()->randomElement(['draft', 'sent', 'awarded']),
                ]);
            }

            // 2 GRNs
            GoodsReceivedNote::factory()->count(2)->create([
                'organization_id' => $org->id,
                'purchase_order_id' => fn () => PurchaseOrder::where('organization_id', $org->id)->inRandomOrder()->value('id'),
            ]);

            // 2 supplier payments
            foreach ($suppliers->take(2) as $supplier) {
                SupplierPayment::create([
                    'organization_id' => $org->id,
                    'supplier_id' => $supplier->id,
                    'payment_date' => now()->subDays(10),
                    'amount' => fake()->randomFloat(2, 1000, 20000),
                    'method' => 'bank',
                ]);
            }
        }
    }
}
