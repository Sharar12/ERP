<?php
namespace App\Models\System;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'organization_id','user_id','entity_type','entity_id','action',
        'old_values','new_values','ip_address','user_agent',
    ];
    protected $casts = ['old_values' => 'array', 'new_values' => 'array'];
}
