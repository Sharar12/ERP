<?php
// database/seeders/QualitySeeder.php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Quality\{QualityInspection, NonConformanceReport};
use App\Models\Inventory\Product;
use Illuminate\Database\Seeder;

class QualitySeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            // 2 inspections
            foreach (Product::where('organization_id', $org->id)->take(2)->get() as $product) {
                QualityInspection::create([
                    'organization_id' => $org->id,
                    'subject_type' => Product::class,
                    'subject_id' => $product->id,
                    'inspection_date' => now()->subDays(fake()->numberBetween(1, 10)),
                    'result' => fake()->randomElement(['pass', 'fail', 'conditional']),
                ]);
            }

            // 2 NCRs
            for ($i = 0; $i < 2; $i++) {
                NonConformanceReport::create([
                    'organization_id' => $org->id,
                    'number' => 'NCR-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'date' => now()->subDays(fake()->numberBetween(1, 10)),
                    'description' => fake()->sentence(10),
                    'severity' => fake()->randomElement(['minor', 'major']),
                    'status' => 'open',
                ]);
            }
        }
    }
}
