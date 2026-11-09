<?php
namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sales\{Payment, Invoice};
use App\Services\Sales\InvoiceService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private InvoiceService $service) {}

    public function index(Request $request)
    {
        $payments = Payment::with('customer')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($payments);
    }

    public function show(Payment $payment)
    {
        return ApiResponse::success($payment->load('customer'));
    }

    public function store(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);
        $payment = $this->service->recordPayment($invoice, $request->all());
        return ApiResponse::success($payment, 'Payment recorded');
    }
}
