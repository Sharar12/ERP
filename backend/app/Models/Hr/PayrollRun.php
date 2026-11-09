<?php
namespace App\Models\Hr;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollRun extends Model
{
    use HasFactory, BelongsToOrganization;
    protected $guarded = ['id'];
    public function items() { return $this->hasMany(PayrollItem::class); }
}
