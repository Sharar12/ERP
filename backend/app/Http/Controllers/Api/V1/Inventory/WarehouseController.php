<?php
namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\Warehouse;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index(Request $request)
    {
        $warehouses = Warehouse::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($warehouses);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $warehouse = Warehouse::create($data);
        return ApiResponse::created($warehouse);
    }

    public function show(Warehouse $warehouse) { return ApiResponse::success($warehouse); }
    public function update(Request $request, Warehouse $warehouse) { $warehouse->update($request->all()); return ApiResponse::success($warehouse); }
    public function destroy(Warehouse $warehouse) { $warehouse->delete(); return ApiResponse::noContent(); }
}
