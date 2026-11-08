"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { inspectionService } from "@/services";

const columns: Column<any>[] = [
  { key: "inspectionNumber", header: "QC #", sortValue: r => r.inspectionNumber, cell: r => <span className="font-medium">{r.inspectionNumber}</span> },
  { key: "item", header: "Item", sortValue: r => r.item, cell: r => r.item },
  { key: "type", header: "Type", cell: r => <span className="capitalize">{r.type?.replace("_", " ")}</span> },
  { key: "inspector", header: "Inspector", cell: r => r.inspector },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => r.date },
  { key: "result", header: "Result", sortValue: r => r.result, cell: r => <Badge tone={r.result === "passed" ? "success" : r.result === "failed" ? "danger" : "warning"}>{r.result}</Badge> },
];

export default function InspectionsPage() {
  return (
    <CrudPage
      title="Quality Inspections"
      description="Quality assurance checks across incoming, WIP, and final stages."
      service={inspectionService as any}
      columns={columns}
      searchKeys={["inspectionNumber", "item", "inspector"]}
      emptyTitle="No inspections recorded"
      createDefault={() => ({
        inspectionNumber: "QC-" + Math.floor(Math.random() * 9000 + 1000),
        item: "",
        type: "incoming",
        inspector: "Sarah Quality",
        date: new Date().toISOString().slice(0, 10),
        result: "passed",
        notes: "",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="QC Number" required><Input value={v.inspectionNumber} onChange={e => set({ ...v, inspectionNumber: e.target.value })} /></Field>
          <Field label="Item Name" required><Input value={v.item} onChange={e => set({ ...v, item: e.target.value })} /></Field>
          <Field label="Stage / Type">
            <Select value={v.type} onChange={e => set({ ...v, type: e.target.value })}>
              <option value="incoming">Incoming Goods</option>
              <option value="in_process">In-Process</option>
              <option value="final">Final Inspection</option>
            </Select>
          </Field>
          <Field label="Inspector" required><Input value={v.inspector} onChange={e => set({ ...v, inspector: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Result">
            <Select value={v.result} onChange={e => set({ ...v, result: e.target.value })}>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Inspection Notes"><Textarea value={v.notes} onChange={e => set({ ...v, notes: e.target.value })} /></Field>
          </div>
        </div>
      )}
    />
  );
}
