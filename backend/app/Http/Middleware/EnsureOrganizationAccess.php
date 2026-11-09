<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user || !$user->organization_id) {
            abort(403, 'No organization assigned to this user');
        }

        // Block any request trying to pass a different organization_id
        $bodyOrgId = $request->input('organization_id');
        if ($bodyOrgId && (int) $bodyOrgId !== (int) $user->organization_id) {
            abort(403, 'Organization mismatch');
        }

        return $next($request);
    }
}

