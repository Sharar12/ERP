<?php
namespace App\Models\Hr;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $table = 'attendance';
    protected $guarded = ['id'];
    public function employee() { return $this->belongsTo(Employee::class); }
}
