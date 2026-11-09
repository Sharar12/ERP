<?php

namespace Tests\Feature\Workflows;

use App\Models\Auth\{User, Role, Permission};
use App\Models\Core\Organization;
use App\Models\Hr\{Employee, Attendance, Leave, LeaveType, PayrollRun, PayrollItem};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollMonthEndTest extends TestCase
{
    use RefreshDatabase;

    public function test_month_end_generates_correctly_deduction_adjusted_payroll(): void
    {
        [$user, $org] = $this->bootstrapOrg();

        // Two employees, different salaries
        $alice = Employee::factory()->create([
            'organization_id' => $org->id,
            'base_salary'     => 5000,
            'status'          => 'active',
        ]);
        $bob = Employee::factory()->create([
            'organization_id' => $org->id,
            'base_salary'     => 10000,
            'status'          => 'active',
        ]);

        // Alice: 2 days unpaid leave
        $unpaid = LeaveType::create([
            'organization_id' => $org->id,
            'name'            => 'Unpaid',
            'paid'            => false,
        ]);
        Leave::create([
            'organization_id' => $org->id,
            'employee_id'     => $alice->id,
            'leave_type_id'   => $unpaid->id,
            'start_date'      => now()->startOfMonth()->addDays(10),
            'end_date'        => now()->startOfMonth()->addDays(11),
            'days'            => 2,
            'status'          => 'approved',
        ]);

        // Attendance: Alice worked 18 days (20 weekdays - 2 leave), Bob worked 20
        for ($i = 0; $i < 20; $i++) {
            $day = now()->startOfMonth()->addDays($i);
            if ($day->isWeekend()) continue;

            if ($i >= 10 && $i <= 11) {
                Attendance::create([
                    'organization_id' => $org->id,
                    'employee_id'     => $alice->id,
                    'date'            => $day->toDateString(),
                    'status'          => 'leave',
                ]);
            } else {
                Attendance::create([
                    'organization_id' => $org->id,
                    'employee_id'     => $alice->id,
                    'date'            => $day->toDateString(),
                    'check_in'        => $day->copy()->setTime(9, 0),
                    'check_out'       => $day->copy()->setTime(18, 0),
                    'hours_worked'    => 8,
                    'status'          => 'present',
                ]);
            }
            Attendance::create([
                'organization_id' => $org->id,
                'employee_id'     => $bob->id,
                'date'            => $day->toDateString(),
                'check_in'        => $day->copy()->setTime(9, 0),
                'check_out'       => $day->copy()->setTime(18, 0),
                'hours_worked'    => 8,
                'status'          => 'present',
            ]);
        }

        // ── Generate payroll ──────────────────────────────────
        $period = now()->format('Y-m');
        $run = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/hr/payroll/generate', ['period' => $period])
            ->assertCreated()
            ->json('data');

        $this->assertNotEmpty($run['items']);
        $this->assertEquals(2, count($run['items']));

        // ── Verify Alice has 2-day unpaid deduction ────────────
        $aliceItem = PayrollItem::where('payroll_run_id', $run['id'])
            ->where('employee_id', $alice->id)
            ->firstOrFail();

        $dailyRate = 5000 / 22;
        $expectedDeduction = round($dailyRate * 2, 2);
        $this->assertEqualsWithDelta($expectedDeduction, (float) $aliceItem->unpaid_leave_deduction, 0.5,
            'Alice should have 2-day unpaid leave deduction');

        // ── Verify totals sum correctly ───────────────────────
        $items = PayrollItem::where('payroll_run_id', $run['id'])->get();
        $computedGross = $items->sum('base_salary') + $items->sum('allowances');
        $computedNet = $items->sum('net_pay');

        $this->assertEqualsWithDelta($computedGross, (float) $run['total_gross'], 0.01);
        $this->assertEqualsWithDelta($computedNet, (float) $run['total_net'], 0.01);

        // ── Approve → pay ─────────────────────────────────────
        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/hr/payroll/{$run['id']}/approve")
            ->assertOk();
        $this->assertEquals('approved', PayrollRun::find($run['id'])->status);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/hr/payroll/{$run['id']}/pay", [
                'payment_date' => now()->toDateString(),
            ])->assertOk();
        $this->assertEquals('paid', PayrollRun::find($run['id'])->status);

        // ── Duplicate generation blocked ──────────────────────
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/hr/payroll/generate', ['period' => $period])
            ->assertStatus(422);
    }

    private function bootstrapOrg(): array
    {
        $org = Organization::factory()->create();
        $perms = collect(['hr.view', 'hr.create', 'hr.update', 'hr.approve'])
            ->map(fn ($s) => Permission::firstOrCreate(
                ['slug' => $s], ['name' => $s, 'module' => 'hr']
            ));
        $role = Role::create(['organization_id' => $org->id, 'name' => 'HR Mgr', 'slug' => 'hr-' . uniqid()]);
        $role->permissions()->attach($perms->pluck('id'));
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);
        return [$user, $org];
    }
}

