<?php
namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\Budget;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $budgets = Budget::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($budgets);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $b = Budget::create($data);
        return ApiResponse::created($b);
    }

    public function show(Budget $budget) { return ApiResponse::success($budget); }
    public function update(Request $request, Budget $budget) { $budget->update($request->all()); return ApiResponse::success($budget); }
    public function destroy(Budget $budget) { $budget->delete(); return ApiResponse::noContent(); }
}
