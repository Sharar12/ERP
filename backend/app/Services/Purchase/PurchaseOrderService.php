<?php
namespace App\Services\Purchase;

use App\Models\Purchase\PurchaseOrder;
use App\Models\Purchase\ApprovalRequest;
use App\Models\System\ActivityLog;
use App\Models\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderService
{
    public function paginate(Request $request)
    {
        $query = PurchaseOrder::with('supplier');

        if ($s = $request->string('search')->toString()) {
            $query->where(fn ($q) => $q
                ->where('number', 'like', "%{$s}%")
                ->orWhereHas('supplier', fn ($q2) => $q2->where('name', 'like', "%{$s}%")));
        }
        if ($st = $request->input('filter.status')) $query->where('status', $st);
        if ($sup = $request->input('filter.supplier_id')) $query->where('supplier_id', $sup);

        $sort = $request->input('sort', '-created_at');
        $query->orderBy(ltrim($sort, '-'), str_starts_with($sort, '-') ? 'desc' : 'asc');

        return $query->paginate(min((int) $request->input('per_page', 15), 100));
    }

    public function create(array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];
            unset($data['items']);

            $data['organization_id'] = auth()->user()->organization_id;
            $data['created_by']      = auth()->id();
            $data['status']          = 'draft';

            $totals = $this->totals($items);
            $data = array_merge($data, $totals);

            $po = PurchaseOrder::create($data);
            foreach ($items as $i => $item) {
                $po->items()->create(array_merge($item, [
                    'line_total' => round($item['quantity'] * $item['unit_price'] * (1 + ($item['tax_percent'] ?? 0) / 100), 2),
                    'sort_order' => $i,
                ]));
            }
            return $po->load('items', 'supplier');
        });
    }

    public function update(PurchaseOrder $po, array $data): PurchaseOrder
    {
        abort_unless($po->status === 'draft', 422, 'Only draft orders can be edited');

        return DB::transaction(function () use ($po, $data) {
            $items = $data['items'] ?? null;
            unset($data['items']);

            if ($items !== null) {
                $po->items()->delete();
                foreach ($items as $i => $item) {
                    $po->items()->create(array_merge($item, [
                        'line_total' => round($item['quantity'] * $item['unit_price'] * (1 + ($item['tax_percent'] ?? 0) / 100), 2),
                        'sort_order' => $i,
                    ]));
                }
                $data = array_merge($data, $this->totals($items));
            }

            $po->update($data);
            return $po->fresh('items', 'supplier');
        });
    }

    public function delete(PurchaseOrder $po): void
    {
        abort_unless(in_array($po->status, ['draft', 'cancelled']), 422, 'Only draft/cancelled orders can be deleted');
        $po->delete();
    }

    public function approve(PurchaseOrder $po, User $approver): PurchaseOrder
    {
        abort_unless($po->status === 'draft', 422, 'Order already processed');

        return DB::transaction(function () use ($po, $approver) {
            $po->update(['status' => 'approved']);

            ApprovalRequest::create([
                'workflow_id'     => $this->defaultWorkflowId($po->organization_id),
                'organization_id' => $po->organization_id,
                'subject_type'    => PurchaseOrder::class,
                'subject_id'      => $po->id,
                'current_step'    => 1,
                'status'          => 'approved',
            ]);

            ActivityLog::create([
                'organization_id' => $po->organization_id,
                'user_id'         => $approver->id,
                'subject_type'    => PurchaseOrder::class,
                'subject_id'      => $po->id,
                'event'           => 'purchase_order.approved',
                'description'     => "PO {$po->number} approved by {$approver->name}",
            ]);

            return $po->fresh('items', 'supplier');
        });
    }

    private function totals(array $items): array
    {
        $subtotal = 0; $tax = 0;
        foreach ($items as $item) {
            $line = $item['quantity'] * $item['unit_price'];
            $subtotal += $line;
            $tax += $line * (($item['tax_percent'] ?? 0) / 100);
        }
        return [
            'subtotal'  => round($subtotal, 2),
            'tax_total' => round($tax, 2),
            'total'     => round($subtotal + $tax, 2),
        ];
    }

    private function defaultWorkflowId(int $orgId): int
    {
        $workflow = \App\Models\Purchase\ApprovalWorkflow::firstOrCreate(
            ['organization_id' => $orgId, 'entity_type' => 'purchase_order'],
            ['name' => 'Default PO Approval', 'active' => true]
        );
        return $workflow->id;
    }
}
