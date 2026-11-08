"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { purchaseOrderService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PurchaseOrder } from "@/types";

const columns: Column<PurchaseOrder>[] = [
  { key: "number", header: "PO", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "supplier", header: "Supplier", cell: r => r.supplierName },
  { key: "date", header: "Date", cell: r => formatDate(r.orderDate) },
  { key: "total", header: "Total", cell: r => formatCurrency(r.total) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PayablesPage() {
  const [rows, setRows] = useState<PurchaseOrder[]>([]);
  useEffect(() => { purchaseOrderService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Accounts Payable" description="Outstanding supplier obligations." />
      <DataTable data={rows} columns={columns} searchKeys={["number", "supplierName"]} />
    </div>
  );
}

