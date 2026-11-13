<?php
namespace App\Http\Controllers\Api\V1\Hr;

use App\Http\Controllers\Controller;
use App\Models\Hr\PerformanceReview;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class PerformanceReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = PerformanceReview::with(['employee', 'reviewer'])
            ->where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($reviews);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $review = PerformanceReview::create($data);
        return ApiResponse::created($review);
    }

    public function show(PerformanceReview $review) { return ApiResponse::success($review); }
    public function update(Request $request, PerformanceReview $review) { $review->update($request->all()); return ApiResponse::success($review); }
    public function destroy(PerformanceReview $review) { $review->delete(); return ApiResponse::noContent(); }
}

