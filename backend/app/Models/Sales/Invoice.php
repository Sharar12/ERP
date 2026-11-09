<?php
namespace App\Models\Sales;

use App\Models\Core\{Organization, Branch};
use App\Models\Crm\Customer;
use App\Models\Auth\User;
use App\Traits\{BelongsToOrganization, HasDocumentNumber};
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use BelongsToOrganization, HasDocumentNumber, HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id','branch_id','customer_id','sales_order_id','sales_rep_id',
        'number','issue_date','due_date','subtotal','discount_total','tax_total',
        'total','amount_paid','balance_due','status','is_recurring','recurrence','notes',
    ];
    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'is_recurring' => 'boolean',
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance_due' => 'decimal:2',
    ];

    public function customer() { return $this->belongsTo(Customer::class); }
    public function items() { return $this->hasMany(SalesDocumentItem::class, 'document_id')->where('document_type', 'invoice'); }
    public function payments() { return $this->morphMany(Payment::class, 'payable'); }
}
