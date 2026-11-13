<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\StockTransfer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockTransferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = StockTransfer::query()
            ->with(['fromWarehouse', 'toWarehouse', 'items.product']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('warehouse_id')) {
            $warehouseId = $request->integer('warehouse_id');
            $query->where(function ($q) use ($warehouseId) {
                $q->where('from_warehouse_id', $warehouseId)
                  ->orWhere('to_warehouse_id', $warehouseId);
            });
        }

        $transfers = $query->latest()->paginate($request->integer('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data'   => $transfers,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'number'            => ['nullable', 'string', 'max:100'],
            'from_warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'to_warehouse_id'   => ['required', 'integer', 'exists:warehouses,id', 'different:from_warehouse_id'],
            'transfer_date'     => ['required', 'date'],
            'status'            => ['nullable', 'string', 'in:draft,in_transit,received,cancelled'],
            'notes'             => ['nullable', 'string'],
            'items'             => ['nullable', 'array'],
            'items.*.product_id'=> ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'  => ['required', 'numeric', 'gt:0'],
        ]);

        $transfer = DB::transaction(function () use ($validated) {
            $transfer = StockTransfer::create([
                'number'            => $validated['number'] ?? ('TRF-' . strtoupper(uniqid())),
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id'   => $validated['to_warehouse_id'],
                'transfer_date'     => $validated['transfer_date'],
                'status'            => $validated['status'] ?? 'draft',
                'notes'             => $validated['notes'] ?? null,
            ]);

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $transfer->items()->create([
                        'product_id' => $item['product_id'],
                        'quantity'   => $item['quantity'],
                    ]);
                }
            }

            return $transfer;
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Stock transfer created successfully.',
            'data'    => $transfer->load(['fromWarehouse', 'toWarehouse', 'items.product']),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $transfer = StockTransfer::with([
            'fromWarehouse',
            'toWarehouse',
            'items.product',
        ])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $transfer,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $transfer = StockTransfer::findOrFail($id);

        if ($transfer->status === 'received') {
            throw ValidationException::withMessages([
                'status' => ['Received transfers cannot be modified.'],
            ]);
        }

        $validated = $request->validate([
            'from_warehouse_id' => ['sometimes', 'required', 'integer', 'exists:warehouses,id'],
            'to_warehouse_id'   => ['sometimes', 'required', 'integer', 'exists:warehouses,id', 'different:from_warehouse_id'],
            'transfer_date'     => ['sometimes', 'required', 'date'],
            'status'            => ['sometimes', 'string', 'in:draft,in_transit,received,cancelled'],
            'notes'             => ['nullable', 'string'],
        ]);

        $transfer->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Stock transfer updated successfully.',
            'data'    => $transfer->fresh(['fromWarehouse', 'toWarehouse', 'items.product']),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $transfer = StockTransfer::findOrFail($id);

        if ($transfer->status === 'received') {
            throw ValidationException::withMessages([
                'status' => ['Received transfers cannot be deleted.'],
            ]);
        }

        $transfer->items()->delete();
        $transfer->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Stock transfer deleted successfully.',
        ]);
    }
}

