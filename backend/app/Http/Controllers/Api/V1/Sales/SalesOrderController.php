<?php
namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sales\SalesOrder;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class SalesOrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = SalesOrder::with('customer')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($orders);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $items = $data['items'] ?? [];
        unset($data['items']);

        $subtotal = 0;
        $taxTotal = 0;
        foreach ($items as $item) {
            $line = ($item['quantity'] ?? 0) * ($item['unit_price'] ?? 0);
            $subtotal += $line;
            $taxTotal += $line * (($item['tax_percent'] ?? 0) / 100);
        }
        $data['subtotal'] = round($subtotal, 2);
        $data['tax_total'] = round($taxTotal, 2);
        $data['total'] = round($subtotal + $taxTotal, 2);

        $order = SalesOrder::create($data);
        foreach ($items as $item) {
            $order->items()->create([
                'document_type' => 'sales_order',
                'document_id' => $order->id,
                'product_id' => $item['product_id'] ?? null,
                'description' => $item['description'] ?? '',
                'quantity' => $item['quantity'] ?? 1,
                'unit_price' => $item['unit_price'] ?? 0,
                'tax_percent' => $item['tax_percent'] ?? 0,
                'line_total' => round(($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0), 2),
            ]);
        }
        return ApiResponse::created($order);
    }

    public function confirm(SalesOrder $order)
    {
        $order->update(['status' => 'confirmed']);
        \App\Models\System\ActivityLog::create([
            'organization_id' => $order->organization_id,
            'user_id' => auth()->id(),
            'event' => 'order.confirmed',
            'subject_type' => SalesOrder::class,
            'subject_id' => $order->id,
            'description' => 'Sales Order confirmed',
        ]);
        return ApiResponse::success($order);
    }

    public function show(SalesOrder $order) { return ApiResponse::success($order->load('customer')); }
    public function update(Request $request, SalesOrder $order) { $order->update($request->all()); return ApiResponse::success($order); }
    public function destroy(SalesOrder $order) { $order->delete(); return ApiResponse::noContent(); }
}
