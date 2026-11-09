<?php
namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\JournalEntry;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class JournalEntryController extends Controller
{
    public function index(Request $request)
    {
        $entries = JournalEntry::where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($entries);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $je = JournalEntry::create($data);
        return ApiResponse::created($je);
    }

    public function show(JournalEntry $journal) { return ApiResponse::success($journal); }
    public function update(Request $request, JournalEntry $journal) { $journal->update($request->all()); return ApiResponse::success($journal); }
    public function destroy(JournalEntry $journal) { $journal->delete(); return ApiResponse::noContent(); }

    public function post(JournalEntry $journal)
    {
        $journal->update(['status' => 'posted', 'posted_at' => now()]);
        return ApiResponse::success($journal, 'Journal entry posted');
    }
}
