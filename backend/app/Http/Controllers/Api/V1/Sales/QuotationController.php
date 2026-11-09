<?php
namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sales\Quotation;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $quotes = Quotation::with('customer')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($quotes);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $items = $data['items'] ?? [];
        unset($data['items']);

        $subtotal = 0;
        $taxTotal = 0;
        foreach ($items as $item) {
            $line = ($item['quantity'] ?? 0) * ($item['unit_price'] ?? 0);
            $subtotal += $line;
            $taxTotal += $line * (($item['tax_percent'] ?? 0) / 100);
        }
        $data['subtotal'] = round($subtotal, 2);
        $data['tax_total'] = round($taxTotal, 2);
        $data['total'] = round($subtotal + $taxTotal, 2);

        $q = Quotation::create($data);
        foreach ($items as $item) {
            $q->items()->create([
                'document_type' => 'quotation',
                'document_id' => $q->id,
                'product_id' => $item['product_id'] ?? null,
                'description' => $item['description'] ?? '',
                'quantity' => $item['quantity'] ?? 1,
                'unit_price' => $item['unit_price'] ?? 0,
                'tax_percent' => $item['tax_percent'] ?? 0,
                'line_total' => round(($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0), 2),
            ]);
        }
        return ApiResponse::created($q);
    }

    public function accept(Quotation $quotation)
    {
        $quotation->update(['status' => 'accepted']);
        \App\Models\System\ActivityLog::create([
            'organization_id' => $quotation->organization_id,
            'user_id' => auth()->id(),
            'event' => 'quotation.accepted',
            'subject_type' => Quotation::class,
            'subject_id' => $quotation->id,
            'description' => 'Quotation accepted',
        ]);
        return ApiResponse::success($quotation);
    }

    public function show(Quotation $quotation) { return ApiResponse::success($quotation->load('customer')); }
    public function update(Request $request, Quotation $quotation) { $quotation->update($request->all()); return ApiResponse::success($quotation); }
    public function destroy(Quotation $quotation) { $quotation->delete(); return ApiResponse::noContent(); }
}
