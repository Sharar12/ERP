"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { stockAdjustmentService } from "@/services";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "Adjustment", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "product", header: "Product", cell: r => r.productName },
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "delta", header: "Delta", cell: r => <span className={r.delta > 0 ? "text-success" : "text-destructive"}>{r.delta > 0 ? "+" : ""}{r.delta}</span> },
  { key: "reason", header: "Reason", cell: r => r.reason },
];

export default function AdjustmentsPage() {
  return (
    <CrudPage
      title="Stock Adjustments"
      description="Manual corrections to inventory."
      service={stockAdjustmentService as any}
      columns={columns}
      searchKeys={["number", "productName", "reason"]}
      createDefault={() => ({ number: "", productId: "", productName: "", date: "", delta: 0, reason: "" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Adjustment #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Product"><Input value={v.productName} onChange={e => set({ ...v, productName: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Delta"><Input type="number" value={v.delta} onChange={e => set({ ...v, delta: Number(e.target.value) })} /></Field>
          <Field label="Reason"><Input value={v.reason} onChange={e => set({ ...v, reason: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}

