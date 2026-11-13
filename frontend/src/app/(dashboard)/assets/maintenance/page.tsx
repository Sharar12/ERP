"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { assetMaintenanceService } from "@/services";

const columns: Column<any>[] = [
  { key: "assetTag", header: "Asset", sortValue: r => r.asset?.name ?? r.asset?.asset_tag ?? r.assetTag, cell: r => <span className="font-medium">{r.asset?.name ?? r.asset?.asset_tag ?? r.assetTag ?? `Asset #${r.asset_id ?? "—"}`}</span> },
  { key: "title", header: "Maintenance Task", sortValue: r => r.description ?? r.title, cell: r => r.description ?? r.title ?? "—" },
  { key: "type", header: "Type", cell: r => <span className="capitalize">{r.type ?? "—"}</span> },
  { key: "scheduledDate", header: "Date", sortValue: r => r.date ?? r.scheduledDate, cell: r => r.date ?? r.scheduledDate ?? "—" },
  { key: "technician", header: "Technician", cell: r => r.performer?.name ?? r.technician ?? "—" },
  { key: "status", header: "Status", sortValue: r => r.status ?? "completed", cell: r => {
    const s = r.status || "completed";
    return <Badge tone={statusTone(s)}>{s.replace("_", " ")}</Badge>;
  }},
];

export default function AssetMaintenancePage() {
  return (
    <CrudPage
      title="Asset Maintenance"
      description="Preventative schedules, calibration cycles, and repair work."
      service={assetMaintenanceService as any}
      columns={columns}
      searchKeys={["assetTag", "title", "technician"]}
      emptyTitle="No maintenance records"
      createDefault={() => ({
        assetTag: "AST-001",
        title: "",
        type: "preventive",
        scheduledDate: new Date().toISOString().slice(0, 10),
        technician: "Internal Tech",
        status: "scheduled",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Asset Tag" required><Input value={v.assetTag} onChange={e => set({ ...v, assetTag: e.target.value })} /></Field>
          <Field label="Task Description" required><Input value={v.title} onChange={e => set({ ...v, title: e.target.value })} /></Field>
          <Field label="Type">
            <Select value={v.type} onChange={e => set({ ...v, type: e.target.value })}>
              <option value="preventive">Preventive</option>
              <option value="corrective">Corrective</option>
              <option value="inspection">Inspection</option>
            </Select>
          </Field>
          <Field label="Scheduled Date"><Input type="date" value={v.scheduledDate} onChange={e => set({ ...v, scheduledDate: e.target.value })} /></Field>
          <Field label="Technician" required><Input value={v.technician} onChange={e => set({ ...v, technician: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
