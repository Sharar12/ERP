<?php
namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase\Rfq;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class RfqController extends Controller
{
    public function index(Request $request)
    {
        $rfqs = Rfq::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($rfqs);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $rfq = Rfq::create($data);
        return ApiResponse::created($rfq);
    }

    public function show(Rfq $rfq) { return ApiResponse::success($rfq); }
    public function update(Request $request, Rfq $rfq) { $rfq->update($request->all()); return ApiResponse::success($rfq); }
    public function destroy(Rfq $rfq) { $rfq->delete(); return ApiResponse::noContent(); }

    public function award(Request $request, Rfq $rfq)
    {
        $rfq->update(['status' => 'awarded']);
        return ApiResponse::success($rfq);
    }
}

