<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function show()
    {
        $checks = [
            'database' => $this->checkDb(),
            'storage'  => $this->checkStorage(),
        ];

        $healthy = collect($checks)->every(fn ($c) => $c['ok']);

        return response()->json([
            'status' => $healthy ? 'healthy' : 'degraded',
            'checks' => $checks,
            'version' => config('app.version', '1.0.0'),
        ], $healthy ? 200 : 503);
    }

    private function checkDb(): array
    {
        try { DB::select('SELECT 1'); return ['ok' => true]; }
        catch (\Throwable $e) { return ['ok' => false, 'error' => $e->getMessage()]; }
    }

    private function checkStorage(): array
    {
        try {
            \Storage::disk('local')->put('health.txt', now()->toIso8601String());
            \Storage::disk('local')->delete('health.txt');
            return ['ok' => true];
        } catch (\Throwable $e) { return ['ok' => false, 'error' => $e->getMessage()]; }
    }
}

