<?php
namespace App\Http\Controllers\Api\V1\Hr;

use App\Http\Controllers\Controller;
use App\Models\Hr\Shift;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function index(Request $request)
    {
        $shifts = Shift::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($shifts);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $shift = Shift::create($data);
        return ApiResponse::created($shift);
    }

    public function show(Shift $shift) { return ApiResponse::success($shift); }
    public function update(Request $request, Shift $shift) { $shift->update($request->all()); return ApiResponse::success($shift); }
    public function destroy(Shift $shift) { $shift->delete(); return ApiResponse::noContent(); }
}

