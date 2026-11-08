"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { stockTransferService } from "@/services";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "Transfer", cell: r => <span className="font-medium">{r.number}</span> },
  { key: "from", header: "From", cell: r => r.fromWarehouse },
  { key: "to", header: "To", cell: r => r.toWarehouse },
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function TransfersPage() {
  return (
    <CrudPage
      title="Stock Transfers"
      description="Move inventory between warehouses."
      service={stockTransferService as any}
      columns={columns}
      searchKeys={["number", "fromWarehouse", "toWarehouse", "status"]}
      createDefault={() => ({ number: "", fromWarehouse: "wh_001", toWarehouse: "wh_002", date: "", items: 0, status: "in_transit" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Transfer #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="From"><Input value={v.fromWarehouse} onChange={e => set({ ...v, fromWarehouse: e.target.value })} /></Field>
          <Field label="To"><Input value={v.toWarehouse} onChange={e => set({ ...v, toWarehouse: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}

