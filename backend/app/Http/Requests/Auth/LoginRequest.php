<?php
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class LoginRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    public function ensureIsNotRateLimited(): void
    {
        $key = 'login:'.Str::lower($this->email).'|'.$this->ip();
        if (!RateLimiter::tooManyAttempts($key, 5)) return;

        throw ValidationException::withMessages([
            'email' => "Too many attempts. Try again in ".RateLimiter::availableIn($key)."s.",
        ]);
    }
}

