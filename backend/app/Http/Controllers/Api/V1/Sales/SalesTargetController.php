<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sales\SalesTarget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalesTargetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SalesTarget::query()->with(['user']);

        if ($request->filled('period')) {
            $query->where('period', $request->string('period'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        $targets = $query->latest()->paginate($request->integer('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data'   => $targets,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id'       => ['nullable', 'integer', 'exists:users,id'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'achieved_amount' => ['nullable', 'numeric', 'min:0'],
            'period'        => ['required', 'string'],
            'start_date'    => ['required', 'date'],
            'end_date'      => ['required', 'date', 'after_or_equal:start_date'],
            'notes'         => ['nullable', 'string'],
        ]);

        $target = SalesTarget::create($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Sales target created successfully.',
            'data'    => $target->load(['user']),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $target = SalesTarget::with(['user'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $target,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $target = SalesTarget::findOrFail($id);

        $validated = $request->validate([
            'user_id'         => ['nullable', 'integer', 'exists:users,id'],
            'target_amount'   => ['sometimes', 'required', 'numeric', 'min:0'],
            'achieved_amount' => ['nullable', 'numeric', 'min:0'],
            'period'          => ['sometimes', 'required', 'string'],
            'start_date'      => ['sometimes', 'required', 'date'],
            'end_date'        => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'notes'           => ['nullable', 'string'],
        ]);

        $target->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Sales target updated successfully.',
            'data'    => $target->fresh(['user']),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $target = SalesTarget::findOrFail($id);
        $target->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Sales target deleted successfully.',
        ]);
    }
}

