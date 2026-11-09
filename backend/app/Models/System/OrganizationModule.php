<?php
namespace App\Models\System;

use Illuminate\Database\Eloquent\Model;

class OrganizationModule extends Model
{
    protected $fillable = ['organization_id','module_id','enabled','enabled_at','enabled_by'];
    protected $casts = ['enabled' => 'boolean', 'enabled_at' => 'datetime'];
}
