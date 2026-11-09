<?php
namespace Tests\Feature\Purchase;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Purchase\{Supplier, PurchaseOrder};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseOrderApproveTest extends TestCase
{
    use RefreshDatabase;

    public function test_approver_flips_status_and_logs_activity(): void
    {
        $org = Organization::factory()->create();
        $user = $this->userWithPerm($org, 'purchases.approve');
        $supplier = Supplier::factory()->create(['organization_id' => $org->id]);
        $po = PurchaseOrder::factory()->create([
            'organization_id' => $org->id,
            'supplier_id'     => $supplier->id,
            'status'          => 'draft',
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/orders/{$po->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('activity_logs', [
            'event'       => 'purchase_order.approved',
            'subject_id'  => $po->id,
            'user_id'     => $user->id,
        ]);
    }

    public function test_cannot_approve_already_approved(): void
    {
        $org = Organization::factory()->create();
        $user = $this->userWithPerm($org, 'purchases.approve');
        $po = PurchaseOrder::factory()->create([
            'organization_id' => $org->id,
            'status'          => 'approved',
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/orders/{$po->id}/approve")
            ->assertStatus(422);
    }

    public function test_user_without_permission_gets_403(): void
    {
        $org = Organization::factory()->create();
        $user = $this->userWithPerm($org, 'purchases.view');   // no .approve
        $po = PurchaseOrder::factory()->create(['organization_id' => $org->id]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/orders/{$po->id}/approve")
            ->assertStatus(403);
    }

    private function userWithPerm(Organization $org, string $slug): User
    {
        $perm = Permission::firstOrCreate(
            ['slug' => $slug],
            ['name' => $slug, 'module' => explode('.', $slug)[0], 'group' => 'Purchases']
        );
        $role = Role::create(['organization_id' => $org->id, 'name' => 'Mgr', 'slug' => 'mgr-' . uniqid()]);
        $role->permissions()->attach($perm->id);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);
        return $user;
    }
}

