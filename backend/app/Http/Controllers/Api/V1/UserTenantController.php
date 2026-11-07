<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserTenantController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()->tenants()->get(['tenants.id', 'name', 'slug']),
        ]);
    }

    public function switch(Request $request)
    {
        $data = $request->validate([
            'tenant_id' => ['required', 'integer', 'exists:tenants,id'],
        ]);

        $belongs = $request->user()
            ->tenants()
            ->where('tenants.id', $data['tenant_id'])
            ->exists();

        if (! $belongs) {
            return response()->json([
                'status' => 'error',
                'errors' => ['tenant_id' => ['You do not belong to this company.']],
            ], 403);
        }

        session(['active_tenant_id' => $data['tenant_id']]);

        return response()->json(['status' => 'success']);
    }
}
