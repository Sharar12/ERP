<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Asset;

use App\Http\Controllers\Controller;
use App\Models\Asset\MaintenanceRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetMaintenanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MaintenanceRecord::query()->with(['asset', 'performer']);

        if ($request->filled('asset_id')) {
            $query->where('asset_id', $request->integer('asset_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        $records = $query->latest('date')->paginate($request->integer('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data'   => $records,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'asset_id'      => ['required', 'integer', 'exists:assets,id'],
            'performed_by'  => ['nullable', 'integer', 'exists:users,id'],
            'date'          => ['required', 'date'],
            'type'          => ['required', 'string', 'in:preventive,corrective,inspection'],
            'description'   => ['required', 'string', 'max:255'],
            'cost'          => ['nullable', 'numeric', 'min:0'],
            'next_due_date' => ['nullable', 'date'],
        ]);

        $maintenance = MaintenanceRecord::create($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Asset maintenance record created successfully.',
            'data'    => $maintenance->load(['asset', 'performer']),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $maintenance = MaintenanceRecord::with(['asset', 'performer'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $maintenance,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $maintenance = MaintenanceRecord::findOrFail($id);

        $validated = $request->validate([
            'asset_id'      => ['sometimes', 'required', 'integer', 'exists:assets,id'],
            'performed_by'  => ['nullable', 'integer', 'exists:users,id'],
            'date'          => ['sometimes', 'required', 'date'],
            'type'          => ['sometimes', 'required', 'string', 'in:preventive,corrective,inspection'],
            'description'   => ['sometimes', 'required', 'string', 'max:255'],
            'cost'          => ['nullable', 'numeric', 'min:0'],
            'next_due_date' => ['nullable', 'date'],
        ]);

        $maintenance->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Asset maintenance record updated successfully.',
            'data'    => $maintenance->fresh(['asset', 'performer']),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $maintenance = MaintenanceRecord::findOrFail($id);
        $maintenance->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Asset maintenance record deleted successfully.',
        ]);
    }
}

