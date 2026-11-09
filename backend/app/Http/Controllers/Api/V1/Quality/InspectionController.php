<?php
namespace App\Http\Controllers\Api\V1\Quality;

use App\Http\Controllers\Controller;
use App\Models\Quality\QualityInspection;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class InspectionController extends Controller
{
    public function index(Request $request)
    {
        $ins = QualityInspection::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($ins);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $qi = QualityInspection::create($data);
        return ApiResponse::created($qi);
    }

    public function show(QualityInspection $inspection) { return ApiResponse::success($inspection); }
    public function update(Request $request, QualityInspection $inspection) { $inspection->update($request->all()); return ApiResponse::success($inspection); }
    public function destroy(QualityInspection $inspection) { $inspection->delete(); return ApiResponse::noContent(); }
}
