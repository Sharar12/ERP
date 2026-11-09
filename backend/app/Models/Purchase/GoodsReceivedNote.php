<?php
namespace App\Models\Purchase;

use App\Models\Core\Organization;
use App\Models\Inventory\Warehouse;
use App\Traits\BelongsToOrganization;
use App\Traits\HasDocumentNumber;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GoodsReceivedNote extends Model
{
    use HasFactory, BelongsToOrganization, HasDocumentNumber, SoftDeletes;
    protected $guarded = ['id'];
    public function purchaseOrder() { return $this->belongsTo(PurchaseOrder::class); }
    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function warehouse() { return $this->belongsTo(Warehouse::class); }
    public function items() { return $this->hasMany(GoodsReceivedItem::class, 'goods_received_note_id'); }
}
