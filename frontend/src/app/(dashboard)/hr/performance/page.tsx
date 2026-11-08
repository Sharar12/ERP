"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { reviewService } from "@/services/mock/extended";

const columns: Column<any>[] = [
  { key: "name", header: "Employee", cell: r => <span className="font-medium">{r.employeeName}</span> },
  { key: "period", header: "Period", cell: r => r.period },
  { key: "rating", header: "Rating", cell: r => <span className="font-semibold">{r.rating} ★</span> },
  { key: "reviewer", header: "Reviewer", cell: r => r.reviewer },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge> },
];

export default function PerformancePage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { reviewService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Performance Reviews" description="Ratings and evaluation cycles." />
      <DataTable data={rows} columns={columns} searchKeys={["employeeName", "period"]} />
    </div>
  );
}

