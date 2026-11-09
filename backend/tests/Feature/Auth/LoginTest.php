<?php
namespace Tests\Feature\Auth;

use App\Models\Auth\User;
use App\Models\Core\Organization;
use App\Models\Auth\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        $org = Organization::factory()->create();
        $role = Role::create(['organization_id' => $org->id, 'name' => 'Admin', 'slug' => 'admin']);

        $user = User::create([
            'organization_id' => $org->id,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('secret123'),
            'status' => 'active',
        ]);
        $user->roles()->attach($role->id);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'secret123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['user' => ['id', 'email'], 'token']]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $org = Organization::factory()->create();
        $user = User::create([
            'organization_id' => $org->id,
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
            'password' => bcrypt('secret123'),
            'status' => 'active',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'wrong',
        ])->assertStatus(422);
    }

    public function test_unauthenticated_request_to_protected_route_returns_401(): void
    {
        $this->getJson('/api/v1/crm/customers')->assertStatus(401);
    }
}

