<?php
namespace App\Models\Sales;

use App\Models\Crm\Customer;
use App\Traits\BelongsToOrganization;
use App\Traits\HasDocumentNumber;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesOrder extends Model
{
    use HasFactory, BelongsToOrganization, HasDocumentNumber, SoftDeletes;
    protected $guarded = ['id'];
    public function customer() { return $this->belongsTo(Customer::class); }
    public function items() { return $this->hasMany(SalesDocumentItem::class, 'document_id')->where('document_type', 'sales_order'); }
}
