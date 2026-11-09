<?php
namespace App\Models\System;

use App\Models\Core\Organization;
use Illuminate\Database\Eloquent\Model;

class DocumentSequence extends Model
{
    protected $guarded = ['id'];
    public function organization() { return $this->belongsTo(Organization::class); }
}
