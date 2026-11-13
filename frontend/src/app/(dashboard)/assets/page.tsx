"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { assetService } from "@/services";
import { formatCurrency } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "assetTag", header: "Asset Tag", sortValue: r => r.assetTag, cell: r => <span className="font-medium">{r.assetTag}</span> },
  { key: "name", header: "Asset Name", sortValue: r => r.name, cell: r => r.name },
  { key: "category", header: "Category", sortValue: r => r.category, cell: r => r.category },
  { key: "purchaseCost", header: "Cost", sortValue: r => r.purchaseCost, cell: r => formatCurrency(r.purchaseCost) },
  { key: "location", header: "Location", cell: r => r.location },
  { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{(r.status || "active").replace("_", " ")}</Badge> },
];

export default function AssetsPage() {
  return (
    <CrudPage
      title="Asset Register"
      description="Track capital assets, IT equipment, tooling, and machinery."
      service={assetService as any}
      columns={columns}
      searchKeys={["assetTag", "name", "category", "location"]}
      emptyTitle="No assets"
      createDefault={() => ({
        assetTag: "AST-" + Math.floor(Math.random() * 9000 + 1000),
        name: "",
        category: "Hardware",
        purchaseCost: 1500,
        location: "Headquarters",
        status: "in_use",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Asset Tag" required><Input value={v.assetTag} onChange={e => set({ ...v, assetTag: e.target.value })} /></Field>
          <Field label="Asset Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Category">
            <Select value={v.category} onChange={e => set({ ...v, category: e.target.value })}>
              <option value="Hardware">Hardware</option>
              <option value="Machinery">Machinery</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Office Equipment">Office Equipment</option>
            </Select>
          </Field>
          <Field label="Purchase Cost ($)" required><Input type="number" value={v.purchaseCost} onChange={e => set({ ...v, purchaseCost: Number(e.target.value) })} /></Field>
          <Field label="Location" required><Input value={v.location} onChange={e => set({ ...v, location: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
