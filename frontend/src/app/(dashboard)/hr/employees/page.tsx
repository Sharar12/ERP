"use client";
import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge, statusTone } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Field } from "@/components/ui/field";
import { DataTable, type Column } from "@/components/tables/data-table";
import { employeeService } from "@/services";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import type { Employee } from "@/types";
import { useRouter } from "next/navigation";

export default function EmployeesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", department: "Engineering", designation: "", salary: 0, status: "active" as Employee["status"] });

  const load = async () => setRows(await employeeService.getAll());
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ firstName: "", lastName: "", email: "", phone: "", department: "Engineering", designation: "", salary: 0, status: "active" }); setOpen(true); };
  const openEdit = (e: Employee) => { setEditing(e); setForm({ ...e }); setOpen(true); };

  const save = async () => {
    if (editing) await employeeService.update(editing.id, form);
    else await employeeService.create({ ...form, employeeId: `EMP-${Date.now().toString().slice(-4)}`, joinDate: new Date().toISOString().slice(0, 10) });
    setOpen(false); load();
  };

  const columns: Column<Employee>[] = [
    { key: "name", header: "Employee", sortValue: r => `${r.firstName} ${r.lastName}`, cell: r => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
          {initials(`${r.firstName} ${r.lastName}`)}
        </div>
        <div>
          <div className="font-medium">{r.firstName} {r.lastName}</div>
          <div className="text-xs text-muted-foreground">{r.employeeId}</div>
        </div>
      </div>
    )},
    { key: "dept", header: "Department", sortValue: r => r.department, cell: r => r.department },
    { key: "desig", header: "Designation", sortValue: r => r.designation, cell: r => r.designation },
    { key: "join", header: "Joined", sortValue: r => r.joinDate, cell: r => formatDate(r.joinDate) },
    { key: "salary", header: "Salary", sortValue: r => r.salary, cell: r => formatCurrency(r.salary) },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Employees" description="Directory, roles and employment details."
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Employee</Button>} />
      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["firstName", "lastName", "email", "department"]}
        onRowClick={r => router.push(`/hr/employees/${r.id}`)}
        rowActions={r => <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Employee" : "New Employee"}
        footer={<>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={!form.firstName || !form.lastName || !form.email}>Save</Button>
        </>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="First Name" required><Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} /></Field>
          <Field label="Last Name" required><Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} /></Field>
          <Field label="Email" required><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Department"><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></Field>
          <Field label="Designation"><Input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} /></Field>
          <Field label="Salary"><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Employee["status"] })}>
              <option value="active">Active</option><option value="on_leave">On Leave</option><option value="terminated">Terminated</option>
            </Select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
