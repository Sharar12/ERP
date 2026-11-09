<?php
namespace Database\Seeders;

use App\Models\Auth\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            'crm', 'sales', 'purchases', 'inventory', 'finance',
            'hr', 'projects', 'tasks', 'documents', 'manufacturing',
            'quality', 'assets', 'helpdesk', 'reports', 'settings',
        ];
        $actions = ['view', 'create', 'update', 'delete', 'export', 'approve'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::updateOrCreate(
                    ['slug' => "{$module}.{$action}"],
                    [
                        'name' => ucfirst($action) . ' ' . ucfirst($module),
                        'module' => $module,
                        'group' => ucfirst($module),
                    ]
                );
            }
        }
    }
}
