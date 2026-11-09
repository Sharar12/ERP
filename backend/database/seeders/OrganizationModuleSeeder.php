<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\System\{Module, OrganizationModule};
use Illuminate\Database\Seeder;

class OrganizationModuleSeeder extends Seeder
{
    public function run(): void
    {
        // Phase 1 mock: manufacturing org has everything, retail has no manufacturing, software has no inventory/manufacturing
        $profiles = [
            'acme-corp'     => ['*'],                                           // manufacturing
            'nova-retail'   => ['dashboard','crm','sales','purchases','inventory','finance','hr','projects','tasks','documents','helpdesk','reports','assets'],
            'helix-software'=> ['dashboard','crm','sales','finance','hr','projects','tasks','documents','helpdesk','reports'],
        ];

        foreach (Organization::all() as $org) {
            $allowed = $profiles[$org->slug] ?? ['*'];
            $modules = $allowed === ['*'] ? Module::all() : Module::whereIn('key', $allowed)->get();

            foreach ($modules as $m) {
                OrganizationModule::create([
                    'organization_id' => $org->id,
                    'module_id' => $m->id,
                    'enabled' => true,
                    'enabled_at' => now(),
                ]);
            }
        }
    }
}
