"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { invoiceService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types";

const columns: Column<Invoice>[] = [
  { key: "number", header: "Invoice", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "customer", header: "Customer", cell: r => r.customerName },
  { key: "due", header: "Due", cell: r => formatDate(r.dueDate) },
  { key: "total", header: "Total", cell: r => formatCurrency(r.total) },
  { key: "balance", header: "Balance", cell: r => formatCurrency(r.total - r.amountPaid) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function ReceivablesPage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  useEffect(() => { invoiceService.getAll().then(all => setRows(all.filter(i => i.status !== "paid" && i.status !== "draft"))); }, []);
  return (
    <div>
      <PageHeader title="Accounts Receivable" description="Outstanding customer invoices." />
      <DataTable data={rows} columns={columns} searchKeys={["number", "customerName"]} />
    </div>
  );
}

