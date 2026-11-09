<?php
namespace App\Policies;

use App\Models\Auth\User;
use App\Models\Crm\Customer;

class CustomerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('crm.view');
    }

    public function view(User $user, Customer $customer): bool
    {
        return $user->organization_id === $customer->organization_id
            && $user->hasPermission('crm.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('crm.create');
    }

    public function update(User $user, Customer $customer): bool
    {
        return $user->organization_id === $customer->organization_id
            && $user->hasPermission('crm.update');
    }

    public function delete(User $user, Customer $customer): bool
    {
        return $user->organization_id === $customer->organization_id
            && $user->hasPermission('crm.delete');
    }
}

