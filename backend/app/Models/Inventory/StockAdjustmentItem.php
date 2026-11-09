<?php
namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockAdjustmentItem extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function adjustment() { return $this->belongsTo(StockAdjustment::class, 'stock_adjustment_id'); }
    public function product() { return $this->belongsTo(Product::class); }
}
