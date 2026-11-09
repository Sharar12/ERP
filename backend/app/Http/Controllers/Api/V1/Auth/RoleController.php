<?php
namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\Role;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $roles = Role::with('permissions')
            ->where('organization_id', $request->user()->organization_id)
            ->get();
        return ApiResponse::success($roles);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required', 'slug' => 'required']);
        $data['organization_id'] = $request->user()->organization_id;
        $role = Role::create($data);
        return ApiResponse::created($role);
    }

    public function show(Role $role)
    {
        return ApiResponse::success($role->load('permissions'));
    }

    public function update(Request $request, Role $role)
    {
        $role->update($request->only('name', 'description'));
        return ApiResponse::success($role);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return ApiResponse::noContent();
    }

    public function syncPermissions(Request $request, Role $role)
    {
        $role->permissions()->sync($request->input('permission_ids', []));
        return ApiResponse::success($role->fresh('permissions'), 'Permissions synced');
    }
}
