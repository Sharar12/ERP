<?php
namespace Database\Seeders;

use App\Models\Auth\{User, LoginHistory, Role};
use App\Models\Core\Organization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Seed users across orgs
        $users = [
            ['name' => 'Alice Chen',   'email' => 'alice@acme.test',   'role' => 'admin', 'org_slug' => 'acme'],
            ['name' => 'Bob Martinez', 'email' => 'bob@acme.test',     'role' => 'manager', 'org_slug' => 'acme'],
            ['name' => 'Carol Nguyen', 'email' => 'carol@acme.test',   'role' => 'accountant', 'org_slug' => 'acme'],
            ['name' => 'David Park',   'email' => 'david@acme.test',   'role' => 'employee', 'org_slug' => 'acme'],
            ['name' => 'Eva Schmidt',  'email' => 'eva@nova.test',     'role' => 'admin', 'org_slug' => 'nova'],
            ['name' => 'Liam Wilson',  'email' => 'liam@nova.test',    'role' => 'manager', 'org_slug' => 'nova'],
            ['name' => 'Frank Weber',  'email' => 'frank@helix.test',  'role' => 'admin', 'org_slug' => 'helix'],
            ['name' => 'Grace Lee',    'email' => 'grace@helix.test',  'role' => 'manager', 'org_slug' => 'helix'],
        ];

        $orgs = Organization::all();

        foreach ($users as $u) {
            $org = $orgs->first(fn ($o) => str_contains(strtolower($o->name), $u['org_slug']) || str_contains(strtolower($o->slug), $u['org_slug'])) ?? $orgs->first();

            $user = User::create([
                'organization_id' => $org->id,
                'branch_id' => $org->branches()->first()?->id,
                'department_id' => $org->departments()->first()?->id,
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('password'),
                'status' => 'active',
            ]);

            $role = Role::where('organization_id', $org->id)->where('slug', $u['role'])->first();
            if ($role) $user->roles()->attach($role->id);

            // Seed login history rows
            if (in_array($u['email'], ['alice@acme.test', 'bob@acme.test', 'carol@acme.test', 'frank@helix.test'])) {
                LoginHistory::create([
                    'user_id' => $user->id,
                    'ip_address' => fake()->ipv4(),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'device' => 'desktop',
                    'status' => 'success',
                    'logged_in_at' => now()->subDays(fake()->numberBetween(0, 5)),
                ]);
            }
        }
    }
}
