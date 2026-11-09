<?php
namespace App\Http\Controllers\Api\V1\Task;

use App\Http\Controllers\Controller;
use App\Models\Task\Task;
use App\Services\Task\TaskService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private TaskService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Task::class);
        $tasks = Task::with('assignedUser', 'project')
            ->where('organization_id', $request->user()->organization_id)
            ->orderBy('sort_order')
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($tasks);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Task::class);
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $task = Task::create($data);
        return ApiResponse::created($task);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return ApiResponse::success($task->load('assignedUser', 'project'));
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        $task->update($request->all());
        return ApiResponse::success($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();
        return ApiResponse::noContent();
    }

    public function moveStatus(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        $moved = $this->service->moveStatus(
            $task,
            $request->input('status'),
            (int) $request->input('position', 0)
        );
        return ApiResponse::success($moved, 'Task status moved');
    }

    public function reorder(Request $request)
    {
        $this->authorize('viewAny', Task::class);
        $this->service->reorder($request->input('ordered_ids', []));
        return ApiResponse::success(null, 'Tasks reordered');
    }
}
