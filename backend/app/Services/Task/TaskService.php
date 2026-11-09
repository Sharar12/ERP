<?php
namespace App\Services\Task;

use App\Models\Task\Task;
use Illuminate\Support\Facades\DB;

class TaskService
{
    public function moveStatus(Task $task, string $newStatus, int $newPosition): Task
    {
        $valid = ['todo', 'in_progress', 'review', 'done', 'cancelled'];
        abort_unless(in_array($newStatus, $valid), 422, 'Invalid status');

        return DB::transaction(function () use ($task, $newStatus, $newPosition) {
            // Shift siblings in the destination column
            Task::where('organization_id', $task->organization_id)
                ->where('status', $newStatus)
                ->where('id', '!=', $task->id)
                ->where('sort_order', '>=', $newPosition)
                ->increment('sort_order');

            $task->update([
                'status'        => $newStatus,
                'sort_order'    => $newPosition,
                'completed_at'  => $newStatus === 'done' ? now() : null,
            ]);

            return $task->fresh();
        });
    }

    public function reorder(array $orderedIds): void
    {
        DB::transaction(function () use ($orderedIds) {
            foreach ($orderedIds as $index => $id) {
                Task::where('id', $id)
                    ->where('organization_id', auth()->user()->organization_id)
                    ->update(['sort_order' => $index]);
            }
        });
    }
}

