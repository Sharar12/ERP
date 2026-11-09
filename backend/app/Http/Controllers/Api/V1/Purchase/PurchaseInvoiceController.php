<?php
namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase\PurchaseInvoice;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class PurchaseInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = PurchaseInvoice::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($invoices);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $invoice = PurchaseInvoice::create($data);
        return ApiResponse::created($invoice);
    }

    public function show(PurchaseInvoice $invoice) { return ApiResponse::success($invoice); }
    public function update(Request $request, PurchaseInvoice $invoice) { $invoice->update($request->all()); return ApiResponse::success($invoice); }
    public function destroy(PurchaseInvoice $invoice) { $invoice->delete(); return ApiResponse::noContent(); }

    public function post(PurchaseInvoice $invoice)
    {
        $invoice->update(['status' => 'unpaid']);
        \App\Models\System\ActivityLog::create([
            'organization_id' => $invoice->organization_id,
            'user_id' => auth()->id(),
            'event' => 'purchase_invoice.posted',
            'subject_type' => PurchaseInvoice::class,
            'subject_id' => $invoice->id,
            'description' => 'Purchase invoice posted',
        ]);
        return ApiResponse::success($invoice);
    }
}

