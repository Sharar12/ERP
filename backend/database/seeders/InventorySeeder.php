<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Inventory\{Product, Warehouse, ProductBatch, StockMovement};
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            // 2 warehouses
            $warehouses = Warehouse::factory()->count(2)->create(['organization_id' => $org->id]);

            // 12 products
            $products = Product::factory()->count(12)->create([
                'organization_id' => $org->id,
            ]);

            // 2 batches
            foreach ($products->take(2) as $product) {
                ProductBatch::create([
                    'organization_id' => $org->id,
                    'product_id' => $product->id,
                    'batch_number' => 'BATCH-' . fake()->numerify('#####'),
                    'manufacture_date' => now()->subMonths(2),
                    'expiry_date' => now()->addMonths(10),
                    'quantity' => fake()->numberBetween(50, 500),
                ]);
            }

            // 20 stock movements
            for ($i = 0; $i < 20; $i++) {
                StockMovement::create([
                    'organization_id' => $org->id,
                    'warehouse_id' => $warehouses->random()->id,
                    'product_id' => $products->random()->id,
                    'type' => fake()->randomElement(['in', 'out', 'adjustment']),
                    'quantity' => fake()->numberBetween(1, 50),
                    'unit_cost' => fake()->randomFloat(2, 5, 200),
                    'balance_after' => fake()->numberBetween(0, 500),
                    'moved_at' => now()->subDays(fake()->numberBetween(0, 30)),
                ]);
            }
        }
    }
}
