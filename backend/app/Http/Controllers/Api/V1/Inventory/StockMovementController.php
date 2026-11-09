<?php
namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\StockMovement;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $movements = StockMovement::with('product', 'warehouse')
            ->where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($movements);
    }

    public function show(StockMovement $movement) { return ApiResponse::success($movement); }
}
