<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\Branch;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_tenant_cannot_see_another_tenants_branches(): void
    {
        $tenantA = Tenant::create(['name' => 'Alpha', 'slug' => 'alpha']);
        $tenantB = Tenant::create(['name' => 'Beta', 'slug' => 'beta']);

        app()->instance('currentTenant', $tenantA);
        Branch::create(['name' => 'Alpha Branch']);

        app()->instance('currentTenant', $tenantB);
        Branch::create(['name' => 'Beta Branch']);

        app()->instance('currentTenant', $tenantA);
        $this->assertCount(1, Branch::all());
        $this->assertSame('Alpha Branch', Branch::first()->name);

        app()->instance('currentTenant', $tenantB);
        $this->assertCount(1, Branch::all());
        $this->assertSame('Beta Branch', Branch::first()->name);
    }

    public function test_creating_a_model_automatically_sets_tenant_id(): void
    {
        $tenant = Tenant::create(['name' => 'Gamma', 'slug' => 'gamma']);
        app()->instance('currentTenant', $tenant);

        $branch = Branch::create(['name' => 'Auto Branch']);
        $unit = \App\Models\BusinessUnit::create(['name' => 'Retail Division']);

        $this->assertSame($tenant->id, $branch->tenant_id);
        $this->assertSame($tenant->id, $unit->tenant_id);
    }

    public function test_a_user_cannot_switch_to_a_tenant_they_do_not_belong_to(): void
    {
        $user = User::factory()->create();
        $tenant = Tenant::create(['name' => 'Delta', 'slug' => 'delta']);

        $response = $this->actingAs($user)->postJson('/api/v1/me/switch-tenant', [
            'tenant_id' => $tenant->id,
        ]);

        $response->assertStatus(403);
    }

    public function test_a_user_can_switch_to_a_tenant_they_belong_to(): void
    {
        $user = User::factory()->create();
        $tenant = Tenant::create(['name' => 'Epsilon', 'slug' => 'epsilon']);
        $tenant->users()->attach($user->id, ['is_owner' => true]);

        $response = $this->actingAs($user)->postJson('/api/v1/me/switch-tenant', [
            'tenant_id' => $tenant->id,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'success']);
    }

    public function test_a_user_can_list_their_tenants(): void
    {
        $user = User::factory()->create();
        $tenant1 = Tenant::create(['name' => 'Company One', 'slug' => 'company-one']);
        $tenant2 = Tenant::create(['name' => 'Company Two', 'slug' => 'company-two']);

        $tenant1->users()->attach($user->id, ['is_owner' => true]);
        $tenant2->users()->attach($user->id, ['is_owner' => false]);

        $response = $this->actingAs($user)->getJson('/api/v1/me/tenants');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }
}
