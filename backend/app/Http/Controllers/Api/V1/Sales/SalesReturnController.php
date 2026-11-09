<?php
namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sales\SalesReturn;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class SalesReturnController extends Controller
{
    public function index(Request $request)
    {
        $returns = SalesReturn::with('customer')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($returns);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $sr = SalesReturn::create($data);
        return ApiResponse::created($sr);
    }

    public function show(SalesReturn $return) { return ApiResponse::success($return); }
    public function update(Request $request, SalesReturn $return) { $return->update($request->all()); return ApiResponse::success($return); }
    public function destroy(SalesReturn $return) { $return->delete(); return ApiResponse::noContent(); }
}
