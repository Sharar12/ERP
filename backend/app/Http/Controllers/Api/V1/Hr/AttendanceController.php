<?php
namespace App\Http\Controllers\Api\V1\Hr;

use App\Http\Controllers\Controller;
use App\Models\Hr\Attendance;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $attendance = Attendance::with('employee')
            ->where('organization_id', $request->user()->organization_id)
            ->latest('date')
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($attendance);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $att = Attendance::create($data);
        return ApiResponse::created($att);
    }

    public function show(Attendance $attendance) { return ApiResponse::success($attendance); }
    public function update(Request $request, Attendance $attendance) { $attendance->update($request->all()); return ApiResponse::success($attendance); }
    public function destroy(Attendance $attendance) { $attendance->delete(); return ApiResponse::noContent(); }
}
