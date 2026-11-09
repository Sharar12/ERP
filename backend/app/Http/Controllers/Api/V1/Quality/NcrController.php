<?php
namespace App\Http\Controllers\Api\V1\Quality;

use App\Http\Controllers\Controller;
use App\Models\Quality\NonConformanceReport;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class NcrController extends Controller
{
    public function index(Request $request)
    {
        $ncrs = NonConformanceReport::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($ncrs);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $ncr = NonConformanceReport::create($data);
        return ApiResponse::created($ncr);
    }

    public function show(NonConformanceReport $ncr) { return ApiResponse::success($ncr); }
    public function update(Request $request, NonConformanceReport $ncr) { $ncr->update($request->all()); return ApiResponse::success($ncr); }
    public function destroy(NonConformanceReport $ncr) { $ncr->delete(); return ApiResponse::noContent(); }
}
