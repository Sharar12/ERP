<?php
namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\StockAdjustment;
use App\Services\Inventory\StockAdjustmentService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class StockAdjustmentController extends Controller
{
    public function __construct(private StockAdjustmentService $service) {}

    public function index(Request $request)
    {
        $adjustments = StockAdjustment::with('items')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($adjustments);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $items = $data['items'] ?? [];
        unset($data['items']);

        $data['organization_id'] = $request->user()->organization_id;
        $adj = StockAdjustment::create($data);
        foreach ($items as $item) {
            $adj->items()->create($item);
        }
        return ApiResponse::created($adj->load('items'));
    }

    public function show(StockAdjustment $adjustment) { return ApiResponse::success($adjustment->load('items')); }
    public function update(Request $request, StockAdjustment $adjustment) { $adjustment->update($request->all()); return ApiResponse::success($adjustment); }
    public function destroy(StockAdjustment $adjustment) { $adjustment->delete(); return ApiResponse::noContent(); }

    public function apply(StockAdjustment $adjustment)
    {
        $applied = $this->service->apply($adjustment);
        return ApiResponse::success($applied, 'Stock adjustment applied');
    }
}
