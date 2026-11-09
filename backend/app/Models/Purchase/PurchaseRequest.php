<?php
namespace App\Models\Purchase;

use App\Traits\BelongsToOrganization;
use App\Traits\HasDocumentNumber;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseRequest extends Model
{
    use HasFactory, BelongsToOrganization, HasDocumentNumber, SoftDeletes;
    protected $guarded = ['id'];
}
