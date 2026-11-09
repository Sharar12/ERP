<?php
namespace Database\Seeders;

use App\Models\System\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            ['key' => 'dashboard',     'name' => 'Dashboard',     'icon' => 'LayoutDashboard', 'category' => 'core',       'is_core' => true],
            ['key' => 'crm',           'name' => 'CRM',           'icon' => 'Users',           'category' => 'business'],
            ['key' => 'sales',         'name' => 'Sales',         'icon' => 'ShoppingCart',    'category' => 'business'],
            ['key' => 'purchases',     'name' => 'Purchases',     'icon' => 'Truck',           'category' => 'business'],
            ['key' => 'inventory',     'name' => 'Inventory',     'icon' => 'Package',         'category' => 'operations'],
            ['key' => 'finance',       'name' => 'Finance',       'icon' => 'Wallet',          'category' => 'business'],
            ['key' => 'hr',            'name' => 'HR',            'icon' => 'UserCog',         'category' => 'business'],
            ['key' => 'projects',      'name' => 'Projects',      'icon' => 'FolderKanban',    'category' => 'operations'],
            ['key' => 'tasks',         'name' => 'Tasks',         'icon' => 'CheckSquare',     'category' => 'operations'],
            ['key' => 'documents',     'name' => 'Documents',     'icon' => 'FileText',        'category' => 'operations'],
            ['key' => 'manufacturing', 'name' => 'Manufacturing', 'icon' => 'Factory',         'category' => 'operations'],
            ['key' => 'quality',       'name' => 'Quality',       'icon' => 'ShieldCheck',     'category' => 'operations'],
            ['key' => 'assets',        'name' => 'Assets',        'icon' => 'Boxes',           'category' => 'operations'],
            ['key' => 'helpdesk',      'name' => 'Helpdesk',      'icon' => 'Headphones',      'category' => 'support'],
            ['key' => 'reports',       'name' => 'Reports',       'icon' => 'BarChart3',       'category' => 'core',       'is_core' => true],
        ];

        foreach ($modules as $m) {
            Module::updateOrCreate(['key' => $m['key']], $m);
        }

        // Dependencies
        $this->linkDependency('sales', 'crm');
        $this->linkDependency('sales', 'inventory');
        $this->linkDependency('purchases', 'inventory');
        $this->linkDependency('manufacturing', 'inventory');
        $this->linkDependency('quality', 'manufacturing');
        $this->linkDependency('finance', 'sales');
        $this->linkDependency('finance', 'purchases');
    }

    private function linkDependency(string $module, string $dependsOn): void
    {
        $m = Module::where('key', $module)->first();
        $d = Module::where('key', $dependsOn)->first();
        $m->dependencies()->syncWithoutDetaching([$d->id]);
    }
}
