<?php
namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\LoginHistory;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class LoginHistoryController extends Controller
{
    public function index(Request $request)
    {
        $userIds = \App\Models\Auth\User::where('organization_id', $request->user()->organization_id)->pluck('id');
        $history = LoginHistory::whereIn('user_id', $userIds)
            ->latest('logged_in_at')
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($history);
    }
}

