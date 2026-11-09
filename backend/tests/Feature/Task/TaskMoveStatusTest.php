<?php
namespace Tests\Feature\Task;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Task\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskMoveStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_move_shifts_siblings_and_sets_completed_at(): void
    {
        $org = Organization::factory()->create();
        $perm = Permission::firstOrCreate(['slug' => 'tasks.update'], ['name' => 'Update', 'module' => 'tasks', 'group' => 'Tasks']);
        $role = Role::create(['organization_id' => $org->id, 'name' => 'T', 'slug' => 't-' . uniqid()]);
        $role->permissions()->attach($perm->id);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);

        $task = Task::factory()->create([
            'organization_id' => $org->id,
            'status' => 'todo',
            'sort_order' => 0,
        ]);

        // Sibling already in 'done' at position 0
        $sibling = Task::factory()->create([
            'organization_id' => $org->id,
            'status' => 'done',
            'sort_order' => 0,
        ]);

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/v1/tasks/{$task->id}/move-status", [
                'status' => 'done',
                'position' => 0,
            ])->assertOk();

        $task->refresh();
        $sibling->refresh();

        $this->assertEquals('done', $task->status);
        $this->assertEquals(0, $task->sort_order);
        $this->assertNotNull($task->completed_at);
        $this->assertEquals(1, $sibling->sort_order);   // shifted
    }
}

