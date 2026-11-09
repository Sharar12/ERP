<?php
namespace App\Http\Controllers\Api\V1\Hr;

use App\Http\Controllers\Controller;
use App\Models\Hr\Employee;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $employees = Employee::with('department')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($employees);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $emp = Employee::create($data);
        return ApiResponse::created($emp);
    }

    public function show(Employee $employee) { return ApiResponse::success($employee->load('department')); }
    public function update(Request $request, Employee $employee) { $employee->update($request->all()); return ApiResponse::success($employee); }
    public function destroy(Employee $employee) { $employee->delete(); return ApiResponse::noContent(); }
}
