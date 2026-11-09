<?php
namespace App\Models\Crm;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;
    protected $guarded = ['id'];
}
