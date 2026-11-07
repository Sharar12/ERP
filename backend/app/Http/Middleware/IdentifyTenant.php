<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = null;

        // Strategy 1: X-Tenant header (tenant slug)
        if ($request->hasHeader('X-Tenant')) {
            $tenant = Tenant::where('slug', $request->header('X-Tenant'))
                            ->where('is_active', true)
                            ->first();
        }

        // Strategy 2: Subdomain (acme.example.com)
        if (! $tenant) {
            $host = $request->getHost();
            $tenant = Tenant::where('domain', $host)
                            ->where('is_active', true)
                            ->first();
        }

        // Strategy 3: Session fallback (when switching active company)
        if (! $tenant && $request->user() && session('active_tenant_id')) {
            $tenant = Tenant::where('id', session('active_tenant_id'))
                            ->where('is_active', true)
                            ->first();
        }

        if ($tenant) {
            app()->instance('currentTenant', $tenant);
        }

        return $next($request);
    }
}
