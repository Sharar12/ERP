<?php
namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use App\Models\System\ActivityLog;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($logs);
    }
}
