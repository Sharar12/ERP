<?php
namespace App\Models\Inventory;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockAdjustment extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;
    protected $guarded = ['id'];
    public function items() { return $this->hasMany(StockAdjustmentItem::class); }
}
