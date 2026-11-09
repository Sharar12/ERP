<?php
namespace App\Models\Hr;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];
    public function employee() { return $this->belongsTo(Employee::class); }
    public function leaveType() { return $this->belongsTo(LeaveType::class); }
}
