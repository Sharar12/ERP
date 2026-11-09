<?php
namespace App\Policies;

use App\Models\Auth\User;
use App\Models\Purchase\PurchaseOrder;

class PurchaseOrderPolicy
{
    public function viewAny(User $u): bool
    {
        return $u->hasPermission('purchases.view');
    }

    public function view(User $u, PurchaseOrder $m): bool
    {
        return $u->organization_id === $m->organization_id && $u->hasPermission('purchases.view');
    }

    public function create(User $u): bool
    {
        return $u->hasPermission('purchases.create');
    }

    public function update(User $u, PurchaseOrder $m): bool
    {
        return $u->organization_id === $m->organization_id && $u->hasPermission('purchases.update');
    }

    public function delete(User $u, PurchaseOrder $m): bool
    {
        return $u->organization_id === $m->organization_id && $u->hasPermission('purchases.delete');
    }

    public function approve(User $u, PurchaseOrder $m): bool
    {
        return $u->organization_id === $m->organization_id && $u->hasPermission('purchases.approve');
    }
}

