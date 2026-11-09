<?php
namespace App\Models\Project;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;
    protected $guarded = ['id'];
    public function milestones() { return $this->hasMany(Milestone::class); }
}
