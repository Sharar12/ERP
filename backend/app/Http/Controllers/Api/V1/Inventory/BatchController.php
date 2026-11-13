<?php
namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\ProductBatch;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $items = ProductBatch::where('organization_id', $request->user()->organization_id)
            ->with('product')
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($items);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $batch = ProductBatch::create($data);
        return ApiResponse::created($batch);
    }

    public function show(ProductBatch $batch) { return ApiResponse::success($batch); }
    public function update(Request $request, ProductBatch $batch) { $batch->update($request->all()); return ApiResponse::success($batch); }
    public function destroy(ProductBatch $batch) { $batch->delete(); return ApiResponse::noContent(); }
}

