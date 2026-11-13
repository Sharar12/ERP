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
            $companies = collect(range(1, 3))->map(fn ($i) => Company::create([
                'organization_id' => $org->id,
                'name' => fake()->company(),
                'industry' => fake()->randomElement(['Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Finance']),
                'website' => fake()->domainName(),
                'phone' => fake()->phoneNumber(),
                'email' => fake()->companyEmail(),
                'city' => fake()->city(),
                'country' => 'US',
            ]));

            // 20 customers per org
            Customer::factory()->count(20)->create([
                'organization_id' => $org->id,
                'branch_id' => $org->branches()->first()?->id,
                'customer_group_id' => fn () => $groupModels->random()->id,
                'company_id' => fn () => $companies->random()->id,
            ]);

            // 6 leads per org
            for ($i = 0; $i < 6; $i++) {
                Lead::create([
                    'organization_id' => $org->id,
                    'branch_id' => $org->branches()->first()?->id,
                    'name' => fake()->name(),
                    'company_name' => fake()->company(),
                    'email' => fake()->safeEmail(),
                    'phone' => fake()->phoneNumber(),
                    'source' => fake()->randomElement(['website', 'referral', 'campaign', 'cold_call']),
                    'estimated_value' => fake()->numberBetween(5000, 50000),
                    'status' => fake()->randomElement(['new', 'contacted', 'qualified', 'proposal', 'won']),
                    'score' => fake()->numberBetween(10, 100),
                ]);
            }

            // 3 contacts per org
            $customers = Customer::where('organization_id', $org->id)->get();
            for ($i = 0; $i < 3; $i++) {
                Contact::create([
                    'organization_id' => $org->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'company_id' => $companies->random()->id,
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'email' => fake()->safeEmail(),
                    'phone' => fake()->phoneNumber(),
                    'job_title' => fake()->jobTitle(),
                    'is_primary' => $i === 0,
                ]);
            }

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

            for ($i = 0; $i < 3; $i++) {
                Opportunity::create([
                    'organization_id' => $org->id,
                    'pipeline_id' => $pipeline->id,
                    'stage_id' => $stages->random()->id,
                    'customer_id' => $customers->isNotEmpty() ? $customers->random()->id : null,
                    'name' => fake()->words(3, true) . ' Deal',
                    'value' => fake()->numberBetween(10000, 100000),
                    'expected_close_date' => now()->addDays(fake()->numberBetween(10, 60)),
                    'status' => fake()->randomElement(['open', 'won', 'lost']),
                ]);
            }
        }
    }
}
