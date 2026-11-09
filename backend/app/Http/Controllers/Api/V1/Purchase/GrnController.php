<?php
namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase\GoodsReceivedNote;
use App\Services\Purchase\GrnService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class GrnController extends Controller
{
    public function __construct(private GrnService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', GoodsReceivedNote::class);
        $grns = GoodsReceivedNote::with('supplier')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($grns);
    }

    public function store(Request $request)
    {
        $this->authorize('create', GoodsReceivedNote::class);
        $data = $request->all();
        $items = $data['items'] ?? [];
        unset($data['items']);

        $data['organization_id'] = $request->user()->organization_id;
        $data['status'] = 'draft';
        if (empty($data['number'])) {
            $data['number'] = 'GRN-' . str_pad((string)(GoodsReceivedNote::count() + 1), 5, '0', STR_PAD_LEFT);
        }

        $grn = GoodsReceivedNote::create($data);
        foreach ($items as $item) {
            $grn->items()->create($item);
        }

        return ApiResponse::created($grn->load('items'));
    }

    public function show(GoodsReceivedNote $grn)
    {
        $this->authorize('view', $grn);
        return ApiResponse::success($grn->load('items.product', 'supplier', 'warehouse'));
    }

    public function update(Request $request, GoodsReceivedNote $grn)
    {
        $this->authorize('update', $grn);
        $grn->update($request->all());
        return ApiResponse::success($grn);
    }

    public function destroy(GoodsReceivedNote $grn)
    {
        $this->authorize('delete', $grn);
        $grn->delete();
        return ApiResponse::noContent();
    }

    public function receive(GoodsReceivedNote $grn)
    {
        $this->authorize('update', $grn);
        $received = $this->service->receive($grn);
        return ApiResponse::success($received, 'GRN received and stock incremented');
    }
}
