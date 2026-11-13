<?php
namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use App\Models\System\Announcement;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $announcements = Announcement::with('author')
            ->where('organization_id', $request->user()->organization_id)
            ->latest('published_at')
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($announcements);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $data['created_by'] = $request->user()->id;
        $data['published_at'] = $data['published_at'] ?? now();
        $ann = Announcement::create($data);
        return ApiResponse::created($ann);
    }

    public function show(Announcement $announcement) { return ApiResponse::success($announcement); }
    public function update(Request $request, Announcement $announcement) { $announcement->update($request->all()); return ApiResponse::success($announcement); }
    public function destroy(Announcement $announcement) { $announcement->delete(); return ApiResponse::noContent(); }
}

