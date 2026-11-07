<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class TenantStorageService
{
    public function store($file, string $directory = 'documents'): string
    {
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        if (! $tenant) {
            throw new \RuntimeException('No tenant context for file upload.');
        }

        $path = "tenants/{$tenant->id}/{$directory}";

        return $file->store($path, 'local');
    }

    public function download(string $path)
    {
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        if (! $tenant || ! str_starts_with($path, "tenants/{$tenant->id}/")) {
            abort(404);
        }

        return Storage::disk('local')->download($path);
    }
}
