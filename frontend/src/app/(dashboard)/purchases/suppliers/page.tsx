"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { supplierService } from "@/services";
import type { Supplier } from "@/types";

const columns: Column<Supplier>[] = [
  { key: "name", header: "Supplier", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "contact", header: "Contact", cell: r => r.contactPerson },
  { key: "email", header: "Email", cell: r => r.email },
  { key: "category", header: "Category", cell: r => r.category },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function SuppliersPage() {
  return (
    <CrudPage
      title="Suppliers"
      description="Vendor directory and supply chain relationships."
      service={supplierService as any}
      columns={columns}
      searchKeys={["name", "contactPerson", "email", "category"]}
      createDefault={() => ({ name: "", email: "", phone: "", contactPerson: "", address: "", category: "Raw Materials", status: "active" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Contact Person"><Input value={v.contactPerson} onChange={e => set({ ...v, contactPerson: e.target.value })} /></Field>
          <Field label="Email"><Input value={v.email} onChange={e => set({ ...v, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={v.phone} onChange={e => set({ ...v, phone: e.target.value })} /></Field>
          <Field label="Category"><Input value={v.category} onChange={e => set({ ...v, category: e.target.value })} /></Field>
          <Field label="Address"><Input value={v.address} onChange={e => set({ ...v, address: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}
