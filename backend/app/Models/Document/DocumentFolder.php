<?php
namespace App\Models\Document;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentFolder extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
