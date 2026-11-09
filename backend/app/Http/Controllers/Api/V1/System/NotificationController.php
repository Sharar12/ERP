<?php
namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use App\Models\System\Notification;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($notifications);
    }

    public function markRead(Notification $notification)
    {
        $notification->update(['read_at' => now()]);
        return ApiResponse::success($notification);
    }

    public function markAllRead(Request $request)
    {
        Notification::where('organization_id', $request->user()->organization_id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
        return ApiResponse::success(null, 'All marked as read');
    }
}
