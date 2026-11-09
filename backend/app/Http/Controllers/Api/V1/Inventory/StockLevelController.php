<?php
namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\StockLevel;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class StockLevelController extends Controller
{
    public function index(Request $request)
    {
        $query = StockLevel::with('product', 'warehouse')
            ->where('organization_id', $request->user()->organization_id);

        if ($wh = $request->input('filter.warehouse_id')) {
            $query->where('warehouse_id', $wh);
        }
        if ($prod = $request->input('filter.product_id')) {
            $query->where('product_id', $prod);
        }

        $levels = $query->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($levels);
    }

    public function show(StockLevel $level)
    {
        return ApiResponse::success($level->load('product', 'warehouse'));
    }
}

