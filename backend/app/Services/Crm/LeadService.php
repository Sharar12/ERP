<?php
namespace App\Services\Crm;

use App\Models\Crm\{Lead, Customer, Contact};
use Illuminate\Support\Facades\DB;

class LeadService
{
    public function convert(Lead $lead): Customer
    {
        abort_if($lead->converted_customer_id, 422, 'Already converted');

        return DB::transaction(function () use ($lead) {
            $customer = Customer::create([
                'organization_id' => $lead->organization_id,
                'branch_id'       => $lead->branch_id,
                'code'            => 'CUST-' . strtoupper(\Str::random(6)),
                'name'            => $lead->company_name ?? $lead->name,
                'email'           => $lead->email,
                'phone'           => $lead->phone,
                'status'          => 'active',
            ]);

            if ($lead->name) {
                Contact::create([
                    'organization_id' => $lead->organization_id,
                    'customer_id'     => $customer->id,
                    'first_name'      => explode(' ', $lead->name)[0],
                    'last_name'       => explode(' ', $lead->name, 2)[1] ?? null,
                    'email'           => $lead->email,
                    'phone'           => $lead->phone,
                    'is_primary'      => true,
                ]);
            }

            $lead->update([
                'status'                => 'won',
                'converted_customer_id' => $customer->id,
                'converted_at'          => now(),
            ]);

            \App\Models\System\ActivityLog::create([
                'organization_id' => $lead->organization_id,
                'user_id' => auth()->id(),
                'event' => 'lead.converted',
                'subject_type' => Lead::class,
                'subject_id' => $lead->id,
                'description' => "Lead converted to customer",
            ]);

            return $customer;
        });
    }
}

