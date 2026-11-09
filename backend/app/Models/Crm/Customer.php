<?php
namespace App\Models\Crm;

use App\Models\Core\{Organization, Branch};
use App\Models\Auth\User;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use BelongsToOrganization, HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id','branch_id','company_id','customer_group_id','account_manager_id',
        'code','name','email','phone','tax_id','billing_address','shipping_address',
        'credit_limit','opening_balance','status','tags',
    ];
    protected $casts = [
        'tags' => 'array',
        'credit_limit' => 'decimal:2',
        'opening_balance' => 'decimal:2',
    ];

    public function organization() { return $this->belongsTo(Organization::class); }
    public function branch() { return $this->belongsTo(Branch::class); }
    public function group() { return $this->belongsTo(CustomerGroup::class, 'customer_group_id'); }
    public function contacts() { return $this->hasMany(Contact::class); }
    public function invoices() { return $this->hasMany(\App\Models\Sales\Invoice::class); }
    public function notes() { return $this->hasMany(CustomerNote::class); }
    public function activities() { return $this->hasMany(CustomerActivity::class); }
}
