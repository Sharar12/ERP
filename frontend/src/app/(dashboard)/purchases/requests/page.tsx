"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { purchaseRequestService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "Request", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "requestedBy", header: "Requested By", cell: r => r.requestedBy },
  { key: "department", header: "Dept", cell: r => r.department },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "total", header: "Total", sortValue: r => r.total, cell: r => formatCurrency(r.total) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PurchaseRequestsPage() {
  return (
    <CrudPage
      title="Purchase Requests"
      description="Internal requests awaiting approval."
      service={purchaseRequestService as any}
      columns={columns}
      searchKeys={["number", "requestedBy", "department"]}
      createDefault={() => ({ number: "", requestedBy: "", department: "", date: "", items: 0, total: 0, status: "pending" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Request #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Requested By"><Input value={v.requestedBy} onChange={e => set({ ...v, requestedBy: e.target.value })} /></Field>
          <Field label="Department"><Input value={v.department} onChange={e => set({ ...v, department: e.target.value })} /></Field>
          <Field label="Total"><Input type="number" value={v.total} onChange={e => set({ ...v, total: Number(e.target.value) })} /></Field>
        </div>
      )}
    />
  );
}

