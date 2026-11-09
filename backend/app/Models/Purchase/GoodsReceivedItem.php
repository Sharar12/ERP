<?php
namespace App\Models\Purchase;

use App\Models\Inventory\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoodsReceivedItem extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function goodsReceivedNote() { return $this->belongsTo(GoodsReceivedNote::class); }
    public function product() { return $this->belongsTo(Product::class); }
    public function purchaseOrderItem() { return $this->belongsTo(PurchaseOrderItem::class); }
}
