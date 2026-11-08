"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { purchaseOrderService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PurchaseOrder } from "@/types";

const columns: Column<PurchaseOrder>[] = [
  { key: "number", header: "PO", sortValue: r => r.number, cell: r => <span className="font-medium">{r.number}</span> },
  { key: "supplier", header: "Supplier", sortValue: r => r.supplierName, cell: r => r.supplierName },
  { key: "date", header: "Date", sortValue: r => r.orderDate, cell: r => formatDate(r.orderDate) },
  { key: "total", header: "Total", sortValue: r => r.total, cell: r => formatCurrency(r.total) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PurchaseOrdersPage() {
  return (
    <CrudPage
      title="Purchase Orders"
      description="Procurement orders and approval status."
      service={purchaseOrderService as any}
      columns={columns}
      searchKeys={["number", "supplierName", "status"]}
      createDefault={() => ({ number: "", supplierId: "", supplierName: "", orderDate: "", total: 0, status: "draft" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="PO #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Supplier"><Input value={v.supplierName} onChange={e => set({ ...v, supplierName: e.target.value })} /></Field>
          <Field label="Order Date"><Input type="date" value={v.orderDate} onChange={e => set({ ...v, orderDate: e.target.value })} /></Field>
          <Field label="Total"><Input type="number" value={v.total} onChange={e => set({ ...v, total: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              {["draft", "pending", "approved", "received", "cancelled"].map(s => <option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
