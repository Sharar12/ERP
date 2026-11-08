"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { departmentService } from "@/services";
import { formatCurrency } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "name", header: "Department", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "code", header: "Code", sortValue: r => r.code, cell: r => r.code },
  { key: "manager", header: "Manager", cell: r => r.manager },
  { key: "headcount", header: "Headcount", sortValue: r => r.headcount, cell: r => `${r.headcount ?? 0} staff` },
  { key: "budget", header: "Annual Budget", sortValue: r => r.budget, cell: r => formatCurrency(r.budget ?? 0) },
];

export default function DepartmentsPage() {
  return (
    <CrudPage
      title="Departments"
      description="Manage business units, department heads, and cost centers."
      service={departmentService as any}
      columns={columns}
      searchKeys={["name", "code", "manager"]}
      emptyTitle="No departments"
      createDefault={() => ({
        name: "",
        code: "DEPT-" + Math.floor(Math.random() * 90 + 10),
        manager: "",
        headcount: 5,
        budget: 150000,
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Department Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Code" required><Input value={v.code} onChange={e => set({ ...v, code: e.target.value })} /></Field>
          <Field label="Manager Name" required><Input value={v.manager} onChange={e => set({ ...v, manager: e.target.value })} /></Field>
          <Field label="Headcount"><Input type="number" value={v.headcount} onChange={e => set({ ...v, headcount: Number(e.target.value) })} /></Field>
          <Field label="Annual Budget ($)"><Input type="number" value={v.budget} onChange={e => set({ ...v, budget: Number(e.target.value) })} /></Field>
        </div>
      )}
    />
  );
}
