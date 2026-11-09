<?php
namespace App\Models\Hr;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
