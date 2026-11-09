<?php
namespace Database\Seeders;

use App\Models\Core\{Organization, Branch, Department, Location};
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        // Phase 1 mock: 3 organizations
        $orgs = [
            ['name' => 'Acme Corp',      'industry' => 'manufacturing', 'country' => 'US'],
            ['name' => 'Nova Retail',    'industry' => 'retail',        'country' => 'GB'],
            ['name' => 'Helix Software', 'industry' => 'software',      'country' => 'DE'],
        ];

        foreach ($orgs as $data) {
            $org = Organization::factory()->create($data);

            // 3 branches per org (1 HQ + 2)
            Branch::create([
                'organization_id' => $org->id,
                'name' => 'Headquarters',
                'code' => 'HQ',
                'is_headquarters' => true,
            ]);
            Branch::create(['organization_id' => $org->id, 'name' => 'East Branch', 'code' => 'EAST']);
            Branch::create(['organization_id' => $org->id, 'name' => 'West Branch', 'code' => 'WEST']);

            // 5 departments per org (Phase 1 mock listed 5)
            foreach (['Sales', 'Finance', 'Operations', 'HR', 'IT'] as $dept) {
                Department::create([
                    'organization_id' => $org->id,
                    'branch_id' => $org->branches()->first()->id,
                    'name' => $dept,
                    'code' => strtoupper(substr($dept, 0, 3)),
                ]);
            }

            // 3 locations (Phase 1: 3)
            foreach (['Main Office', 'Warehouse 1', 'Plant A'] as $i => $loc) {
                Location::create([
                    'organization_id' => $org->id,
                    'branch_id' => $org->branches()->first()->id,
                    'name' => $loc,
                    'type' => $i === 0 ? 'office' : ($i === 1 ? 'warehouse' : 'plant'),
                    'city' => fake()->city(),
                    'country' => $data['country'],
                ]);
            }
        }
    }
}
