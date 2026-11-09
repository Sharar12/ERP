<?php
namespace App\Models\Helpdesk;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;
    protected $guarded = ['id'];
}
