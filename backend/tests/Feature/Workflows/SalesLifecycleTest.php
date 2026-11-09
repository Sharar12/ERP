<?php

namespace Tests\Feature\Workflows;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Crm\{Lead, Customer};
use App\Models\Sales\{Quotation, SalesOrder, Invoice, Payment};
use App\Models\Inventory\{Product, Warehouse, StockLevel, StockMovement};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SalesLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_cycle_from_lead_to_reconciled_payment(): void
    {
        [$user, $org] = $this->bootstrapOrg();

        // ── 1. Lead created → converted to customer ──────────
        $lead = Lead::create([
            'organization_id' => $org->id,
            'name'            => 'Jane Smith',
            'company_name'    => 'Smith & Co',
            'email'           => 'jane@smith.io',
            'status'          => 'qualified',
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/crm/leads/{$lead->id}/convert")
            ->assertOk();

        $customer = Customer::where('email', 'jane@smith.io')->firstOrFail();
        $this->assertEquals($org->id, $customer->organization_id);
        $this->assertDatabaseHas('leads', ['id' => $lead->id, 'status' => 'won']);

        // ── 2. Quotation → Sales Order ────────────────────────
        $product = Product::factory()->create([
            'organization_id' => $org->id,
            'cost_price'      => 100,
            'selling_price'   => 200,
        ]);

        $quote = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/sales/quotations', [
                'customer_id' => $customer->id,
                'issue_date'  => now()->toDateString(),
                'valid_until' => now()->addDays(14)->toDateString(),
                'items'       => [[
                    'product_id'  => $product->id,
                    'description' => $product->name,
                    'quantity'    => 10,
                    'unit_price'  => 200,
                    'tax_percent' => 10,
                ]],
            ])
            ->assertCreated()
            ->json('data');

        $this->assertEquals(2200, $quote['total']); // 10*200 + 10% tax

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/quotations/{$quote['id']}/accept")
            ->assertOk();

        $order = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/orders", [
                'customer_id'  => $customer->id,
                'quotation_id' => $quote['id'],
                'order_date'   => now()->toDateString(),
                'items'        => [[
                    'product_id'  => $product->id,
                    'description' => $product->name,
                    'quantity'    => 10,
                    'unit_price'  => 200,
                    'tax_percent' => 10,
                ]],
            ])
            ->assertCreated()
            ->json('data');

        // ── 3. Confirm order → generate invoice ───────────────
        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/orders/{$order['id']}/confirm")
            ->assertOk();

        $invoice = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices", [
                'customer_id'    => $customer->id,
                'sales_order_id' => $order['id'],
                'issue_date'     => now()->toDateString(),
                'due_date'       => now()->addDays(30)->toDateString(),
                'items'          => [[
                    'product_id'  => $product->id,
                    'description' => $product->name,
                    'quantity'    => 10,
                    'unit_price'  => 200,
                    'tax_percent' => 10,
                ]],
            ])
            ->assertCreated()
            ->json('data');

        // ── 4. Stock seeded so post can decrement ─────────────
        $warehouse = Warehouse::factory()->create(['organization_id' => $org->id]);
        StockLevel::create([
            'organization_id' => $org->id,
            'warehouse_id'    => $warehouse->id,
            'product_id'      => $product->id,
            'quantity'        => 100,
            'reserved_quantity' => 0,
            'avg_cost'        => 100,
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices/{$invoice['id']}/post", [
                'warehouse_id' => $warehouse->id,
            ])
            ->assertOk();

        // Stock decremented
        $this->assertEquals(90, StockLevel::where('product_id', $product->id)->value('quantity'));
        // Movement recorded
        $this->assertDatabaseHas('stock_movements', [
            'product_id'     => $product->id,
            'type'           => 'out',
            'reference_type' => Invoice::class,
            'reference_id'   => $invoice['id'],
        ]);

        // ── 5. Partial → full payment ────────────────────────
        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices/{$invoice['id']}/payments", [
                'amount' => 1000,
                'method' => 'bank',
            ])
            ->assertOk();

        $this->assertEquals('partial', Invoice::find($invoice['id'])->status);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices/{$invoice['id']}/payments", [
                'amount' => 1200,
                'method' => 'bank',
            ])
            ->assertOk();

        $finalInvoice = Invoice::find($invoice['id']);
        $this->assertEquals('paid', $finalInvoice->status);
        $this->assertEquals(0, (float) $finalInvoice->balance_due);
        $this->assertEquals(2, Payment::where('customer_id', $customer->id)->count());

        // ── 6. Every transition logged ────────────────────────
        foreach ([
            'lead.converted', 'quotation.accepted', 'order.confirmed',
            'invoice.posted', 'invoice.paid',
        ] as $event) {
            $this->assertDatabaseHas('activity_logs', ['event' => $event]);
        }
    }

    private function bootstrapOrg(): array
    {
        $org = Organization::factory()->create();
        $perms = collect([
            'crm.create', 'crm.update', 'sales.create', 'sales.update',
            'sales.approve', 'inventory.update',
        ])->map(fn ($s) => Permission::firstOrCreate(
            ['slug' => $s],
            ['name' => $s, 'module' => explode('.', $s)[0]]
        ));

        $role = Role::create([
            'organization_id' => $org->id,
            'name'  => 'Sales Rep',
            'slug'  => 'sales-rep-' . uniqid(),
        ]);
        $role->permissions()->attach($perms->pluck('id'));

        $user = User::factory()->create([
            'organization_id' => $org->id,
            'status'          => 'active',
        ]);
        $user->roles()->attach($role->id);

        return [$user, $org];
    }
}

