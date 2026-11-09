<?php
namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $auth) {}

    public function login(LoginRequest $request)
    {
        $request->ensureIsNotRateLimited();

        $result = $this->auth->login(
            $request->email,
            $request->password,
            $request->boolean('remember')
        );

        return ApiResponse::success([
            'user'  => new UserResource($result['user']->load('roles.permissions', 'organization')),
            'token' => $result['token'],
        ], 'Logged in');
    }

    public function logout(Request $request)
    {
        $this->auth->logout($request->user());
        return ApiResponse::noContent('Logged out');
    }

    public function me(Request $request)
    {
        return ApiResponse::success(
            new UserResource($request->user()->load('roles.permissions', 'organization'))
        );
    }
}

