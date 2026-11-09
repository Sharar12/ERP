<?php
namespace App\Models\System;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = ['key','name','icon','category','description','default_settings','is_core'];
    protected $casts = ['default_settings' => 'array', 'is_core' => 'boolean'];

    public function dependencies()
    {
        return $this->belongsToMany(Module::class, 'module_dependencies', 'module_id', 'depends_on_module_id');
    }
}
