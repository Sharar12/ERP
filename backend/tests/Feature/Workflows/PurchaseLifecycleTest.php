<?php

namespace Tests\Feature\Workflows;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Purchase\{Supplier, PurchaseRequest, Rfq, PurchaseOrder, GoodsReceivedNote, PurchaseInvoice, SupplierPayment};
use App\Models\Inventory\{Product, Warehouse, StockLevel};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_request_to_paid_supplier_with_stock_in(): void
    {
        [$user, $org] = $this->bootstrapOrg();

        $supplier  = Supplier::factory()->create(['organization_id' => $org->id]);
        $product   = Product::factory()->create(['organization_id' => $org->id]);
        $warehouse = Warehouse::factory()->create(['organization_id' => $org->id]);

        // ── 1. Purchase request → approve ─────────────────────
        $req = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/purchases/requests', [
                'request_date'  => now()->toDateString(),
                'required_date' => now()->addDays(7)->toDateString(),
                'items' => [[
                    'product_id' => $product->id,
                    'quantity'   => 50,
                ]],
            ])->assertCreated()->json('data');

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/requests/{$req['id']}/approve")
            ->assertOk();

        // ── 2. RFQ → supplier quotation awarded → PO ──────────
        $rfq = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/purchases/rfqs', [
                'issue_date' => now()->toDateString(),
                'deadline'   => now()->addDays(5)->toDateString(),
                'supplier_ids' => [$supplier->id],
            ])->assertCreated()->json('data');

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/rfqs/{$rfq['id']}/award", [
                'supplier_id' => $supplier->id,
                'items' => [[
                    'product_id' => $product->id,
                    'quantity'   => 50,
                    'unit_price' => 40,
                ]],
            ])->assertOk();

        $po = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/purchases/orders', [
                'supplier_id' => $supplier->id,
                'order_date'  => now()->toDateString(),
                'items' => [[
                    'product_id'  => $product->id,
                    'description' => $product->name,
                    'quantity'    => 50,
                    'unit_price'  => 40,
                    'tax_percent' => 5,
                ]],
            ])->assertCreated()->json('data');

        $this->assertEquals(2100, $po['total']); // 50*40 + 5%

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/orders/{$po['id']}/approve")
            ->assertOk();

        // ── 3. GRN receive → stock up ─────────────────────────
        $grn = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/purchases/grns', [
                'purchase_order_id' => $po['id'],
                'warehouse_id'      => $warehouse->id,
                'received_date'     => now()->toDateString(),
                'items' => [[
                    'product_id'        => $product->id,
                    'quantity_ordered'  => 50,
                    'quantity_received' => 50,
                ]],
            ])->assertCreated()->json('data');

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/grns/{$grn['id']}/receive")
            ->assertOk();

        $this->assertEquals(50, StockLevel::where('product_id', $product->id)->value('quantity'));
        $this->assertEquals('received', PurchaseOrder::find($po['id'])->status);

        // ── 4. Purchase invoice → pay ─────────────────────────
        $bill = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/purchases/invoices', [
                'supplier_id'       => $supplier->id,
                'purchase_order_id' => $po['id'],
                'issue_date'        => now()->toDateString(),
                'due_date'          => now()->addDays(30)->toDateString(),
                'total'             => 2100,
            ])->assertCreated()->json('data');

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/purchases/invoices/{$bill['id']}/post")
            ->assertOk();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/purchases/payments', [
                'supplier_id'         => $supplier->id,
                'purchase_invoice_id' => $bill['id'],
                'payment_date'        => now()->toDateString(),
                'amount'              => 2100,
                'method'              => 'bank',
            ])->assertCreated();

        $this->assertEquals('paid', PurchaseInvoice::find($bill['id'])->status);

        // ── 5. Full audit chain present ───────────────────────
        foreach ([
            'purchase_request.approved', 'purchase_order.approved',
            'grn.received', 'purchase_invoice.posted', 'supplier_payment.recorded',
        ] as $event) {
            $this->assertDatabaseHas('activity_logs', ['event' => $event]);
        }
    }

    private function bootstrapOrg(): array
    {
        $org = Organization::factory()->create();
        $perms = collect([
            'purchases.create', 'purchases.update', 'purchases.approve',
            'inventory.update',
        ])->map(fn ($s) => Permission::firstOrCreate(
            ['slug' => $s], ['name' => $s, 'module' => explode('.', $s)[0]]
        ));
        $role = Role::create(['organization_id' => $org->id, 'name' => 'Buyer', 'slug' => 'buyer-' . uniqid()]);
        $role->permissions()->attach($perms->pluck('id'));
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);
        return [$user, $org];
    }
}

