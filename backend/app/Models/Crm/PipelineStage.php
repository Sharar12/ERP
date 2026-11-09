<?php
namespace App\Models\Crm;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PipelineStage extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function pipeline() { return $this->belongsTo(Pipeline::class); }
}
