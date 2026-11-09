<?php

namespace Tests\Feature;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\{Organization, Branch};
use App\Models\Crm\Customer;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_organization_cannot_see_another_organizations_branches(): void
    {
        $orgA = Organization::factory()->create();
        $orgB = Organization::factory()->create();

        $branchA = Branch::create(['organization_id' => $orgA->id, 'name' => 'Branch A', 'code' => 'BR-A', 'is_active' => true]);
        $branchB = Branch::create(['organization_id' => $orgB->id, 'name' => 'Branch B', 'code' => 'BR-B', 'is_active' => true]);

        $userA = User::factory()->create(['organization_id' => $orgA->id, 'status' => 'active']);
        $this->actingAs($userA, 'sanctum');

        $branches = Branch::all();
        $this->assertCount(1, $branches);
        $this->assertSame('Branch A', $branches->first()->name);
    }

    public function test_creating_a_model_automatically_sets_organization_id(): void
    {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $this->actingAs($user, 'sanctum');

        $branch = Branch::create(['name' => 'Auto Branch', 'code' => 'BR-AUTO']);

        $this->assertSame($org->id, $branch->organization_id);
    }

    public function test_user_cannot_access_other_organization_customer(): void
    {
        $orgA = Organization::factory()->create();
        $orgB = Organization::factory()->create();

        $perm = Permission::create(['name' => 'View CRM', 'slug' => 'crm.view', 'module' => 'crm', 'group' => 'CRM']);
        $role = Role::create(['organization_id' => $orgA->id, 'name' => 'Admin', 'slug' => 'admin']);
        $role->permissions()->attach($perm->id);

        $userA = User::factory()->create(['organization_id' => $orgA->id, 'status' => 'active']);
        $userA->roles()->attach($role->id);

        $foreignCustomer = Customer::factory()->create(['organization_id' => $orgB->id]);

        $this->actingAs($userA, 'sanctum')
            ->getJson("/api/v1/crm/customers/{$foreignCustomer->id}")
            ->assertStatus(404);
    }
}
