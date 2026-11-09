<?php
namespace App\Models\System;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasUuids;
    protected $fillable = ['id','organization_id','user_id','type','title','body','link','icon','read_at','data'];
    protected $casts = ['read_at' => 'datetime', 'data' => 'array'];
    public $incrementing = false;
    protected $keyType = 'string';
}
