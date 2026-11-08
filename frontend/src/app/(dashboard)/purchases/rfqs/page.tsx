"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { rfqService } from "@/services";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "RFQ", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "supplier", header: "Supplier", cell: r => r.supplierName },
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "responses", header: "Responses", cell: r => r.responses },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function RfqsPage() {
  return (
    <CrudPage
      title="RFQs"
      description="Requests for quotation to suppliers."
      service={rfqService as any}
      columns={columns}
      searchKeys={["number", "supplierName", "status"]}
      createDefault={() => ({ number: "", supplierId: "", supplierName: "", date: "", responses: 0, status: "open" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="RFQ #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Supplier"><Input value={v.supplierName} onChange={e => set({ ...v, supplierName: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Responses"><Input type="number" value={v.responses} onChange={e => set({ ...v, responses: Number(e.target.value) })} /></Field>
        </div>
      )}
    />
  );
}

