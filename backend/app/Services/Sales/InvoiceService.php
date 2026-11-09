<?php
namespace App\Services\Sales;

use App\Models\Sales\Invoice;
use App\Models\Sales\Payment;
use App\Models\Sales\SalesDocumentItem;
use App\Services\Inventory\StockService;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    public function __construct(private StockService $stock) {}

    public function create(array $data): Invoice
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];
            unset($data['items']);

            [$subtotal, $discountTotal, $taxTotal, $total] = $this->calculateTotals($items);

            $data['organization_id'] = auth()->user()->organization_id;
            $data['subtotal']       = $subtotal;
            $data['discount_total'] = $discountTotal;
            $data['tax_total']      = $taxTotal;
            $data['total']          = $total;
            $data['balance_due']    = $total;
            $data['amount_paid']    = 0;

            $invoice = Invoice::create($data);

            foreach ($items as $i => $item) {
                SalesDocumentItem::create([
                    'document_type'    => 'invoice',
                    'document_id'      => $invoice->id,
                    'product_id'       => $item['product_id'] ?? null,
                    'description'      => $item['description'],
                    'quantity'         => $item['quantity'],
                    'unit_price'       => $item['unit_price'],
                    'discount_percent' => $item['discount_percent'] ?? 0,
                    'tax_percent'      => $item['tax_percent'] ?? 0,
                    'line_total'       => $this->lineTotal($item),
                    'sort_order'       => $i,
                ]);
            }

            return $invoice->load('items', 'customer');
        });
    }

    public function post(Invoice $invoice, ?int $warehouseId = null): Invoice
    {
        abort_unless(in_array($invoice->status, ['draft', 'created']), 422, 'Only draft invoices can be posted');

        DB::transaction(function () use ($invoice, $warehouseId) {
            $invoice->update([
                'status'     => 'sent',
                'issue_date' => $invoice->issue_date ?? now(),
            ]);

            // Decrement stock for each line
            foreach ($invoice->items as $item) {
                if ($item->product_id) {
                    $this->stock->decrement(
                        productId: $item->product_id,
                        warehouseId: $warehouseId ?? $invoice->branch_id ?? 1,
                        quantity: (float) $item->quantity,
                        reference: ['type' => Invoice::class, 'id' => $invoice->id],
                    );
                }
            }

            \App\Models\System\ActivityLog::create([
                'organization_id' => $invoice->organization_id,
                'user_id' => auth()->id(),
                'event' => 'invoice.posted',
                'subject_type' => Invoice::class,
                'subject_id' => $invoice->id,
                'description' => "Invoice {$invoice->number} posted",
            ]);
        });

        return $invoice->fresh('items', 'customer');
    }

    public function recordPayment(Invoice $invoice, array $paymentData): Payment
    {
        abort_unless(in_array($invoice->status, ['sent', 'partial', 'overdue']), 422, 'Invoice not payable');

        return DB::transaction(function () use ($invoice, $paymentData) {
            $amount = (float) $paymentData['amount'];
            abort_if($amount > $invoice->balance_due, 422, 'Payment exceeds balance due');

            $payment = Payment::create([
                'organization_id' => $invoice->organization_id,
                'customer_id'     => $invoice->customer_id,
                'payable_type'    => Invoice::class,
                'payable_id'      => $invoice->id,
                'payment_date'    => $paymentData['payment_date'] ?? now(),
                'amount'          => $amount,
                'method'          => $paymentData['method'] ?? 'bank',
                'reference'       => $paymentData['reference'] ?? null,
            ]);

            $newPaid = $invoice->amount_paid + $amount;
            $newBalance = max(0, $invoice->total - $newPaid);
            $status = $newBalance == 0 ? 'paid' : 'partial';

            $invoice->update([
                'amount_paid' => $newPaid,
                'balance_due' => $newBalance,
                'status'      => $status,
            ]);

            if ($status === 'paid') {
                \App\Models\System\ActivityLog::create([
                    'organization_id' => $invoice->organization_id,
                    'user_id' => auth()->id(),
                    'event' => 'invoice.paid',
                    'subject_type' => Invoice::class,
                    'subject_id' => $invoice->id,
                    'description' => "Invoice {$invoice->number} fully paid",
                ]);
            }

            return $payment;
        });
    }

    private function calculateTotals(array $items): array
    {
        $subtotal = 0; $discountTotal = 0; $taxTotal = 0;
        foreach ($items as $item) {
            $line = (float) $item['quantity'] * (float) $item['unit_price'];
            $discount = $line * ((float) ($item['discount_percent'] ?? 0) / 100);
            $afterDiscount = $line - $discount;
            $tax = $afterDiscount * ((float) ($item['tax_percent'] ?? 0) / 100);
            $subtotal += $line;
            $discountTotal += $discount;
            $taxTotal += $tax;
        }
        $total = $subtotal - $discountTotal + $taxTotal;
        return [round($subtotal, 2), round($discountTotal, 2), round($taxTotal, 2), round($total, 2)];
    }

    private function lineTotal(array $item): float
    {
        $line = (float) $item['quantity'] * (float) $item['unit_price'];
        $discount = $line * ((float) ($item['discount_percent'] ?? 0) / 100);
        $afterDiscount = $line - $discount;
        $tax = $afterDiscount * ((float) ($item['tax_percent'] ?? 0) / 100);
        return round($afterDiscount + $tax, 2);
    }
}

