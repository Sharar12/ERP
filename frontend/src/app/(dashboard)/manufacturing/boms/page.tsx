"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { bomService } from "@/services";

const columns: Column<any>[] = [
  { key: "bomNumber", header: "BOM #", sortValue: r => r.bomNumber, cell: r => <span className="font-medium">{r.bomNumber}</span> },
  { key: "productName", header: "Finished Product", sortValue: r => r.productName, cell: r => r.productName },
  { key: "revision", header: "Rev", cell: r => r.revision },
  { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  { key: "components", header: "Components", cell: r => <span className="text-xs text-muted-foreground">{r.components?.length || 0} items</span> },
];

export default function BomsPage() {
  return (
    <CrudPage
      title="Bills of Materials (BOM)"
      description="Manage product recipes, component hierarchies, and revisions."
      service={bomService as any}
      columns={columns}
      searchKeys={["bomNumber", "productName", "revision"]}
      emptyTitle="No BOMs found"
      createDefault={() => ({ bomNumber: "BOM-" + Math.floor(Math.random() * 9000 + 1000), productName: "", revision: "v1.0", status: "active", components: [] })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="BOM Number" required><Input value={v.bomNumber} onChange={e => set({ ...v, bomNumber: e.target.value })} /></Field>
          <Field label="Product Name" required><Input value={v.productName} onChange={e => set({ ...v, productName: e.target.value })} /></Field>
          <Field label="Revision" required><Input value={v.revision} onChange={e => set({ ...v, revision: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
