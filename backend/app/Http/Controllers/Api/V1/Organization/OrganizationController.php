<?php
namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Core\{Organization, Branch, Department};
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function show(Request $request)
    {
        $org = Organization::with('branches', 'departments')->find($request->user()->organization_id);
        return ApiResponse::success($org);
    }

    public function update(Request $request)
    {
        $org = Organization::find($request->user()->organization_id);
        $org->update($request->validate([
            'name' => 'sometimes|string',
            'legal_name' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'currency' => 'nullable|string',
            'timezone' => 'nullable|string',
        ]));
        return ApiResponse::success($org, 'Organization updated');
    }

    public function index(Request $request)
    {
        $branches = Branch::where('organization_id', $request->user()->organization_id)->get();
        return ApiResponse::success($branches);
    }

    public function store(Request $request)
    {
        $branch = Branch::create(array_merge($request->all(), [
            'organization_id' => $request->user()->organization_id,
        ]));
        return ApiResponse::created($branch);
    }

    public function updateBranch(Request $request, Branch $branch)
    {
        $branch->update($request->all());
        return ApiResponse::success($branch);
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();
        return ApiResponse::noContent();
    }
}
