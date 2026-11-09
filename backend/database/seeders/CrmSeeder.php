<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Crm\{CustomerGroup, Company, Customer, Lead, Contact, Opportunity, Pipeline, PipelineStage};
use Illuminate\Database\Seeder;

class CrmSeeder extends Seeder
{
    public function run(): void
    {
        // Phase 1 mock: 3 customer groups
        $groups = ['Retail', 'Wholesale', 'VIP'];

        foreach (Organization::all() as $org) {
            // 3 customer groups
            $groupModels = collect($groups)->map(fn ($g) => CustomerGroup::create([
                'organization_id' => $org->id,
                'name' => $g,
                'discount_percent' => $g === 'VIP' ? 15 : ($g === 'Wholesale' ? 10 : 0),
            ]));

            // 3 companies (Phase 1 mock has 3 companies per CRM)
            $companies = Company::factory()->count(3)->create(['organization_id' => $org->id]);

            // 20 customers per org
            Customer::factory()->count(20)->create([
                'organization_id' => $org->id,
                'branch_id' => $org->branches()->first()->id,
                'customer_group_id' => fn () => $groupModels->random()->id,
                'company_id' => fn () => $companies->random()->id,
            ]);

            // 6 leads per org
            Lead::factory()->count(6)->create(['organization_id' => $org->id]);

            // 3 contacts per org
            $customers = Customer::where('organization_id', $org->id)->get();
            Contact::factory()->count(3)->create([
                'organization_id' => $org->id,
                'customer_id' => fn () => $customers->random()->id,
            ]);

            // 3 opportunities + pipeline
            $pipeline = Pipeline::create(['organization_id' => $org->id, 'name' => 'Sales', 'is_default' => true]);
            $stageNames = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
            $stages = collect($stageNames)->map(function ($name, $i) use ($pipeline) {
                return PipelineStage::create([
                    'pipeline_id' => $pipeline->id,
                    'name' => $name,
                    'sort_order' => $i,
                    'probability' => $i * 20,
                ]);
            });

            Opportunity::factory()->count(3)->create([
                'organization_id' => $org->id,
                'pipeline_id' => $pipeline->id,
                'stage_id' => fn () => $stages->random()->id,
                'customer_id' => fn () => $customers->random()->id,
            ]);
        }
    }
}
