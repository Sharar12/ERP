<?php
namespace App\Models\Core;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use BelongsToOrganization, SoftDeletes;

    protected $fillable = [
        'organization_id','name','code','email','phone','address','city','country',
        'is_headquarters','status',
    ];

    protected $casts = ['is_headquarters' => 'boolean'];
}
