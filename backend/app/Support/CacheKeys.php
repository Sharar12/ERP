<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class CacheKeys
{
    public static function dashboard(int $orgId): string
    {
        return "org:{$orgId}:dashboard";
    }

    public static function permissions(int $userId): string
    {
        return "user:{$userId}:permissions";
    }

    public static function moduleConfig(int $orgId): string
    {
        return "org:{$orgId}:modules";
    }

    public static function report(int $orgId, string $key): string
    {
        return "org:{$orgId}:report:{$key}";
    }

    public static function invalidateOrg(int $orgId): void
    {
        Cache::forget(self::dashboard($orgId));
        Cache::forget(self::moduleConfig($orgId));
    }
}

