"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { contactService } from "@/services/mock/extended";
import type { Column } from "@/components/tables/data-table";

const columns: Column<any>[] = [
  { key: "name", header: "Name", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "email", header: "Email", cell: r => r.email },
  { key: "company", header: "Company", cell: r => r.company },
  { key: "title", header: "Title", cell: r => r.title },
];

export default function ContactsPage() {
  return (
    <CrudPage
      title="Contacts"
      description="Customer contact directory."
      service={contactService as any}
      columns={columns}
      searchKeys={["name", "email", "company"]}
      createDefault={() => ({ name: "", email: "", phone: "", company: "", title: "", customerId: "" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Email"><Input value={v.email} onChange={e => set({ ...v, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={v.phone} onChange={e => set({ ...v, phone: e.target.value })} /></Field>
          <Field label="Company"><Input value={v.company} onChange={e => set({ ...v, company: e.target.value })} /></Field>
          <Field label="Title"><Input value={v.title} onChange={e => set({ ...v, title: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}

