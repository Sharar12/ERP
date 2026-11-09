<?php
namespace App\Http\Controllers\Api\V1\Asset;

use App\Http\Controllers\Controller;
use App\Models\Asset\Asset;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $assets = Asset::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($assets);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $asset = Asset::create($data);
        return ApiResponse::created($asset);
    }

    public function show(Asset $asset) { return ApiResponse::success($asset); }
    public function update(Request $request, Asset $asset) { $asset->update($request->all()); return ApiResponse::success($asset); }
    public function destroy(Asset $asset) { $asset->delete(); return ApiResponse::noContent(); }
}
