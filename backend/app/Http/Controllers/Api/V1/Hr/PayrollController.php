<?php
namespace App\Http\Controllers\Api\V1\Hr;

use App\Http\Controllers\Controller;
use App\Models\Hr\PayrollRun;
use App\Services\Hr\PayrollService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function __construct(private PayrollService $service) {}

    public function index(Request $request)
    {
        $runs = PayrollRun::where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($runs);
    }

    public function generate(Request $request)
    {
        $run = $this->service->generate($request->input('period', now()->format('Y-m')));
        return ApiResponse::created($run);
    }

    public function show(PayrollRun $run)
    {
        return ApiResponse::success($run->load('items.employee'));
    }

    public function approve(PayrollRun $run)
    {
        $run->update(['status' => 'approved']);
        return ApiResponse::success($run);
    }

    public function pay(Request $request, PayrollRun $run)
    {
        $run->update([
            'status' => 'paid',
            'payment_date' => $request->input('payment_date', now()->toDateString()),
        ]);
        return ApiResponse::success($run);
    }
}
