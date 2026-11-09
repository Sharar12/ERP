<?php
namespace App\Services\Hr;

use App\Models\Hr\{PayrollRun, PayrollItem, Employee};
use Illuminate\Support\Facades\DB;

class PayrollService
{
    public function generate(string $period): PayrollRun
    {
        return DB::transaction(function () use ($period) {
            $orgId = auth()->user()->organization_id;

            abort_if(
                PayrollRun::where('organization_id', $orgId)->where('period', $period)->exists(),
                422,
                'Payroll already exists for this period'
            );

            $run = PayrollRun::create([
                'organization_id' => $orgId,
                'number'   => 'PR-' . str_replace('-', '', $period),
                'period'   => $period,
                'status'   => 'draft',
            ]);

            $employees = Employee::where('organization_id', $orgId)
                ->where('status', 'active')
                ->get();

            $totalGross = 0; $totalNet = 0;
            foreach ($employees as $employee) {
                [$gross, $deductions, $tax, $net, $breakdown] = $this->calculate($employee, $period);

                PayrollItem::create([
                    'payroll_run_id' => $run->id,
                    'employee_id'    => $employee->id,
                    'base_salary'    => $employee->base_salary,
                    'allowances'     => $gross - $employee->base_salary,
                    'deductions'     => $deductions,
                    'tax'            => $tax,
                    'net_pay'        => $net,
                    'breakdown'      => $breakdown,
                ]);

                $totalGross += $gross;
                $totalNet   += $net;
            }

            $run->update([
                'total_gross' => $totalGross,
                'total_net'   => $totalNet,
            ]);

            return $run->load('items');
        });
    }

    private function calculate(Employee $employee, string $period): array
    {
        $base = (float) $employee->base_salary;
        $allowances = 0; // gross = base + allowances
        
        // Calculate unpaid leave deduction
        $unpaidDays = \App\Models\Hr\Leave::where('employee_id', $employee->id)
            ->where('status', 'approved')
            ->whereHas('leaveType', fn ($q) => $q->where('paid', false))
            ->sum('days');

        $dailyRate = $base / 22;
        $unpaidDeduction = round($dailyRate * $unpaidDays, 2);

        $gross = $base + $allowances;
        $deductions = $unpaidDeduction;
        $tax = 0;
        $net = $gross - $deductions - $tax;

        $breakdown = [
            'unpaid_leave_days' => $unpaidDays,
            'unpaid_leave_deduction' => $unpaidDeduction,
        ];

        return [round($gross, 2), round($deductions, 2), round($tax, 2), round($net, 2), $breakdown];
    }

    private function progressiveTax(float $gross): float
    {
        if ($gross <= 3000)  return $gross * 0.05;
        if ($gross <= 8000)  return 150 + ($gross - 3000) * 0.10;
        if ($gross <= 20000) return 650 + ($gross - 8000) * 0.20;
        return 3050 + ($gross - 20000) * 0.30;
    }
}

