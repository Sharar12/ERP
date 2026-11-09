<?php
namespace App\Http\Controllers\Api\V1\Hr;

use App\Http\Controllers\Controller;
use App\Models\Hr\RecruitmentJob;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class RecruitmentController extends Controller
{
    public function index(Request $request)
    {
        $jobs = RecruitmentJob::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($jobs);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $job = RecruitmentJob::create($data);
        return ApiResponse::created($job);
    }

    public function show(RecruitmentJob $recruitment) { return ApiResponse::success($recruitment); }
    public function update(Request $request, RecruitmentJob $recruitment) { $recruitment->update($request->all()); return ApiResponse::success($recruitment); }
    public function destroy(RecruitmentJob $recruitment) { $recruitment->delete(); return ApiResponse::noContent(); }
}
