"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { customerPaymentService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "Payment", sortValue: r => r.number, cell: r => <span className="font-medium">{r.number}</span> },
  { key: "customer", header: "Customer", cell: r => r.customerName },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "amount", header: "Amount", sortValue: r => r.amount, cell: r => formatCurrency(r.amount) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function CustomerPaymentsPage() {
  return (
    <CrudPage
      title="Customer Payments"
      description="Payments received from customers."
      service={customerPaymentService as any}
      columns={columns}
      searchKeys={["number", "customerName", "method"]}
      createDefault={() => ({ number: "", customerId: "", customerName: "", invoiceNumber: "", date: "", amount: 0, method: "Bank Transfer", status: "completed" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Payment #" required><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Customer"><Input value={v.customerName} onChange={e => set({ ...v, customerName: e.target.value })} /></Field>
          <Field label="Invoice #"><Input value={v.invoiceNumber} onChange={e => set({ ...v, invoiceNumber: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Amount"><Input type="number" value={v.amount} onChange={e => set({ ...v, amount: Number(e.target.value) })} /></Field>
          <Field label="Method"><Input value={v.method} onChange={e => set({ ...v, method: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}

