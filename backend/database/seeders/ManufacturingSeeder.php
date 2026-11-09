<?php
// database/seeders/ManufacturingSeeder.php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Inventory\Product;
use App\Models\Manufacturing\{WorkCenter, Bom, BomItem, ManufacturingOrder};
use Illuminate\Database\Seeder;

class ManufacturingSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            // 3 work centers (Phase 1 mock count)
            $centers = collect(['Assembly', 'Packaging', 'Quality'])->map(fn ($n) => WorkCenter::create([
                'organization_id' => $org->id,
                'name' => $n,
                'code' => strtoupper(substr($n, 0, 3)),
                'capacity_per_hour' => 50,
                'cost_per_hour' => 25,
            ]));

            $products = Product::where('organization_id', $org->id)->take(4)->get();

            // 2 BOMs
            foreach ($products->take(2) as $product) {
                $bom = Bom::create([
                    'organization_id' => $org->id,
                    'product_id' => $product->id,
                    'code' => 'BOM-' . str_pad($product->id, 3, '0', STR_PAD_LEFT),
                    'name' => $product->name . ' BOM',
                    'quantity' => 1,
                    'status' => 'active',
                ]);

                foreach ($products->where('id', '!=', $product->id)->take(2) as $component) {
                    BomItem::create([
                        'bom_id' => $bom->id,
                        'component_product_id' => $component->id,
                        'quantity' => fake()->numberBetween(1, 5),
                    ]);
                }

                // 2 MOs
                ManufacturingOrder::create([
                    'organization_id' => $org->id,
                    'bom_id' => $bom->id,
                    'product_id' => $product->id,
                    'number' => 'MO-' . str_pad($bom->id, 4, '0', STR_PAD_LEFT),
                    'quantity' => 100,
                    'start_date' => now()->addDays(2),
                    'due_date' => now()->addDays(14),
                    'status' => 'planned',
                ]);
            }
        }
    }
}
