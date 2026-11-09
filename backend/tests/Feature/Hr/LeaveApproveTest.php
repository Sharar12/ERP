<?php
namespace Tests\Feature\Hr;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Hr\{Employee, Leave, LeaveType};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaveApproveTest extends TestCase
{
    use RefreshDatabase;

    public function test_approve_marks_attendance_and_notifies(): void
    {
        $org = Organization::factory()->create();
        $perm = Permission::firstOrCreate(['slug' => 'hr.approve'], ['name' => 'Approve', 'module' => 'hr', 'group' => 'HR']);
        $role = Role::create(['organization_id' => $org->id, 'name' => 'HR', 'slug' => 'hr-' . uniqid()]);
        $role->permissions()->attach($perm->id);
        $approver = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $approver->roles()->attach($role->id);

        $empUser = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $employee = Employee::factory()->create(['organization_id' => $org->id, 'user_id' => $empUser->id]);
        $leaveType = LeaveType::create(['organization_id' => $org->id, 'name' => 'Annual', 'paid' => true]);
        $leave = Leave::create([
            'organization_id' => $org->id,
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'start_date' => now()->addDays(2),
            'end_date' => now()->addDays(3),
            'days' => 2,
            'status' => 'pending',
        ]);

        $this->actingAs($approver, 'sanctum')
            ->patchJson("/api/v1/hr/leaves/{$leave->id}/approve", ['note' => 'OK'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('attendance', [
            'employee_id' => $employee->id,
            'date' => now()->addDays(2)->toDateString(),
            'status' => 'leave',
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $empUser->id,
            'type' => 'leave.approved',
        ]);
    }
}

