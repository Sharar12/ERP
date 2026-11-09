<?php

namespace Tests\Feature\Concurrency;

use App\Models\Auth\User;
use App\Models\Core\Organization;
use App\Models\Crm\Customer;
use App\Models\Sales\{Invoice, Payment};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class TransactionIntegrityTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_create_rolls_back_on_item_failure(): void
    {
        $org = Organization::factory()->create();
        $role = \App\Models\Auth\Role::create(['organization_id' => $org->id, 'name' => 'Admin', 'slug' => 'super-admin']);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);
        $customer = Customer::factory()->create(['organization_id' => $org->id]);
        $before = Invoice::count();

        try {
            $this->actingAs($user, 'sanctum')
                ->postJson('/api/v1/sales/invoices', [
                    'customer_id' => $customer->id,
                    'issue_date'  => now()->toDateString(),
                    'due_date'    => now()->toDateString(),
                    'items'       => [
                        ['description' => 'OK', 'quantity' => 1, 'unit_price' => 100],
                        ['description' => null, 'quantity' => -5, 'unit_price' => 'abc'],
                    ],
                ]);
        } catch (\Throwable) {}

        $this->assertEquals($before, Invoice::count());
        $this->assertEquals(0, DB::table('sales_document_items')->count());
    }

    public function test_payment_overage_rolls_back_entirely(): void
    {
        $org = Organization::factory()->create();
        $role = \App\Models\Auth\Role::create(['organization_id' => $org->id, 'name' => 'Admin', 'slug' => 'super-admin']);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);

        $customer = Customer::factory()->create(['organization_id' => $org->id]);
        $invoice = Invoice::factory()->create([
            'organization_id' => $org->id,
            'customer_id' => $customer->id,
            'total' => 500,
            'balance_due' => 500,
            'amount_paid' => 0,
            'status' => 'sent',
        ]);

        $paymentsBefore = Payment::count();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices/{$invoice->id}/payments", ['amount' => 9999])
            ->assertStatus(422);

        $invoice->refresh();
        $this->assertEquals(0, (float) $invoice->amount_paid);
        $this->assertEquals(500, (float) $invoice->balance_due);
        $this->assertEquals($paymentsBefore, Payment::count(), 'No orphan payment row');
    }
}
