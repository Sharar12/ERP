<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'domain',
        'logo_path',
        'business_type',
        'registration_number',
        'tax_id',
        'default_currency',
        'timezone',
        'locale',
        'enabled_modules',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'enabled_modules' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('is_owner')
                    ->withTimestamps();
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function warehouses(): HasMany
    {
        return $this->hasMany(Warehouse::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(Setting::class);
    }

    public function isModuleEnabled(string $module): bool
    {
        return in_array($module, $this->enabled_modules ?? [], true);
    }

    public function getSetting(string $key, $default = null)
    {
        return $this->settings()->where('key', $key)->value('value') ?? $default;
    }

    public function setSetting(string $key, $value): void
    {
        $this->settings()->updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
