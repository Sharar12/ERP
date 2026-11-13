<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Core\Department;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $departments = Department::where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return ApiResponse::paginated($departments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'code'        => 'nullable|string|max:50',
            'manager_id'  => 'nullable|integer|exists:users,id',
            'description' => 'nullable|string',
        ]);

        $department = Department::create(array_merge($validated, [
            'organization_id' => $request->user()->organization_id,
        ]));

        return ApiResponse::created($department);
    }

    public function show(Department $department)
    {
        return ApiResponse::success($department);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'code'        => 'nullable|string|max:50',
            'manager_id'  => 'nullable|integer|exists:users,id',
            'description' => 'nullable|string',
        ]);

        $department->update($validated);

        return ApiResponse::success($department);
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return ApiResponse::noContent();
    }
}

