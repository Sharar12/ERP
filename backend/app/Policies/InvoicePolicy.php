<?php
namespace App\Policies;

use App\Models\Auth\User;
use App\Models\Sales\Invoice;

class InvoicePolicy
{
    public function viewAny(User $u): bool { return $u->hasPermission('sales.view'); }
    public function view(User $u, Invoice $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('sales.view'); }
    public function create(User $u): bool { return $u->hasPermission('sales.create'); }
    public function update(User $u, Invoice $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('sales.update'); }
    public function delete(User $u, Invoice $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('sales.delete'); }
}

