<?php
namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase\SupplierPayment;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class SupplierPaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = SupplierPayment::with('supplier')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($payments);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $payment = SupplierPayment::create($data);

        if (!empty($data['purchase_invoice_id'])) {
            $bill = \App\Models\Purchase\PurchaseInvoice::find($data['purchase_invoice_id']);
            if ($bill) {
                $bill->update(['status' => 'paid', 'amount_paid' => $bill->total]);
            }
        }

        \App\Models\System\ActivityLog::create([
            'organization_id' => $payment->organization_id,
            'user_id' => auth()->id(),
            'event' => 'supplier_payment.recorded',
            'subject_type' => SupplierPayment::class,
            'subject_id' => $payment->id,
            'description' => 'Supplier payment recorded',
        ]);

        return ApiResponse::created($payment);
    }

    public function show(SupplierPayment $payment) { return ApiResponse::success($payment); }
    public function update(Request $request, SupplierPayment $payment) { $payment->update($request->all()); return ApiResponse::success($payment); }
    public function destroy(SupplierPayment $payment) { $payment->delete(); return ApiResponse::noContent(); }
}
