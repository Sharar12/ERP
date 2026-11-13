"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { employeeService, attendanceService, leaveService, payrollService, jobService } from "@/services";
import { formatCurrency } from "@/lib/utils";

export default function HrDashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => {
    employeeService.getAll().then(setEmployees);
    attendanceService.getAll().then(setAttendance);
    leaveService.getAll().then(setLeaves);
    payrollService.getAll().then(setPayroll);
    jobService.getAll().then(setJobs);
  }, []);
  const latestPayroll = payroll[0];
  return (
    <div>
      <PageHeader title="Human Resources" description="People, attendance and payroll." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Employees</div><div className="mt-1 text-2xl font-semibold">{employees.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Pending Leaves</div><div className="mt-1 text-2xl font-semibold">{leaves.filter(l => l.status === "pending").length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Monthly Payroll</div><div className="mt-1 text-2xl font-semibold">{latestPayroll ? formatCurrency(latestPayroll.net) : "—"}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Open Roles</div><div className="mt-1 text-2xl font-semibold">{jobs.filter(j => j.status === "open").length}</div></CardContent></Card>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/hr/employees", label: "Employees" },
          { href: "/hr/attendance", label: "Attendance" },
          { href: "/hr/leaves", label: "Leave Requests" },
          { href: "/hr/shifts", label: "Shift Management" },
          { href: "/hr/payroll", label: "Payroll" },
          { href: "/hr/recruitment", label: "Recruitment" },
          { href: "/hr/performance", label: "Performance Reviews" },
        ].map(l => <Link key={l.href} href={l.href}><Card className="hover:bg-muted/40"><CardContent><div className="text-sm font-medium">{l.label}</div></CardContent></Card></Link>)}
      </div>
    </div>
  );
}

