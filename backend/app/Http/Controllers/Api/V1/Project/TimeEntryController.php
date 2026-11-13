<?php
namespace App\Http\Controllers\Api\V1\Project;

use App\Http\Controllers\Controller;
use App\Models\Project\TimeEntry;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    public function index(Request $request)
    {
        $entries = TimeEntry::with(['user', 'project', 'task'])
            ->where('organization_id', $request->user()->organization_id)
            ->latest('date')
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($entries);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $data['user_id'] = $data['user_id'] ?? $request->user()->id;
        $entry = TimeEntry::create($data);
        return ApiResponse::created($entry);
    }

    public function show(TimeEntry $entry) { return ApiResponse::success($entry); }
    public function update(Request $request, TimeEntry $entry) { $entry->update($request->all()); return ApiResponse::success($entry); }
    public function destroy(TimeEntry $entry) { $entry->delete(); return ApiResponse::noContent(); }
}

