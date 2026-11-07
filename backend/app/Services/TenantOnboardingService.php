<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Branch;
use App\Models\Warehouse;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantOnboardingService
{
    public function create(array $data, User $owner): Tenant
    {
        return DB::transaction(function () use ($data, $owner) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Tenant::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }

            $tenant = Tenant::create([
                'name' => $data['name'],
                'slug' => $slug,
                'business_type' => $data['business_type'] ?? null,
                'default_currency' => $data['default_currency'] ?? 'USD',
                'timezone' => $data['timezone'] ?? 'UTC',
                'is_active' => true,
            ]);

            $tenant->users()->attach($owner->id, ['is_owner' => true]);

            // Seed defaults inside the tenant context
            app()->instance('currentTenant', $tenant);

            Branch::create(['name' => 'Head Office', 'is_active' => true]);
            Warehouse::create(['name' => 'Main Warehouse']);

            Setting::create(['key' => 'invoice_prefix', 'value' => 'INV-']);
            Setting::create(['key' => 'fiscal_year_start', 'value' => '01-01']);

            app()->forgetInstance('currentTenant');

            return $tenant;
        });
    }
}

