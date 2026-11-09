<?php
namespace Database\Factories\Purchase;

use App\Models\Purchase\GoodsReceivedNote;
use App\Models\Purchase\PurchaseOrder;
use App\Models\Inventory\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class GoodsReceivedNoteFactory extends Factory
{
    protected $model = GoodsReceivedNote::class;

    public function definition(): array
    {
        return [
            'organization_id' => 1,
            'purchase_order_id' => PurchaseOrder::factory(),
            'warehouse_id' => Warehouse::factory(),
            'number' => 'GRN-' . fake()->unique()->numerify('#####'),
            'received_date' => now(),
            'status' => 'draft',
        ];
    }
}

