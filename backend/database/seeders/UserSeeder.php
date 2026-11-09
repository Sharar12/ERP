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
        // Phase 1 mock: 5 users total
        $users = [
            ['name' => 'Alice Chen',   'email' => 'alice@acme.test',   'role' => 'admin'],
            ['name' => 'Bob Martinez', 'email' => 'bob@acme.test',     'role' => 'manager'],
            ['name' => 'Carol Nguyen', 'email' => 'carol@acme.test',   'role' => 'accountant'],
            ['name' => 'David Park',   'email' => 'david@acme.test',   'role' => 'employee'],
            ['name' => 'Eva Schmidt',  'email' => 'eva@nova.test',     'role' => 'admin'],
        ];

        $orgs = Organization::all();

        foreach ($users as $u) {
            $org = $orgs->firstWhere('slug', 'like', '%acme%') ?? $orgs[1];
            if (str_contains($u['email'], 'nova')) $org = $orgs[1];

            $user = User::create([
                'organization_id' => $org->id,
                'branch_id' => $org->branches()->first()->id,
                'department_id' => $org->departments()->first()->id,
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('password'),
                'status' => 'active',
            ]);

            $role = Role::where('organization_id', $org->id)->where('slug', $u['role'])->first();
            if ($role) $user->roles()->attach($role->id);

            // Phase 1 mock: 3 login history rows
            if (in_array($u['email'], ['alice@acme.test', 'bob@acme.test', 'carol@acme.test'])) {
                LoginHistory::create([
                    'user_id' => $user->id,
                    'ip_address' => fake()->ipv4(),
                    'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                    'device' => 'desktop',
                    'status' => 'success',
                    'logged_in_at' => now()->subDays(fake()->numberBetween(0, 5)),
                ]);
            }
        }
    }
}
