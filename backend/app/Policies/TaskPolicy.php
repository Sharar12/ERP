<?php
namespace App\Policies;

use App\Models\Auth\User;
use App\Models\Task\Task;

class TaskPolicy
{
    public function viewAny(User $u): bool { return $u->hasPermission('tasks.view'); }
    public function view(User $u, Task $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('tasks.view'); }
    public function create(User $u): bool { return $u->hasPermission('tasks.create'); }
    public function update(User $u, Task $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('tasks.update'); }
    public function delete(User $u, Task $m): bool { return $u->organization_id === $m->organization_id && $u->hasPermission('tasks.delete'); }
}

