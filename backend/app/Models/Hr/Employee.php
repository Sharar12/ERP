<?php
namespace App\Models\Hr;

use App\Models\Core\{Organization, Branch, Department};
use App\Models\Auth\User;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'branch_id',
        'department_id',
        'designation_id',
        'user_id',
        'manager_id',
        'employee_number',
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar_path',
        'date_of_birth',
        'gender',
        'address',
        'joining_date',
        'termination_date',
        'employment_type',
        'base_salary',
        'status',
    ];
    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'termination_date' => 'date',
        'base_salary' => 'decimal:2',
    ];

    public function fullName(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }
    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }
    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }
    public function payrollItems()
    {
        return $this->hasMany(PayrollItem::class);
    }
}
