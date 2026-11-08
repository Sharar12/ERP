"use client";
import { useEffect, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Modal } from "@/components/ui/modal";
import { invoiceService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types";

export default function InvoicesPage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [detail, setDetail] = useState<Invoice | null>(null);

  useEffect(() => { invoiceService.getAll().then(setRows); }, []);

  const columns: Column<Invoice>[] = [
    { key: "number", header: "Invoice", sortValue: r => r.number, cell: r => <span className="font-medium">{r.number}</span> },
    { key: "customer", header: "Customer", sortValue: r => r.customerName, cell: r => r.customerName },
    { key: "issue", header: "Issued", sortValue: r => r.issueDate, cell: r => formatDate(r.issueDate) },
    { key: "due", header: "Due", sortValue: r => r.dueDate, cell: r => formatDate(r.dueDate) },
    { key: "total", header: "Total", sortValue: r => r.total, cell: r => formatCurrency(r.total) },
    { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Invoices" description="Sales invoices, status tracking and payment progress."
        actions={<Button><Plus className="h-4 w-4" /> New Invoice</Button>} />
      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["number", "customerName", "status"]}
        rowActions={r => <Button variant="ghost" size="icon" onClick={() => setDetail(r)}><Eye className="h-3.5 w-3.5" /></Button>}
        emptyTitle="No invoices"
      />
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.number ?? ""} size="md">
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Customer</span><span className="font-medium">{detail.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span><Badge tone={statusTone(detail.status)}>{detail.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Issued</span><span>{formatDate(detail.issueDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Due</span><span>{formatDate(detail.dueDate)}</span>
            </div>
            <hr className="border-border" />
            <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatCurrency(detail.subtotal)}</span></div>
            <div className="flex items-center justify-between"><span>Tax</span><span>{formatCurrency(detail.tax)}</span></div>
            <div className="flex items-center justify-between font-semibold"><span>Total</span><span>{formatCurrency(detail.total)}</span></div>
            <div className="flex items-center justify-between text-success"><span>Paid</span><span>{formatCurrency(detail.amountPaid)}</span></div>
            <div className="flex items-center justify-between font-semibold text-destructive"><span>Balance</span><span>{formatCurrency(detail.total - detail.amountPaid)}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

