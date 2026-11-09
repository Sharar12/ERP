<?php
namespace App\Models\Finance;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
