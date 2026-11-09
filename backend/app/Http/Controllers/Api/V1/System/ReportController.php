<?php
namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function catalogue()
    {
        return ApiResponse::success([
            ['id' => 'sales-summary', 'name' => 'Sales Summary', 'category' => 'sales'],
            ['id' => 'pnl', 'name' => 'Profit & Loss', 'category' => 'finance'],
            ['id' => 'stock-valuation', 'name' => 'Stock Valuation', 'category' => 'inventory'],
        ]);
    }

    public function build(Request $request)
    {
        return ApiResponse::success(['report' => $request->all(), 'generated_at' => now()]);
    }
}
