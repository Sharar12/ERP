<?php
namespace App\Http\Controllers\Api\V1\Manufacturing;

use App\Http\Controllers\Controller;
use App\Models\Manufacturing\ManufacturingOrder;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ManufacturingOrderController extends Controller
{
    public function index(Request $request)
    {
        $mos = ManufacturingOrder::with('product')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($mos);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $mo = ManufacturingOrder::create($data);
        return ApiResponse::created($mo);
    }

    public function show(ManufacturingOrder $order) { return ApiResponse::success($order); }
    public function update(Request $request, ManufacturingOrder $order) { $order->update($request->all()); return ApiResponse::success($order); }
    public function destroy(ManufacturingOrder $order) { $order->delete(); return ApiResponse::noContent(); }
}
