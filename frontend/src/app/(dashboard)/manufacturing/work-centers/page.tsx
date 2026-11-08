"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { workCenterService } from "@/services";

const columns: Column<any>[] = [
  { key: "name", header: "Name", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "code", header: "Code", sortValue: r => r.code, cell: r => r.code },
  { key: "capacity", header: "Capacity (u/day)", sortValue: r => r.capacity, cell: r => `${r.capacity}` },
  { key: "costPerHour", header: "Cost/Hr", sortValue: r => r.costPerHour, cell: r => `$${r.costPerHour}/hr` },
  { key: "efficiency", header: "Efficiency", cell: r => `${r.efficiency ?? 100}%` },
  { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function WorkCentersPage() {
  return (
    <CrudPage
      title="Work Centers"
      description="Manage shop floor assembly stations, machine cells, and work center capacities."
      service={workCenterService as any}
      columns={columns}
      searchKeys={["name", "code"]}
      emptyTitle="No work centers"
      createDefault={() => ({ name: "", code: "WC-0" + Math.floor(Math.random() * 9 + 1), capacity: 100, costPerHour: 50, efficiency: 95, status: "active" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Work Center Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Code" required><Input value={v.code} onChange={e => set({ ...v, code: e.target.value })} /></Field>
          <Field label="Daily Capacity (units)" required><Input type="number" value={v.capacity} onChange={e => set({ ...v, capacity: Number(e.target.value) })} /></Field>
          <Field label="Cost Per Hour ($)" required><Input type="number" value={v.costPerHour} onChange={e => set({ ...v, costPerHour: Number(e.target.value) })} /></Field>
          <Field label="Efficiency %"><Input type="number" value={v.efficiency} onChange={e => set({ ...v, efficiency: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
