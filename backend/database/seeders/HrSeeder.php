<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Hr\{Employee, Attendance, Leave, LeaveType, Shift, PayrollRun, PayrollItem, RecruitmentJob, PerformanceReview};
use Illuminate\Database\Seeder;

class HrSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            // 15 employees
            $employees = Employee::factory()->count(15)->create([
                'organization_id' => $org->id,
                'department_id' => fn () => $org->departments()->inRandomOrder()->value('id'),
            ]);

            // 3 shifts
            $shifts = collect([
                ['Morning', '08:00', '16:00'],
                ['Evening', '16:00', '00:00'],
                ['Night', '00:00', '08:00'],
            ])->map(fn ($s) => Shift::create([
                'organization_id' => $org->id,
                'name' => $s[0],
                'start_time' => $s[1],
                'end_time' => $s[2],
                'break_minutes' => 60,
            ]));

            // 5 attendance records
            foreach ($employees->take(5) as $employee) {
                Attendance::create([
                    'organization_id' => $org->id,
                    'employee_id' => $employee->id,
                    'shift_id' => $shifts->random()->id,
                    'date' => now()->toDateString(),
                    'check_in' => now()->setTime(9, 0),
                    'check_out' => now()->setTime(18, 0),
                    'hours_worked' => 8,
                    'status' => fake()->randomElement(['present', 'present', 'late']),
                ]);
            }

            // 3 leave types
            $leaveTypes = collect(['Annual', 'Sick', 'Unpaid'])->map(fn ($name) => LeaveType::create([
                'organization_id' => $org->id,
                'name' => $name,
                'days_per_year' => $name === 'Annual' ? 20 : 10,
                'paid' => $name !== 'Unpaid',
            ]));

            // 3 leave requests
            foreach ($employees->take(3) as $employee) {
                Leave::create([
                    'organization_id' => $org->id,
                    'employee_id' => $employee->id,
                    'leave_type_id' => $leaveTypes->random()->id,
                    'start_date' => now()->addDays(5),
                    'end_date' => now()->addDays(7),
                    'days' => 3,
                    'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
                ]);
            }

            // 3 payroll runs
            for ($m = 0; $m < 3; $m++) {
                $run = PayrollRun::create([
                    'organization_id' => $org->id,
                    'number' => 'PR-' . now()->subMonths($m)->format('Ym'),
                    'period' => now()->subMonths($m)->format('Y-m'),
                    'status' => 'paid',
                    'total_gross' => 0,
                    'total_net' => 0,
                ]);

                $gross = 0; $net = 0;
                foreach ($employees as $employee) {
                    $base = $employee->base_salary;
                    $tax = round($base * 0.1, 2);
                    $netPay = $base - $tax;
                    PayrollItem::create([
                        'payroll_run_id' => $run->id,
                        'employee_id' => $employee->id,
                        'base_salary' => $base,
                        'tax' => $tax,
                        'net_pay' => $netPay,
                    ]);
                    $gross += $base; $net += $netPay;
                }
                $run->update(['total_gross' => $gross, 'total_net' => $net]);
            }

            // 3 recruitment jobs
            RecruitmentJob::factory()->count(3)->create(['organization_id' => $org->id]);

            // 3 performance reviews
            foreach ($employees->take(3) as $employee) {
                PerformanceReview::create([
                    'organization_id' => $org->id,
                    'employee_id' => $employee->id,
                    'period' => now()->subMonths(3)->format('Y-m'),
                    'overall_rating' => fake()->numberBetween(3, 5),
                    'status' => 'submitted',
                ]);
            }
        }
    }
}
