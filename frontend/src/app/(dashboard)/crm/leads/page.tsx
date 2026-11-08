"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { leadService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import type { Lead } from "@/types";

const columns: Column<Lead>[] = [
  { key: "name", header: "Lead", sortValue: r => r.name, cell: r => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.company}</div></div> },
  { key: "value", header: "Value", sortValue: r => r.value, cell: r => formatCurrency(r.value) },
  { key: "source", header: "Source", cell: r => r.source },
  { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function LeadsPage() {
  return (
    <CrudPage
      title="Leads"
      description="Track opportunities through the sales funnel."
      service={leadService as any}
      columns={columns}
      searchKeys={["name", "company", "email"]}
      emptyTitle="No leads"
      createDefault={() => ({ name: "", company: "", email: "", phone: "", value: 0, status: "new", source: "Website", ownerId: "u_003" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Company"><Input value={v.company} onChange={e => set({ ...v, company: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" value={v.email} onChange={e => set({ ...v, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={v.phone} onChange={e => set({ ...v, phone: e.target.value })} /></Field>
          <Field label="Value"><Input type="number" value={v.value} onChange={e => set({ ...v, value: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              {["new", "contacted", "qualified", "proposal", "won", "lost"].map(s => <option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
      )}
    />
  );
}

