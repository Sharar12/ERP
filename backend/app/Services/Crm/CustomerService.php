<?php
namespace App\Services\Crm;

use App\Models\Crm\Customer;
use App\Models\System\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function paginate(Request $request)
    {
        $query = Customer::with('group');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('filter.status')) {
            $query->where('status', $status);
        }
        if ($groupId = $request->input('filter.customer_group_id')) {
            $query->where('customer_group_id', $groupId);
        }

        $sort = $request->input('sort', '-created_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);

        $perPage = min((int) $request->input('per_page', 15), 100);
        return $query->paginate($perPage);
    }

    public function create(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            $data['organization_id'] = auth()->user()->organization_id;
            $data['branch_id'] = $data['branch_id'] ?? auth()->user()->branch_id;

            if (empty($data['code'])) {
                $data['code'] = $this->nextCode();
            }

            $customer = Customer::create($data);

            ActivityLog::create([
                'organization_id' => $customer->organization_id,
                'user_id'         => auth()->id(),
                'subject_type'    => Customer::class,
                'subject_id'      => $customer->id,
                'event'           => 'customer.created',
                'description'     => "Created customer {$customer->name}",
            ]);

            return $customer->load('group');
        });
    }

    public function update(Customer $customer, array $data): Customer
    {
        return DB::transaction(function () use ($customer, $data) {
            $customer->update($data);
            ActivityLog::create([
                'organization_id' => $customer->organization_id,
                'user_id'         => auth()->id(),
                'subject_type'    => Customer::class,
                'subject_id'      => $customer->id,
                'event'           => 'customer.updated',
                'description'     => "Updated customer {$customer->name}",
            ]);
            return $customer->fresh('group');
        });
    }

    public function delete(Customer $customer): void
    {
        // Guard: cannot delete if invoices exist
        if ($customer->invoices()->exists()) {
            abort(422, 'Cannot delete customer with existing invoices');
        }
        $customer->delete();
    }

    private function nextCode(): string
    {
        $last = Customer::orderByDesc('id')->value('code');
        $num = $last ? ((int) preg_replace('/\D/', '', $last)) + 1 : 1;
        return 'CUST-' . str_pad($num, 5, '0', STR_PAD_LEFT);
    }
}

