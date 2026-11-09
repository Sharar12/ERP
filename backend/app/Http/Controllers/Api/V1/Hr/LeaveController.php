<?php
namespace App\Http\Controllers\Api\V1\Hr;

use App\Http\Controllers\Controller;
use App\Models\Hr\Leave;
use App\Services\Hr\LeaveService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function __construct(private LeaveService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Leave::class);
        $query = Leave::with('employee', 'leaveType')
            ->where('organization_id', $request->user()->organization_id);

        if ($st = $request->input('filter.status')) {
            $query->where('status', $st);
        }

        $leaves = $query->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($leaves);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Leave::class);
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $leave = Leave::create($data);
        return ApiResponse::created($leave);
    }

    public function show(Leave $leave)
    {
        $this->authorize('view', $leave);
        return ApiResponse::success($leave->load('employee', 'leaveType'));
    }

    public function update(Request $request, Leave $leave)
    {
        $this->authorize('update', $leave);
        $leave->update($request->all());
        return ApiResponse::success($leave);
    }

    public function destroy(Leave $leave)
    {
        $this->authorize('delete', $leave);
        $leave->delete();
        return ApiResponse::noContent();
    }

    public function approve(Request $request, Leave $leave)
    {
        $this->authorize('approve', $leave);
        $approved = $this->service->approve($leave, $request->user(), $request->input('note'));
        return ApiResponse::success($approved, 'Leave approved');
    }

    public function reject(Request $request, Leave $leave)
    {
        $this->authorize('approve', $leave);
        $rejected = $this->service->reject($leave, $request->user(), $request->input('note'));
        return ApiResponse::success($rejected, 'Leave rejected');
    }
}
