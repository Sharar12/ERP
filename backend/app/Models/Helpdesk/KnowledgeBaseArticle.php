<?php
namespace App\Models\Helpdesk;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KnowledgeBaseArticle extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
}
