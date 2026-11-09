<?php
// database/seeders/AssetSeeder.php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Asset\{Asset, MaintenanceRecord};
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            // 4 assets
            $assets = collect(range(1, 4))->map(fn ($i) => Asset::create([
                'organization_id' => $org->id,
                'code' => 'AST-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'name' => fake()->words(3, true),
                'purchase_date' => now()->subYears(1),
                'purchase_cost' => fake()->numberBetween(1000, 50000),
                'current_value' => fake()->numberBetween(500, 40000),
                'status' => 'active',
            ]));

            // 2 maintenance records
            foreach ($assets->take(2) as $asset) {
                MaintenanceRecord::create([
                    'asset_id' => $asset->id,
                    'date' => now()->subDays(fake()->numberBetween(5, 30)),
                    'type' => 'preventive',
                    'description' => fake()->sentence(6),
                    'cost' => fake()->numberBetween(100, 2000),
                ]);
            }
        }
    }
}
