<?php
namespace App\Http\Resources\Crm;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'code'               => $this->code,
            'name'               => $this->name,
            'email'              => $this->email,
            'phone'              => $this->phone,
            'tax_id'             => $this->tax_id,
            'customer_group_id'  => $this->customer_group_id,
            'company_id'         => $this->company_id,
            'billing_address'    => $this->billing_address,
            'shipping_address'   => $this->shipping_address,
            'credit_limit'       => (float) $this->credit_limit,
            'opening_balance'    => (float) $this->opening_balance,
            'status'             => $this->status,
            'tags'               => $this->tags ?? [],
            'group'              => $this->whenLoaded('group', fn () => [
                'id'   => $this->group->id,
                'name' => $this->group->name,
            ]),
            'contacts'           => $this->whenLoaded('contacts', fn () =>
                $this->contacts->map(fn ($c) => [
                    'id'        => $c->id,
                    'firstName' => $c->first_name,
                    'lastName'  => $c->last_name,
                    'email'     => $c->email,
                    'phone'     => $c->phone,
                    'jobTitle'  => $c->job_title,
                    'isPrimary' => $c->is_primary,
                ])
            ),
            'created_at'         => $this->created_at?->toIso8601String(),
            'updated_at'         => $this->updated_at?->toIso8601String(),
        ];
    }
}

