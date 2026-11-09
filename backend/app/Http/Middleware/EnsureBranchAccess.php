<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureBranchAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $branchId = $request->route('branch') ?? $request->input('branch_id');

        if (!$branchId) return $next($request);

        // Branch must belong to user's organization
        $belongs = \App\Models\Core\Branch::where('id', $branchId)
            ->where('organization_id', $user->organization_id)
            ->exists();

        abort_unless($belongs, 403, 'Branch not accessible');
        return $next($request);
    }
}

