<?php
namespace App\Models\Sales;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesTarget extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
