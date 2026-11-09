<?php
namespace App\Services\Purchase;

use App\Models\Purchase\{GoodsReceivedNote, PurchaseOrder};
use App\Services\Inventory\StockService;
use Illuminate\Support\Facades\DB;

class GrnService
{
    public function __construct(private StockService $stock) {}

    public function receive(GoodsReceivedNote $grn): GoodsReceivedNote
    {
        abort_unless($grn->status === 'draft', 422, 'GRN already processed');
        abort_unless($grn->warehouse_id, 422, 'GRN has no warehouse');

        return DB::transaction(function () use ($grn) {
            foreach ($grn->items as $item) {
                $this->stock->increment(
                    productId:   $item->product_id,
                    warehouseId: $grn->warehouse_id,
                    quantity:    (float) $item->quantity_received,
                    reference:   ['type' => GoodsReceivedNote::class, 'id' => $grn->id],
                    unitCost:    $item->purchaseOrderItem?->unit_price ?? 0,
                );
            }

            $grn->update(['status' => 'received']);

            \App\Models\System\ActivityLog::create([
                'organization_id' => $grn->organization_id,
                'user_id' => auth()->id(),
                'event' => 'grn.received',
                'subject_type' => GoodsReceivedNote::class,
                'subject_id' => $grn->id,
                'description' => "GRN {$grn->number} received",
            ]);

            // Update PO status if fully received
            $po = $grn->purchaseOrder;
            if ($po) {
                $receivedQuantities = \App\Models\Purchase\GoodsReceivedItem::whereHas('goodsReceivedNote', fn ($q) => $q->where('purchase_order_id', $po->id)->where('status', 'received'))
                    ->groupBy('product_id')
                    ->selectRaw('product_id, SUM(quantity_received) as total_received')
                    ->pluck('total_received', 'product_id');

                $allReceived = true;
                foreach ($po->items as $poItem) {
                    $received = (float) ($receivedQuantities[$poItem->product_id] ?? 0);
                    if ($received < (float) $poItem->quantity) {
                        $allReceived = false;
                        break;
                    }
                }

                $po->update(['status' => $allReceived ? 'received' : 'partial']);
            }

            return $grn->fresh('items');
        });
    }
}
