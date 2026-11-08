"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { mfgOrderService } from "@/services";

const columns: Column<any>[] = [
  { key: "orderNumber", header: "MO #", sortValue: r => r.orderNumber, cell: r => <span className="font-medium">{r.orderNumber}</span> },
  { key: "productName", header: "Product", sortValue: r => r.productName, cell: r => r.productName },
  { key: "quantity", header: "Target Qty", sortValue: r => r.quantity, cell: r => `${r.quantity} pcs` },
  { key: "producedQty", header: "Produced", cell: r => `${r.producedQty ?? 0} pcs` },
  { key: "workCenter", header: "Work Center", cell: r => r.workCenter },
  { key: "startDate", header: "Start Date", cell: r => r.startDate },
  { key: "dueDate", header: "Due Date", cell: r => r.dueDate },
  { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge> },
];

export default function ManufacturingOrdersPage() {
  return (
    <CrudPage
      title="Manufacturing Orders"
      description="Track production schedules, work orders, and manufacturing output."
      service={mfgOrderService as any}
      columns={columns}
      searchKeys={["orderNumber", "productName", "workCenter"]}
      emptyTitle="No work orders"
      createDefault={() => ({
        orderNumber: "MO-" + Math.floor(Math.random() * 9000 + 1000),
        productName: "",
        quantity: 100,
        producedQty: 0,
        workCenter: "Line 1 - SMT",
        startDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        status: "planned",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Order Number" required><Input value={v.orderNumber} onChange={e => set({ ...v, orderNumber: e.target.value })} /></Field>
          <Field label="Product Name" required><Input value={v.productName} onChange={e => set({ ...v, productName: e.target.value })} /></Field>
          <Field label="Target Quantity" required><Input type="number" value={v.quantity} onChange={e => set({ ...v, quantity: Number(e.target.value) })} /></Field>
          <Field label="Produced Quantity"><Input type="number" value={v.producedQty} onChange={e => set({ ...v, producedQty: Number(e.target.value) })} /></Field>
          <Field label="Work Center"><Input value={v.workCenter} onChange={e => set({ ...v, workCenter: e.target.value })} /></Field>
          <Field label="Start Date"><Input type="date" value={v.startDate} onChange={e => set({ ...v, startDate: e.target.value })} /></Field>
          <Field label="Due Date"><Input type="date" value={v.dueDate} onChange={e => set({ ...v, dueDate: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
