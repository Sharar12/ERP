<?php
namespace Tests\Feature\Purchase;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Inventory\{Product, Warehouse};
use App\Models\Purchase\{GoodsReceivedNote, PurchaseOrder};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GrnReceiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_receive_grn_increments_stock(): void
    {
        $org = Organization::factory()->create();
        $perm = Permission::firstOrCreate(['slug' => 'purchases.update'], ['name' => 'Update', 'module' => 'purchases', 'group' => 'Purchases']);
        $role = Role::create(['organization_id' => $org->id, 'name' => 'R', 'slug' => 'r-' . uniqid()]);
        $role->permissions()->attach($perm->id);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);

        $product = Product::factory()->create(['organization_id' => $org->id]);
        $warehouse = Warehouse::factory()->create(['organization_id' => $org->id]);
        $po = PurchaseOrder::factory()->create(['organization_id' => $org->id, 'status' => 'approved']);
        $poItem = $po->items()->create([
            'product_id' => $product->id,
            'description' => 'X',
            'quantity' => 100,
            'unit_price' => 10,
            'line_total' => 1000,
        ]);

        $grn = GoodsReceivedNote::factory()->create([
            'organization_id' => $org->id,
            'purchase_order_id' => $po->id,
            'warehouse_id' => $warehouse->id,
            'status' => 'draft',
        ]);
        $grn->items()->create([
            'product_id' => $product->id,
            'quantity_ordered' => 100,
            'quantity_received' => 100,
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/grns/{$grn->id}/receive")
            ->assertOk();

        $this->assertDatabaseHas('stock_levels', [
            'warehouse_id' => $warehouse->id,
            'product_id' => $product->id,
            'quantity' => 100,
        ]);
        $this->assertEquals('received', $grn->fresh()->status);
        $this->assertEquals('received', $po->fresh()->status);
    }
}

