<?php
namespace Database\Seeders;

use App\Models\Auth\{Role, Permission};
use App\Models\Core\Organization;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Phase 1 mock: 5 roles
        $roleDefs = [
            ['slug' => 'super-admin', 'name' => 'Super Admin',       'permissions' => '*'],
            ['slug' => 'admin',       'name' => 'Organization Admin', 'permissions' => '*'],
            ['slug' => 'manager',     'name' => 'Manager',           'permissions' => ['view', 'create', 'update', 'export']],
            ['slug' => 'accountant',  'name' => 'Accountant',        'permissions' => ['view', 'create', 'update', 'export']],
            ['slug' => 'employee',    'name' => 'Employee',          'permissions' => ['view']],
        ];

        $allPermissions = Permission::all();

        foreach (Organization::all() as $org) {
            foreach ($roleDefs as $def) {
                $role = Role::create([
                    'organization_id' => $org->id,
                    'name' => $def['name'],
                    'slug' => $def['slug'],
                    'is_system' => true,
                ]);

                $perms = $def['permissions'] === '*'
                    ? $allPermissions
                    : $allPermissions->filter(fn ($p) => in_array(explode('.', $p->slug)[1], $def['permissions']));

                $role->permissions()->sync($perms->pluck('id'));
            }
        }
    }
}
