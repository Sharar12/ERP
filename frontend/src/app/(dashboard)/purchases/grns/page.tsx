"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { grnService } from "@/services";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "GRN", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "supplier", header: "Supplier", cell: r => r.supplierName },
  { key: "po", header: "PO", cell: r => r.poNumber },
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "received", header: "Received", cell: r => <Badge tone={r.received ? "success" : "warning"}>{r.received ? "yes" : "pending"}</Badge> },
];

export default function GrnsPage() {
  return (
    <CrudPage
      title="Goods Received Notes"
      description="Confirm receipt of supplier shipments."
      service={grnService as any}
      columns={columns}
      searchKeys={["number", "supplierName", "poNumber"]}
      createDefault={() => ({ number: "", supplierId: "", supplierName: "", date: "", poNumber: "", items: 0, received: false })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="GRN #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Supplier"><Input value={v.supplierName} onChange={e => set({ ...v, supplierName: e.target.value })} /></Field>
          <Field label="PO #"><Input value={v.poNumber} onChange={e => set({ ...v, poNumber: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}

