"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { attendanceService } from "@/services/mock/extended";
import { MOCK_EMPLOYEES } from "@/mock-data/seed";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "emp", header: "Employee", cell: r => MOCK_EMPLOYEES.find(e => e.id === r.employeeId)?.firstName + " " + MOCK_EMPLOYEES.find(e => e.id === r.employeeId)?.lastName },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "clockIn", header: "Clock In", cell: r => r.clockIn || "—" },
  { key: "clockOut", header: "Clock Out", cell: r => r.clockOut || "—" },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function AttendancePage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { attendanceService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Attendance" description="Daily check-in records." />
      <DataTable data={rows} columns={columns} searchKeys={["date", "status"]} />
    </div>
  );
}

