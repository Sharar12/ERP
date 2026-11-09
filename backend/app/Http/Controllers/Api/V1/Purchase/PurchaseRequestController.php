<?php
namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase\PurchaseRequest;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class PurchaseRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = PurchaseRequest::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($requests);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $req = PurchaseRequest::create($data);
        return ApiResponse::created($req);
    }

    public function show(PurchaseRequest $request) { return ApiResponse::success($request); }
    public function update(Request $httpRequest, PurchaseRequest $request) { $request->update($httpRequest->all()); return ApiResponse::success($request); }
    public function destroy(PurchaseRequest $request) { $request->delete(); return ApiResponse::noContent(); }

    public function approve(PurchaseRequest $request)
    {
        $request->update(['status' => 'approved']);
        \App\Models\System\ActivityLog::create([
            'organization_id' => $request->organization_id,
            'user_id' => auth()->id(),
            'event' => 'purchase_request.approved',
            'subject_type' => PurchaseRequest::class,
            'subject_id' => $request->id,
            'description' => 'Purchase request approved',
        ]);
        return ApiResponse::success($request);
    }
}

