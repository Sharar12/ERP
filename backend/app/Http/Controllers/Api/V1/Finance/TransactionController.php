<?php
namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\Transaction;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $txs = Transaction::where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($txs);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $tx = Transaction::create($data);
        return ApiResponse::created($tx);
    }

    public function show(Transaction $transaction) { return ApiResponse::success($transaction); }
    public function update(Request $request, Transaction $transaction) { $transaction->update($request->all()); return ApiResponse::success($transaction); }
    public function destroy(Transaction $transaction) { $transaction->delete(); return ApiResponse::noContent(); }
}
