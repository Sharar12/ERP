"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { locationService } from "@/services";

const columns: Column<any>[] = [
  { key: "name", header: "Location Name", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "type", header: "Type", cell: r => r.type },
  { key: "city", header: "City", sortValue: r => r.city, cell: r => r.city },
  { key: "country", header: "Country", sortValue: r => r.country, cell: r => r.country },
  { key: "address", header: "Address", cell: r => <span className="text-muted-foreground">{r.address}</span> },
];

export default function LocationsPage() {
  return (
    <CrudPage
      title="Company Locations"
      description="Branch offices, distribution warehouses, manufacturing plants, and sites."
      service={locationService as any}
      columns={columns}
      searchKeys={["name", "city", "country", "type"]}
      emptyTitle="No locations"
      createDefault={() => ({
        name: "",
        type: "Branch Office",
        address: "",
        city: "",
        country: "USA",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Location Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Type">
            <Select value={v.type} onChange={e => set({ ...v, type: e.target.value })}>
              <option value="Headquarters">Headquarters</option>
              <option value="Branch Office">Branch Office</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Factory">Factory</option>
            </Select>
          </Field>
          <Field label="City" required><Input value={v.city} onChange={e => set({ ...v, city: e.target.value })} /></Field>
          <Field label="Country" required><Input value={v.country} onChange={e => set({ ...v, country: e.target.value })} /></Field>
          <div className="sm:col-span-2">
            <Field label="Full Address" required><Input value={v.address} onChange={e => set({ ...v, address: e.target.value })} /></Field>
          </div>
        </div>
      )}
    />
  );
}
