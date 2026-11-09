<?php
namespace App\Models\Manufacturing;

use App\Models\Inventory\Product;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bom extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
    public function product() { return $this->belongsTo(Product::class); }
}
