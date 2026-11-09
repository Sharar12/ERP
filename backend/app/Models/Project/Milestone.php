<?php
namespace App\Models\Project;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function project() { return $this->belongsTo(Project::class); }
}
