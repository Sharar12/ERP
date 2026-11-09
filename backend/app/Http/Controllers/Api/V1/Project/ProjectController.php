<?php
namespace App\Http\Controllers\Api\V1\Project;

use App\Http\Controllers\Controller;
use App\Models\Project\Project;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($projects);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $p = Project::create($data);
        return ApiResponse::created($p);
    }

    public function show(Project $project) { return ApiResponse::success($project->load('milestones')); }
    public function update(Request $request, Project $project) { $project->update($request->all()); return ApiResponse::success($project); }
    public function destroy(Project $project) { $project->delete(); return ApiResponse::noContent(); }
}
