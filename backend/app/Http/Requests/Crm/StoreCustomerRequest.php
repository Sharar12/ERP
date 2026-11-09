<?php
namespace App\Http\Requests\Crm;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $orgId = auth()->user()?->organization_id;

        return [
            'name'              => ['required', 'string', 'max:255'],
            'code'              => ['nullable', 'string', 'max:30'],
            'email'             => ['nullable', 'email', 'unique:customers,email,NULL,id,organization_id,' . $orgId],
            'phone'             => ['nullable', 'string', 'max:30'],
            'tax_id'            => ['nullable', 'string', 'max:50'],
            'customer_group_id' => ['nullable', 'exists:customer_groups,id'],
            'company_id'        => ['nullable', 'exists:companies,id'],
            'billing_address'   => ['nullable', 'string'],
            'shipping_address'  => ['nullable', 'string'],
            'credit_limit'      => ['nullable', 'numeric', 'min:0'],
            'status'            => ['nullable', 'in:active,inactive,blocked'],
            'tags'              => ['nullable', 'array'],
        ];
    }
}

