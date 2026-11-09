<?php
namespace App\Services\Inventory;

use App\Models\Inventory\{StockAdjustment, StockMovement, StockLevel};
use Illuminate\Support\Facades\DB;

class StockAdjustmentService
{
    public function apply(StockAdjustment $adj): StockAdjustment
    {
        abort_unless($adj->items()->exists(), 422, 'Adjustment has no items');
        abort_if($adj->applied_at, 422, 'Already applied');

        return DB::transaction(function () use ($adj) {
            foreach ($adj->items as $item) {
                $level = StockLevel::lockForUpdate()
                    ->firstOrCreate(
                        ['warehouse_id' => $adj->warehouse_id, 'product_id' => $item->product_id],
                        ['organization_id' => $adj->organization_id, 'quantity' => 0, 'reserved_quantity' => 0, 'avg_cost' => 0]
                    );

                $level->update(['quantity' => $item->quantity_after]);

                StockMovement::create([
                    'organization_id' => $adj->organization_id,
                    'warehouse_id'    => $adj->warehouse_id,
                    'product_id'      => $item->product_id,
                    'type'            => 'adjustment',
                    'reference_type'  => StockAdjustment::class,
                    'reference_id'    => $adj->id,
                    'quantity'        => $item->difference,
                    'balance_after'   => $item->quantity_after,
                    'notes'           => "Adjustment: {$adj->reason}",
                    'moved_at'        => now(),
                ]);
            }
            $adj->update(['applied_at' => now()]);
            return $adj->fresh('items');
        });
    }
}

