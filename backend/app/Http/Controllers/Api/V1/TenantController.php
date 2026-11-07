<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\TenantOnboardingService;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function store(Request $request, TenantOnboardingService $service)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:100'],
            'default_currency' => ['nullable', 'string', 'size:3'],
            'timezone' => ['nullable', 'string', 'max:64'],
        ]);

        $tenant = $service->create($data, $request->user());

        return response()->json([
            'status' => 'success',
            'data' => $tenant,
        ], 201);
    }
}
