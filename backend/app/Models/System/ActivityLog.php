<?php
namespace App\Models\System;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'organization_id','user_id','subject_type','subject_id',
        'event','description','properties',
    ];
    protected $casts = ['properties' => 'array'];
}
