<?php
namespace App\Http\Controllers\Api\V1\Crm;

use App\Http\Controllers\Controller;
use App\Models\Crm\Opportunity;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class OpportunityController extends Controller
{
    public function index(Request $request)
    {
        $opps = Opportunity::with('customer', 'stage')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($opps);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $opp = Opportunity::create($data);
        return ApiResponse::created($opp);
    }

    public function show(Opportunity $opportunity) { return ApiResponse::success($opportunity->load('customer', 'stage')); }
    public function update(Request $request, Opportunity $opportunity) { $opportunity->update($request->all()); return ApiResponse::success($opportunity); }
    public function destroy(Opportunity $opportunity) { $opportunity->delete(); return ApiResponse::noContent(); }

    public function moveStage(Request $request, Opportunity $opportunity)
    {
        $opportunity->update(['stage_id' => $request->stage_id]);
        return ApiResponse::success($opportunity->fresh('stage'));
    }
}
