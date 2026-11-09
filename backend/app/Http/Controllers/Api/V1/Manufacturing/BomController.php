<?php
namespace App\Http\Controllers\Api\V1\Manufacturing;

use App\Http\Controllers\Controller;
use App\Models\Manufacturing\Bom;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BomController extends Controller
{
    public function index(Request $request)
    {
        $boms = Bom::with('product')
            ->where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($boms);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $bom = Bom::create($data);
        return ApiResponse::created($bom);
    }

    public function show(Bom $bom) { return ApiResponse::success($bom->load('product')); }
    public function update(Request $request, Bom $bom) { $bom->update($request->all()); return ApiResponse::success($bom); }
    public function destroy(Bom $bom) { $bom->delete(); return ApiResponse::noContent(); }
}
