"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { payrollService } from "@/services/mock/extended";
import { formatCurrency } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "period", header: "Period", cell: r => <span className="font-medium">{r.period}</span> },
  { key: "emp", header: "Employees", cell: r => r.employeeCount },
  { key: "gross", header: "Gross", cell: r => formatCurrency(r.gross) },
  { key: "deductions", header: "Deductions", cell: r => formatCurrency(r.deductions) },
  { key: "net", header: "Net", cell: r => <span className="font-semibold">{formatCurrency(r.net)}</span> },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PayrollPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { payrollService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Payroll" description="Monthly payroll processing." />
      <DataTable data={rows} columns={columns} searchKeys={["period", "status"]} />
    </div>
  );
}

