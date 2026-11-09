<?php
namespace App\Models\Task;

use App\Models\Auth\User;
use App\Models\Project\Project;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;
    protected $guarded = ['id'];
    public function project() { return $this->belongsTo(Project::class); }
    public function assignedUser() { return $this->belongsTo(User::class, 'assigned_to'); }
}
