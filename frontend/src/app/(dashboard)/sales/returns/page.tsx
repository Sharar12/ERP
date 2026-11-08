"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { salesReturnService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "Return #", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "customer", header: "Customer", cell: r => r.customerName },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "total", header: "Amount", sortValue: r => r.total, cell: r => formatCurrency(r.total) },
  { key: "reason", header: "Reason", cell: r => r.reason },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function SalesReturnsPage() {
  return (
    <CrudPage
      title="Sales Returns"
      description="Customer returns and refunds."
      service={salesReturnService as any}
      columns={columns}
      searchKeys={["number", "customerName", "reason"]}
      createDefault={() => ({ number: "", customerId: "", customerName: "", date: "", total: 0, reason: "", status: "pending" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Return #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Customer"><Input value={v.customerName} onChange={e => set({ ...v, customerName: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Amount"><Input type="number" value={v.total} onChange={e => set({ ...v, total: Number(e.target.value) })} /></Field>
          <Field label="Reason"><Input value={v.reason} onChange={e => set({ ...v, reason: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}

