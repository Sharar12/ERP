<?php
namespace App\Models\Inventory;

use App\Models\Core\Organization;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use BelongsToOrganization, HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id','category_id','uom_id','sku','barcode','name','description',
        'image_path','type','cost_price','selling_price','tax_percent',
        'reorder_level','reorder_quantity','track_stock','track_batches',
        'track_serial','track_expiry','status',
    ];
    protected $casts = [
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'tax_percent' => 'decimal:2',
        'track_stock' => 'boolean',
        'track_batches' => 'boolean',
        'track_serial' => 'boolean',
        'track_expiry' => 'boolean',
    ];

    public function organization() { return $this->belongsTo(Organization::class); }
    public function category() { return $this->belongsTo(ProductCategory::class, 'category_id'); }
    public function uom() { return $this->belongsTo(Uom::class, 'uom_id'); }
    public function variants() { return $this->hasMany(ProductVariant::class); }
    public function stockLevels() { return $this->hasMany(StockLevel::class); }
    public function movements() { return $this->hasMany(StockMovement::class); }
}
