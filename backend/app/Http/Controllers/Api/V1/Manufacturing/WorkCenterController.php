<?php
namespace App\Http\Controllers\Api\V1\Manufacturing;

use App\Http\Controllers\Controller;
use App\Models\Manufacturing\WorkCenter;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class WorkCenterController extends Controller
{
    public function index(Request $request)
    {
        $wcs = WorkCenter::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($wcs);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $wc = WorkCenter::create($data);
        return ApiResponse::created($wc);
    }

    public function show(WorkCenter $work_center) { return ApiResponse::success($work_center); }
    public function update(Request $request, WorkCenter $work_center) { $work_center->update($request->all()); return ApiResponse::success($work_center); }
    public function destroy(WorkCenter $work_center) { $work_center->delete(); return ApiResponse::noContent(); }
}
