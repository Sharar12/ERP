<?php

namespace Tests\Feature\Performance;

use App\Models\Auth\User;
use App\Models\Core\Organization;
use App\Models\Crm\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class QueryCountTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_list_runs_in_constant_queries(): void
    {
        $org = Organization::factory()->create();
        $role = \App\Models\Auth\Role::create(['organization_id' => $org->id, 'name' => 'Admin', 'slug' => 'super-admin']);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);

        // 3 customers vs 30 customers → same query count
        Customer::factory()->count(3)->create(['organization_id' => $org->id]);
        DB::flushQueryLog(); DB::enableQueryLog();
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/crm/customers?per_page=15')->assertOk();
        $small = count(DB::getQueryLog());

        Customer::factory()->count(27)->create(['organization_id' => $org->id]);
        DB::flushQueryLog();
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/crm/customers?per_page=15')->assertOk();
        $large = count(DB::getQueryLog());

        // Constant-time: query count must not grow with row count
        $this->assertLessThanOrEqual($small + 1, $large,
            "N+1 detected: 3 customers = {$small} queries, 30 customers = {$large} queries");
    }

    public function test_invoice_detail_eager_loads_items_and_customer(): void
    {
        $org = Organization::factory()->create();
        $role = \App\Models\Auth\Role::create(['organization_id' => $org->id, 'name' => 'Admin', 'slug' => 'super-admin']);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);

        $customer = Customer::factory()->create(['organization_id' => $org->id]);
        $invoice = \App\Models\Sales\Invoice::factory()->create(['organization_id' => $org->id, 'customer_id' => $customer->id]);
        foreach (range(1, 10) as $i) {
            $invoice->items()->create([
                'document_type' => 'invoice', 'document_id' => $invoice->id,
                'description' => "Item $i", 'quantity' => 1, 'unit_price' => 100, 'line_total' => 100,
            ]);
        }

        DB::flushQueryLog(); DB::enableQueryLog();
        $this->actingAs($user, 'sanctum')->getJson("/api/v1/sales/invoices/{$invoice->id}")->assertOk();

        // Should be ~2 (invoice + customer) + 1 (items) + counts, not 10+1
        $this->assertLessThanOrEqual(8, count(DB::getQueryLog()),
            'Invoice detail not eager-loading items');
    }
}
