<?php
namespace App\Models\Quality;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QualityInspection extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
