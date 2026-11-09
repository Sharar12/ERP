<?php
namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase\Supplier;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = Supplier::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($suppliers);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $supplier = Supplier::create($data);
        return ApiResponse::created($supplier);
    }

    public function show(Supplier $supplier) { return ApiResponse::success($supplier); }
    public function update(Request $request, Supplier $supplier) { $supplier->update($request->all()); return ApiResponse::success($supplier); }
    public function destroy(Supplier $supplier) { $supplier->delete(); return ApiResponse::noContent(); }
}
