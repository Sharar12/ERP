<?php
namespace App\Models\Crm;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pipeline extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
    public function stages() { return $this->hasMany(PipelineStage::class); }
}
