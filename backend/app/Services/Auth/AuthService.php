<?php
namespace App\Services\Auth;

use App\Models\Auth\User;
use App\Models\Auth\LoginHistory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(string $email, string $password, bool $remember = false): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            if ($user) {
                $this->recordLogin($user, 'failed');
            }
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Account is not active'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;
        $this->recordLogin($user, 'success');

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    private function recordLogin(User $user, string $status): void
    {
        LoginHistory::create([
            'user_id'      => $user->id,
            'ip_address'   => request()->ip(),
            'user_agent'   => request()->userAgent(),
            'status'       => $status,
            'logged_in_at' => now(),
        ]);
    }
}

