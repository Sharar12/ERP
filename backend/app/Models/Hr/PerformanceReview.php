<?php
namespace App\Models\Hr;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceReview extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
