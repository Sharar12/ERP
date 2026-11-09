<?php
namespace Database\Factories\Purchase;

use App\Models\Purchase\PurchaseOrder;
use App\Models\Purchase\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseOrderFactory extends Factory
{
    protected $model = PurchaseOrder::class;

    public function definition(): array
    {
        return [
            'organization_id' => 1,
            'supplier_id' => Supplier::factory(),
            'number' => 'PO-' . fake()->unique()->numerify('#####'),
            'order_date' => now(),
            'expected_date' => now()->addDays(7),
            'subtotal' => 1000,
            'tax_total' => 100,
            'total' => 1100,
            'status' => 'draft',
        ];
    }
}

