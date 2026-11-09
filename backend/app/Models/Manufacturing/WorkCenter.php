<?php
namespace App\Models\Manufacturing;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkCenter extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
