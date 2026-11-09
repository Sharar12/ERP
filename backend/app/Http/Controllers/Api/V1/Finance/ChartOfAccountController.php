<?php
namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\ChartOfAccount;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ChartOfAccountController extends Controller
{
    public function index(Request $request)
    {
        $accounts = ChartOfAccount::where('organization_id', $request->user()->organization_id)
            ->orderBy('code')
            ->paginate($request->input('per_page', 50));
        return ApiResponse::paginated($accounts);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $acc = ChartOfAccount::create($data);
        return ApiResponse::created($acc);
    }

    public function show(ChartOfAccount $account) { return ApiResponse::success($account); }
    public function update(Request $request, ChartOfAccount $account) { $account->update($request->all()); return ApiResponse::success($account); }
    public function destroy(ChartOfAccount $account) { $account->delete(); return ApiResponse::noContent(); }
}
