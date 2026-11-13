<?php
namespace App\Http\Controllers\Api\V1\Helpdesk;

use App\Http\Controllers\Controller;
use App\Models\Helpdesk\KnowledgeBaseArticle;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class KnowledgeBaseController extends Controller
{
    public function index(Request $request)
    {
        $articles = KnowledgeBaseArticle::where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($articles);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $article = KnowledgeBaseArticle::create($data);
        return ApiResponse::created($article);
    }

    public function show(KnowledgeBaseArticle $kb) { return ApiResponse::success($kb); }
    public function update(Request $request, KnowledgeBaseArticle $kb) { $kb->update($request->all()); return ApiResponse::success($kb); }
    public function destroy(KnowledgeBaseArticle $kb) { $kb->delete(); return ApiResponse::noContent(); }
}

