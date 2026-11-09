<?php
namespace Tests\Feature\Crm;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Crm\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $org = Organization::factory()->create();
        $perm = Permission::create(['name' => 'View CRM', 'slug' => 'crm.view', 'module' => 'crm', 'group' => 'CRM']);
        $create = Permission::create(['name' => 'Create CRM', 'slug' => 'crm.create', 'module' => 'crm', 'group' => 'CRM']);
        $role = Role::create(['organization_id' => $org->id, 'name' => 'Admin', 'slug' => 'admin']);
        $role->permissions()->sync([$perm->id, $create->id]);

        $this->user = User::create([
            'organization_id' => $org->id,
            'name' => 'Admin User',
            'email' => 'admin@org.test',
            'password' => bcrypt('password'),
            'status' => 'active',
        ]);
        $this->user->roles()->attach($role->id);
        $this->actingAs($this->user, 'sanctum');
    }

    public function test_can_list_customers_scoped_to_org(): void
    {
        $otherOrg = Organization::factory()->create();
        Customer::factory()->count(3)->create(['organization_id' => $this->user->organization_id]);
        Customer::factory()->count(5)->create(['organization_id' => $otherOrg->id]); // other org

        $this->getJson('/api/v1/crm/customers')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_customer(): void
    {
        $this->postJson('/api/v1/crm/customers', [
            'name' => 'Acme Industries',
            'email' => 'acme@example.com',
        ])->assertStatus(201)
          ->assertJsonPath('data.name', 'Acme Industries');
    }

    public function test_cannot_view_customer_from_other_org(): void
    {
        $otherOrg = Organization::factory()->create();
        $foreign = Customer::factory()->create(['organization_id' => $otherOrg->id]);
        $this->getJson("/api/v1/crm/customers/{$foreign->id}")
            ->assertStatus(404); // scoped out by global scope
    }
}

