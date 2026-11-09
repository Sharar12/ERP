<?php
namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginHistory extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'login_history';
    protected $guarded = ['id'];
}
