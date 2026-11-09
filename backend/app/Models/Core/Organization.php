<?php
namespace App\Models\Core;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name','slug','legal_name','email','phone','website','logo_path',
        'address','city','state','postal_code','country','tax_id',
        'currency','timezone','locale','industry','fiscal_year_start','settings','status',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function branches(): HasMany { return $this->hasMany(Branch::class); }
    public function departments(): HasMany { return $this->hasMany(Department::class); }
    public function users(): HasMany { return $this->hasMany(User::class); }
}
