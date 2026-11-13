<?php
namespace App\Models\Manufacturing;

use Illuminate\Database\Eloquent\Model;

class BomItem extends Model
{
    protected $guarded = ['id'];

    public function bom()
    {
        return $this->belongsTo(Bom::class);
    }
}

