"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { supplierPaymentService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "Payment", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "supplier", header: "Supplier", cell: r => r.supplierName },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "amount", header: "Amount", sortValue: r => r.amount, cell: r => formatCurrency(r.amount) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function SupplierPaymentsPage() {
  return (
    <CrudPage
      title="Supplier Payments"
      description="Payments made to suppliers."
      service={supplierPaymentService as any}
      columns={columns}
      searchKeys={["number", "supplierName", "method"]}
      createDefault={() => ({ number: "", supplierId: "", supplierName: "", date: "", amount: 0, method: "Wire", status: "completed" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Payment #" required><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Supplier"><Input value={v.supplierName} onChange={e => set({ ...v, supplierName: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Amount"><Input type="number" value={v.amount} onChange={e => set({ ...v, amount: Number(e.target.value) })} /></Field>
        </div>
      )}
    />
  );
}

