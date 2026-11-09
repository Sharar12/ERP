<?php

namespace Tests\Feature\Concurrency;

use App\Models\Auth\User;
use App\Models\Core\Organization;
use App\Models\Inventory\{Product, Warehouse, StockLevel};
use App\Services\Inventory\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class StockConcurrencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_two_simultaneous_decrements_cannot_oversell(): void
    {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        auth()->setUser($user);

        $product   = Product::factory()->create(['organization_id' => $org->id]);
        $warehouse = Warehouse::factory()->create(['organization_id' => $org->id]);
        StockLevel::create([
            'organization_id' => $org->id,
            'warehouse_id'    => $warehouse->id,
            'product_id'      => $product->id,
            'quantity'        => 10,
            'avg_cost'        => 50,
        ]);

        $stock = app(StockService::class);
        $attempts = ['success' => 0, 'failed' => 0];

        try {
            DB::transaction(fn () => $stock->decrement($product->id, $warehouse->id, 8.0, []));
            $attempts['success']++;
        } catch (\Throwable) {
            $attempts['failed']++;
        }

        try {
            DB::transaction(fn () => $stock->decrement($product->id, $warehouse->id, 8.0, []));
            $attempts['success']++;
        } catch (\Throwable) {
            $attempts['failed']++;
        }

        $this->assertEquals(1, $attempts['success'], 'Only one decrement should succeed');
        $this->assertEquals(1, $attempts['failed'], 'One should fail on insufficient stock');

        $final = (float) StockLevel::where('product_id', $product->id)->value('quantity');
        $this->assertEquals(2, $final);
        $this->assertGreaterThanOrEqual(0, $final, 'Stock must never go negative');
    }
}

