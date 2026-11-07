<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes (login, registration) will live here in Phase 3

    Route::middleware('auth:sanctum')->group(function () {
        // Protected routes will live here
    });
});