<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        $user = $request->user();

        // Super-admin role bypasses all checks
        if ($user->roles()->where('slug', 'super-admin')->exists()) {
            return $next($request);
        }

        abort_unless($user->hasPermission($permission), 403,
            "Missing permission: {$permission}");
        return $next($request);
    }
}

