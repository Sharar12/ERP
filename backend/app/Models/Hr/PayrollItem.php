<?php
namespace App\Models\Hr;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollItem extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $casts = [
        'breakdown' => 'array',
    ];

    public function getUnpaidLeaveDeductionAttribute(): float
    {
        return (float) ($this->breakdown['unpaid_leave_deduction'] ?? 0);
    }
    public function payrollRun() { return $this->belongsTo(PayrollRun::class); }
    public function employee() { return $this->belongsTo(Employee::class); }
}
