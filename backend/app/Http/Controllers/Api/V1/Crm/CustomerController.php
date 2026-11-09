<?php
namespace App\Http\Controllers\Api\V1\Crm;

use App\Http\Controllers\Controller;
use App\Http\Requests\Crm\{StoreCustomerRequest, UpdateCustomerRequest};
use App\Http\Resources\Crm\CustomerResource;
use App\Models\Crm\Customer;
use App\Services\Crm\CustomerService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(private CustomerService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Customer::class);
        $customers = $this->service->paginate($request);
        return ApiResponse::paginated($customers, CustomerResource::class);
    }

    public function store(StoreCustomerRequest $request)
    {
        $this->authorize('create', Customer::class);
        $customer = $this->service->create($request->validated());
        return ApiResponse::created(new CustomerResource($customer), 'Customer created');
    }

    public function show(Customer $customer)
    {
        $this->authorize('view', $customer);
        return ApiResponse::success(new CustomerResource($customer->load('contacts', 'group')));
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $this->authorize('update', $customer);
        $updated = $this->service->update($customer, $request->validated());
        return ApiResponse::success(new CustomerResource($updated), 'Customer updated');
    }

    public function destroy(Customer $customer)
    {
        $this->authorize('delete', $customer);
        $this->service->delete($customer);
        return ApiResponse::noContent();
    }
}

