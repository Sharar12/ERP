<?php
namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\BankAccount;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    public function index(Request $request)
    {
        $banks = BankAccount::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($banks);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $b = BankAccount::create($data);
        return ApiResponse::created($b);
    }

    public function show(BankAccount $bank_account) { return ApiResponse::success($bank_account); }
    public function update(Request $request, BankAccount $bank_account) { $bank_account->update($request->all()); return ApiResponse::success($bank_account); }
    public function destroy(BankAccount $bank_account) { $bank_account->delete(); return ApiResponse::noContent(); }
}
