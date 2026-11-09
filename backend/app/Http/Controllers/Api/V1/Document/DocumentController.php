<?php
namespace App\Http\Controllers\Api\V1\Document;

use App\Http\Controllers\Controller;
use App\Models\Document\Document;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $docs = Document::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($docs);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $doc = Document::create($data);
        return ApiResponse::created($doc);
    }

    public function show(Document $document) { return ApiResponse::success($document); }
    public function update(Request $request, Document $document) { $document->update($request->all()); return ApiResponse::success($document); }
    public function destroy(Document $document) { $document->delete(); return ApiResponse::noContent(); }
}
