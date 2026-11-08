"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

/* MOCK DATA — Purchase returns. API REPLACEMENT: GET /api/v1/purchases/returns */
const rows = [
  { id: "pr_1", number: "PR-2001", supplierName: "Apex Materials", date: "2024-06-05", total: 1200, reason: "Defect", status: "approved" },
  { id: "pr_2", number: "PR-2002", supplierName: "Meridian Components", date: "2024-06-15", total: 840, reason: "Wrong item", status: "pending" },
];
const columns: Column<any>[] = [
  { key: "number", header: "Return", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "supplier", header: "Supplier", cell: r => r.supplierName },
  { key: "date", header: "Date", cell: r => r.date },
  { key: "total", header: "Amount", cell: r => formatCurrency(r.total) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PurchaseReturnsPage() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { setData(rows); }, []);
  return (
    <div>
      <PageHeader title="Purchase Returns" description="Returns to suppliers." />
      <DataTable data={data} columns={columns} searchKeys={["number", "supplierName", "status"]} />
    </div>
  );
}

