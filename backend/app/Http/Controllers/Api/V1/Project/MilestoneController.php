<?php
namespace App\Http\Controllers\Api\V1\Project;

use App\Http\Controllers\Controller;
use App\Models\Project\Milestone;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    public function index($projectId)
    {
        $milestones = Milestone::where('project_id', $projectId)->get();
        return ApiResponse::success($milestones);
    }

    public function store(Request $request, $projectId)
    {
        $data = $request->all();
        $data['project_id'] = $projectId;
        $m = Milestone::create($data);
        return ApiResponse::created($m);
    }

    public function show(Milestone $milestone) { return ApiResponse::success($milestone); }
    public function update(Request $request, Milestone $milestone) { $milestone->update($request->all()); return ApiResponse::success($milestone); }
    public function destroy(Milestone $milestone) { $milestone->delete(); return ApiResponse::noContent(); }
}
