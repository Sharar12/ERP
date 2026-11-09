<?php
namespace App\Models\Purchase;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalRequest extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
