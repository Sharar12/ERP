<?php
namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sales\Invoice;
use App\Services\Sales\InvoiceService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(private InvoiceService $service) {}

    public function index(Request $request)
    {
        $invoices = Invoice::with('customer')
            ->where('organization_id', $request->user()->organization_id)
            ->latest()
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($invoices);
    }

    public function store(Request $request)
    {
        $invoice = $this->service->create($request->all());
        return ApiResponse::created($invoice);
    }

    public function show(Invoice $invoice)
    {
        return ApiResponse::success($invoice->load('items', 'customer'));
    }

    public function update(Request $request, Invoice $invoice)
    {
        $invoice->update($request->all());
        return ApiResponse::success($invoice);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return ApiResponse::noContent();
    }

    public function post(Request $request, Invoice $invoice)
    {
        $warehouseId = $request->input('warehouse_id');
        $invoice = $this->service->post($invoice, $warehouseId);
        return ApiResponse::success($invoice, 'Invoice posted');
    }
}
