"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { quotationService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "Quote", sortValue: r => r.number, cell: r => <span className="font-medium">{r.number}</span> },
  { key: "customer", header: "Customer", sortValue: r => r.customerName, cell: r => r.customerName },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "total", header: "Total", sortValue: r => r.total, cell: r => formatCurrency(r.total) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function QuotationsPage() {
  return (
    <CrudPage
      title="Quotations"
      description="Customer price quotations."
      service={quotationService as any}
      columns={columns}
      searchKeys={["number", "customerName", "status"]}
      createDefault={() => ({ number: "", customerId: "", customerName: "", date: "", expiry: "", total: 0, status: "draft" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Quote #" required><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Customer"><Input value={v.customerName} onChange={e => set({ ...v, customerName: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Expiry"><Input type="date" value={v.expiry} onChange={e => set({ ...v, expiry: e.target.value })} /></Field>
          <Field label="Total"><Input type="number" value={v.total} onChange={e => set({ ...v, total: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              {["draft", "sent", "accepted", "rejected"].map(s => <option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
      )}
    />
  );
}

