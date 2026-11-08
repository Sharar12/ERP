"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { warehouseService } from "@/services";
import type { Warehouse } from "@/types";

const columns: Column<Warehouse>[] = [
  { key: "name", header: "Warehouse", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "code", header: "Code", cell: r => r.code },
  { key: "location", header: "Location", cell: r => r.location },
  { key: "utilization", header: "Utilization", sortValue: r => r.utilization, cell: r => `${r.utilization}%` },
];

export default function WarehousesPage() {
  return (
    <CrudPage
      title="Warehouses"
      description="Storage facilities."
      service={warehouseService as any}
      columns={columns}
      searchKeys={["name", "code", "location"]}
      createDefault={() => ({ name: "", code: "", location: "", managerId: "u_002", capacity: 0, utilization: 0 })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Code"><Input value={v.code} onChange={e => set({ ...v, code: e.target.value })} /></Field>
          <Field label="Location"><Input value={v.location} onChange={e => set({ ...v, location: e.target.value })} /></Field>
          <Field label="Capacity"><Input type="number" value={v.capacity} onChange={e => set({ ...v, capacity: Number(e.target.value) })} /></Field>
        </div>
      )}
    />
  );
}

