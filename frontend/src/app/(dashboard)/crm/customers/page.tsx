"use client";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, statusTone } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Field } from "@/components/ui/field";
import { DataTable, type Column } from "@/components/tables/data-table";
import { customerService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import type { Customer } from "@/types";
import { useRouter } from "next/navigation";

const groups = ["Retail", "Enterprise", "Manufacturing", "Technology", "Healthcare", "Distribution", "Construction", "Services", "Finance"];

export default function CustomersPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", group: "Retail", status: "active" as Customer["status"], address: "" });

  const load = async () => { setLoading(true); setRows(await customerService.getAll()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", email: "", phone: "", group: "Retail", status: "active", address: "" }); setOpen(true); };
  const openEdit = (c: Customer) => { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone, group: c.group, status: c.status, address: c.address }); setOpen(true); };

  const save = async () => {
    /* MOCK CRUD — Phase 3 replaces with POST / PUT */
    if (editing) await customerService.update(editing.id, form);
    else await customerService.create({ ...form, organizationId: "org_001", ownerId: "u_001", company: form.name, totalRevenue: 0 });
    setOpen(false); load();
  };
  const remove = async (id: string) => { await customerService.delete(id); load(); };

  const columns: Column<Customer>[] = [
    { key: "name", header: "Customer", sortValue: r => r.name, cell: r => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">{r.email}</div>
      </div>
    )},
    { key: "group", header: "Group", sortValue: r => r.group, cell: r => r.group },
    { key: "phone", header: "Phone", cell: r => r.phone },
    { key: "revenue", header: "Revenue", sortValue: r => r.totalRevenue, cell: r => formatCurrency(r.totalRevenue) },
    { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage CRM customer records across your organization."
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Customer</Button>}
      />
      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["name", "email", "group", "status"]}
        emptyTitle={loading ? "Loading…" : "No customers"}
        onRowClick={r => router.push(`/crm/customers/${r.id}`)}
        rowActions={r => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
          </div>
        )}
        bulkActions={(sel, clear) => (
          <Button variant="destructive" size="sm" onClick={async () => {
            for (const s of sel) await customerService.delete(s.id);
            clear(); load();
          }}>Delete selected</Button>
        )}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Customer" : "New Customer"}
        footer={<>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={!form.name || !form.email}>Save</Button>
        </>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" required><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email" required><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Group">
            <Select value={form.group} onChange={e => setForm({ ...form, group: e.target.value })}>
              {groups.map(g => <option key={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Customer["status"] })}>
              <option value="active">Active</option><option value="inactive">Inactive</option><option value="lead">Lead</option>
            </Select>
          </Field>
          <div className="sm:col-span-2"><Field label="Address"><Textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></Field></div>
        </div>
      </Modal>
    </div>
  );
}
