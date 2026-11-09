<?php
namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\Product;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($products);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $product = Product::create($data);
        return ApiResponse::created($product);
    }

    public function show(Product $product) { return ApiResponse::success($product); }
    public function update(Request $request, Product $product) { $product->update($request->all()); return ApiResponse::success($product); }
    public function destroy(Product $product) { $product->delete(); return ApiResponse::noContent(); }
}
