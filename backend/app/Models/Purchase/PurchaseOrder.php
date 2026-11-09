<?php
namespace App\Models\Purchase;

use App\Models\Core\Organization;
use App\Traits\BelongsToOrganization;
use App\Traits\HasDocumentNumber;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model
{
    use HasFactory, BelongsToOrganization, HasDocumentNumber, SoftDeletes;
    protected $guarded = ['id'];
    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function items() { return $this->hasMany(PurchaseOrderItem::class); }
    public function grns() { return $this->hasMany(GoodsReceivedNote::class); }
}
