<?php
namespace Tests\Feature\Sales;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Crm\Customer;
use App\Models\Sales\Invoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoicePaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_partial_payment_flips_status_to_partial(): void
    {
        [$user, $invoice] = $this->createInvoiceFixture(1000);
        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices/{$invoice->id}/payments", [
                'amount' => 400,
                'method' => 'bank',
            ])->assertOk();

        $invoice->refresh();
        $this->assertEquals(400, (float) $invoice->amount_paid);
        $this->assertEquals(600, (float) $invoice->balance_due);
        $this->assertEquals('partial', $invoice->status);
    }

    public function test_full_payment_flips_status_to_paid(): void
    {
        [$user, $invoice] = $this->createInvoiceFixture(1000);
        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices/{$invoice->id}/payments", ['amount' => 1000])
            ->assertOk();

        $invoice->refresh();
        $this->assertEquals('paid', $invoice->status);
        $this->assertEquals(0, (float) $invoice->balance_due);
    }

    public function test_overpayment_rejected(): void
    {
        [$user, $invoice] = $this->createInvoiceFixture(500);
        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/sales/invoices/{$invoice->id}/payments", ['amount' => 1000])
            ->assertStatus(422);
    }

    private function createInvoiceFixture(float $total): array
    {
        $org = Organization::factory()->create();
        $perm = Permission::firstOrCreate(['slug' => 'sales.update'], ['name' => 'Update', 'module' => 'sales', 'group' => 'Sales']);
        $role = Role::create(['organization_id' => $org->id, 'name' => 'Acc', 'slug' => 'acc-' . uniqid()]);
        $role->permissions()->attach($perm->id);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);

        $customer = Customer::factory()->create(['organization_id' => $org->id]);
        $invoice = Invoice::factory()->create([
            'organization_id' => $org->id,
            'customer_id'     => $customer->id,
            'total'           => $total,
            'balance_due'     => $total,
            'status'          => 'sent',
        ]);
        return [$user, $invoice];
    }
}
