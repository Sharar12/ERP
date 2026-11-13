"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { attendanceService, employeeService } from "@/services";
import { formatDate } from "@/lib/utils";
import type { Employee } from "@/types";

export default function AttendancePage() {
  const [rows, setRows] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    attendanceService.getAll().then(setRows).catch(() => setRows([]));
    employeeService.getAll().then(setEmployees).catch(() => setEmployees([]));
  }, []);

  const columns: Column<any>[] = [
    {
      key: "emp",
      header: "Employee",
      cell: r => {
        const emp = employees.find(e => String(e.id) === String(r.employee_id ?? r.employeeId));
        if (emp) return `${emp.firstName ?? (emp as any).first_name ?? ''} ${emp.lastName ?? (emp as any).last_name ?? ''}`.trim();
        return r.employee?.name ?? (r.employee_id ? `Employee #${r.employee_id}` : "Employee");
      }
    },
    { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
    { key: "clockIn", header: "Clock In", cell: r => r.clockIn ?? r.check_in ?? "—" },
    { key: "clockOut", header: "Clock Out", cell: r => r.clockOut ?? r.check_out ?? "—" },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Attendance" description="Daily check-in records." />
      <DataTable data={rows} columns={columns} searchKeys={["date", "status"]} />
    </div>
  );
}
