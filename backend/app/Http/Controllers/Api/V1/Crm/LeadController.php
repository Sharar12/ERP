<?php
namespace App\Http\Controllers\Api\V1\Crm;

use App\Http\Controllers\Controller;
use App\Models\Crm\Lead;
use App\Services\Crm\LeadService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function __construct(private LeadService $service) {}

    public function index(Request $request)
    {
        $leads = Lead::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($leads);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $lead = Lead::create($data);
        return ApiResponse::created($lead);
    }

    public function show(Lead $lead) { return ApiResponse::success($lead); }
    public function update(Request $request, Lead $lead) { $lead->update($request->all()); return ApiResponse::success($lead); }
    public function destroy(Lead $lead) { $lead->delete(); return ApiResponse::noContent(); }

    public function convert(Lead $lead)
    {
        $customer = $this->service->convert($lead);
        return ApiResponse::success($customer, 'Lead converted');
    }
}
