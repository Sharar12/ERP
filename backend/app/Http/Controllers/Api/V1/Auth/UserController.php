<?php
namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\User;
use App\Http\Resources\UserResource;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles.permissions', 'organization')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($users, UserResource::class);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'nullable|exists:roles,id',
        ]);
        $data['organization_id'] = $request->user()->organization_id;
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        if ($request->role_id) $user->roles()->sync([$request->role_id]);
        return ApiResponse::created(new UserResource($user->load('roles', 'organization')));
    }

    public function show(User $user)
    {
        return ApiResponse::success(new UserResource($user->load('roles.permissions', 'organization')));
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->only('name', 'email', 'phone', 'job_title', 'status', 'locale', 'timezone'));
        if ($request->has('role_id')) $user->roles()->sync([$request->role_id]);
        return ApiResponse::success(new UserResource($user->fresh('roles', 'organization')));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return ApiResponse::noContent();
    }

    public function invite(Request $request, User $user)
    {
        return ApiResponse::success(null, 'Invitation sent');
    }
}
