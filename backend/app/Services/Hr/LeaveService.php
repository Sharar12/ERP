<?php
namespace App\Services\Hr;

use App\Models\Hr\Leave;
use App\Models\Auth\User;
use App\Models\System\{ActivityLog, Notification};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LeaveService
{
    public function approve(Leave $leave, User $approver, ?string $note = null): Leave
    {
        abort_unless($leave->status === 'pending', 422, 'Leave already processed');

        return DB::transaction(function () use ($leave, $approver, $note) {
            $leave->update([
                'status'        => 'approved',
                'approved_by'   => $approver->id,
                'approved_at'   => now(),
                'approver_note' => $note,
            ]);

            // Mark attendance rows as 'leave'
            $start = \Carbon\Carbon::parse($leave->start_date);
            $end = \Carbon\Carbon::parse($leave->end_date);
            for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                \App\Models\Hr\Attendance::updateOrCreate(
                    ['employee_id' => $leave->employee_id, 'date' => $d->toDateString()],
                    ['organization_id' => $leave->organization_id, 'status' => 'leave']
                );
            }

            ActivityLog::create([
                'organization_id' => $leave->organization_id,
                'user_id'         => $approver->id,
                'subject_type'    => Leave::class,
                'subject_id'      => $leave->id,
                'event'           => 'leave.approved',
                'description'     => "Leave approved by {$approver->name}",
            ]);

            // Notify employee
            $employeeUser = $leave->employee?->user;
            if ($employeeUser) {
                Notification::create([
                    'organization_id' => $leave->organization_id,
                    'user_id'         => $employeeUser->id,
                    'type'            => 'leave.approved',
                    'title'           => 'Leave request approved',
                    'body'            => "{$start->format('M j')} – {$end->format('M j')}",
                    'link'            => "/hr/leaves/{$leave->id}",
                ]);
            }

            return $leave->fresh('employee', 'leaveType');
        });
    }

    public function reject(Leave $leave, User $approver, ?string $note = null): Leave
    {
        abort_unless($leave->status === 'pending', 422, 'Leave already processed');

        $leave->update([
            'status'        => 'rejected',
            'approved_by'   => $approver->id,
            'approved_at'   => now(),
            'approver_note' => $note,
        ]);

        return $leave->fresh();
    }
}

