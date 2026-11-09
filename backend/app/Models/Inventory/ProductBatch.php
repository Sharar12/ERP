<?php
namespace App\Models\Inventory;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductBatch extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
