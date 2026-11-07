<?php

use App\Http\Controllers\Api\V1\TenantController;
use App\Http\Controllers\Api\V1\UserTenantController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authenticated routes
    Route::middleware('auth')->group(function () {
        Route::post('/tenants', [TenantController::class, 'store']);
        Route::get('/me/tenants', [UserTenantController::class, 'index']);
        Route::post('/me/switch-tenant', [UserTenantController::class, 'switch']);
    });
});
