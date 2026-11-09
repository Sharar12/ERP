<?php
namespace App\Policies;

use App\Models\Auth\User;
use App\Models\Hr\Leave;

class LeavePolicy
{
    public function viewAny(User $u): bool { return $u->hasPermission('hr.view'); }
    public function view(User $u, Leave $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('hr.view'); }
    public function create(User $u): bool { return $u->hasPermission('hr.create'); }
    public function update(User $u, Leave $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('hr.update'); }
    public function delete(User $u, Leave $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('hr.delete'); }
    public function approve(User $u, Leave $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('hr.approve'); }
}

