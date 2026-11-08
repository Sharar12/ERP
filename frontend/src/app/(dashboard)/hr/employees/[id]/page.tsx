"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Badge, statusTone } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { employeeService } from "@/services";
import { attendanceService, leaveService } from "@/services/mock/extended";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import type { Employee } from "@/types";

const attCols: Column<any>[] = [
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "clockIn", header: "In", cell: r => r.clockIn || "—" },
  { key: "clockOut", header: "Out", cell: r => r.clockOut || "—" },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];
const lvCols: Column<any>[] = [
  { key: "type", header: "Type", cell: r => r.type },
  { key: "from", header: "From", cell: r => formatDate(r.from) },
  { key: "to", header: "To", cell: r => formatDate(r.to) },
  { key: "days", header: "Days", cell: r => r.days },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function EmployeeDetail() {
  const params = useParams();
  const [emp, setEmp] = useState<Employee | null>(null);
  const [att, setAtt] = useState<any[]>([]);
  const [lv, setLv] = useState<any[]>([]);

  useEffect(() => {
    employeeService.getById(params.id as string).then(setEmp);
    attendanceService.getAll().then(a => setAtt(a.filter((x: any) => x.employeeId === params.id)));
    leaveService.getAll().then(l => setLv(l.filter((x: any) => x.employeeId === params.id)));
  }, [params.id]);

  if (!emp) return null;

  return (
    <div>
      <PageHeader title={`${emp.firstName} ${emp.lastName}`} description={emp.designation}
        actions={<Badge tone={statusTone(emp.status)}>{emp.status}</Badge>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Personal</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-lg font-medium text-accent">{initials(`${emp.firstName} ${emp.lastName}`)}</div>
              <div><div className="font-medium">{emp.employeeId}</div><div className="text-xs text-muted-foreground">{emp.email}</div></div>
            </div>
            <Row k="Department" v={emp.department} />
            <Row k="Designation" v={emp.designation} />
            <Row k="Phone" v={emp.phone} />
            <Row k="Joined" v={formatDate(emp.joinDate)} />
            <Row k="Salary" v={formatCurrency(emp.salary)} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <Tabs tabs={[
            { key: "att", label: `Attendance (${att.length})`, content: <DataTable data={att} columns={attCols} searchKeys={["date", "status"]} /> },
            { key: "lv", label: `Leaves (${lv.length})`, content: <DataTable data={lv} columns={lvCols} searchKeys={["type", "status"]} /> },
            { key: "docs", label: "Documents", content: <Card><CardContent><p className="text-sm text-muted-foreground">Contract, ID, tax forms accessible here.</p></CardContent></Card> },
          ]} />
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b border-border py-1.5 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

