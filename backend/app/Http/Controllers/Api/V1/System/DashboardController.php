<?php
namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->organization_id;
        $stats = [
            'revenue' => 128450.00,
            'customers_count' => \App\Models\Crm\Customer::count(),
            'invoices_count' => \App\Models\Sales\Invoice::count(),
            'products_count' => \App\Models\Inventory\Product::count(),
            'employees_count' => \App\Models\Hr\Employee::count(),
        ];
        return ApiResponse::success($stats);
    }
}
