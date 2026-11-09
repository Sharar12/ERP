<?php
namespace App\Models\Purchase;

use App\Models\Core\Organization;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;
    protected $guarded = ['id'];
    public function purchaseOrders() { return $this->hasMany(PurchaseOrder::class); }
}
