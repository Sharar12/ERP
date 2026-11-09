<?php
namespace App\Services\Inventory;

use App\Models\Inventory\StockLevel;
use App\Models\Inventory\StockMovement;
use Illuminate\Support\Facades\DB;

class StockService
{
    public function increment(int $productId, int $warehouseId, float $quantity, array $reference = [], float $unitCost = 0, ?int $variantId = null): StockMovement
    {
        return DB::transaction(function () use ($productId, $warehouseId, $quantity, $reference, $unitCost, $variantId) {
            $level = StockLevel::firstOrCreate(
                ['warehouse_id' => $warehouseId, 'product_id' => $productId, 'variant_id' => $variantId],
                ['organization_id' => auth()->user()->organization_id, 'quantity' => 0, 'reserved_quantity' => 0, 'avg_cost' => 0]
            );

            // Weighted-average cost recalc
            $oldQty = (float) $level->quantity;
            $oldAvg = (float) $level->avg_cost;
            $newQty = $oldQty + $quantity;
            $newAvg = $newQty > 0 ? (($oldQty * $oldAvg) + ($quantity * $unitCost)) / $newQty : 0;

            $level->update(['quantity' => $newQty, 'avg_cost' => round($newAvg, 4)]);

            return StockMovement::create([
                'organization_id' => $level->organization_id,
                'warehouse_id'    => $warehouseId,
                'product_id'      => $productId,
                'variant_id'      => $variantId,
                'type'            => 'in',
                'reference_type'  => $reference['type'] ?? null,
                'reference_id'    => $reference['id'] ?? null,
                'quantity'        => $quantity,
                'unit_cost'       => $unitCost,
                'balance_after'   => $newQty,
                'moved_at'        => now(),
            ]);
        });
    }

    public function decrement(int $productId, int $warehouseId, float $quantity, array $reference = [], ?int $variantId = null): StockMovement
    {
        return DB::transaction(function () use ($productId, $warehouseId, $quantity, $reference, $variantId) {
            $level = StockLevel::where('warehouse_id', $warehouseId)
                ->where('product_id', $productId)
                ->when($variantId, fn ($q) => $q->where('variant_id', $variantId))
                ->lockForUpdate()
                ->first();

            abort_if(!$level, 422, 'No stock record found');
            abort_if((float) $level->quantity < $quantity, 422, 'Insufficient stock');

            $newQty = (float) $level->quantity - $quantity;
            $level->update(['quantity' => $newQty]);

            return StockMovement::create([
                'organization_id' => $level->organization_id,
                'warehouse_id'    => $warehouseId,
                'product_id'      => $productId,
                'variant_id'      => $variantId,
                'type'            => 'out',
                'reference_type'  => $reference['type'] ?? null,
                'reference_id'    => $reference['id'] ?? null,
                'quantity'        => $quantity,
                'unit_cost'       => $level->avg_cost,
                'balance_after'   => $newQty,
                'moved_at'        => now(),
            ]);
        });
    }
}

