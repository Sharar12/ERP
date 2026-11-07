<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

            if ($tenant) {
                $builder->where(
                    $builder->getModel()->getTable() . '.tenant_id',
                    $tenant->id
                );
            }
        });

        static::creating(function ($model) {
            $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

            if ($tenant && ! $model->tenant_id) {
                $model->tenant_id = $tenant->id;
            }
        });
    }

    public function scopeWithoutTenantScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }

    public function scopeForTenant(Builder $query, int $tenantId): Builder
    {
        return $query->withoutGlobalScope('tenant')
                     ->where('tenant_id', $tenantId);
    }
}

