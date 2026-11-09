<?php
namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase\PurchaseOrder;
use App\Services\Purchase\PurchaseOrderService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    public function __construct(private PurchaseOrderService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', PurchaseOrder::class);
        return ApiResponse::paginated($this->service->paginate($request));
    }

    public function store(Request $request)
    {
        $this->authorize('create', PurchaseOrder::class);
        $po = $this->service->create($request->all());
        return ApiResponse::created($po, 'Purchase order created');
    }

    public function show(PurchaseOrder $order)
    {
        $this->authorize('view', $order);
        return ApiResponse::success($order->load('items.product', 'supplier'));
    }

    public function update(Request $request, PurchaseOrder $order)
    {
        $this->authorize('update', $order);
        return ApiResponse::success($this->service->update($order, $request->all()));
    }

    public function destroy(PurchaseOrder $order)
    {
        $this->authorize('delete', $order);
        $this->service->delete($order);
        return ApiResponse::noContent();
    }

    public function approve(Request $request, PurchaseOrder $order)
    {
        $this->authorize('approve', $order);
        return ApiResponse::success(
            $this->service->approve($order, $request->user()),
            'Purchase order approved'
        );
    }
}
