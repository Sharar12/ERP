"use client";
import { useEffect, useState } from "react";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import type { User } from "@/types";
import { MOCK_ROLES, MOCK_USERS } from "@/mock-data/seed";
import { useRouter } from "next/navigation";

/* MOCK DATA — API REPLACEMENT: GET/POST /api/v1/users */
const users: User[] = [...MOCK_USERS];
const userService = {
  async getAll() { return users.slice(); },
  async create(d: any) { const u: User = { ...d, id: `u_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: d.status ?? "active" }; users.push(u); return u; },
  async update(id: string, d: any) { const i = users.findIndex(u => u.id === id); users[i] = { ...users[i], ...d, updatedAt: new Date().toISOString() }; return users[i]; },
  async delete(id: string) { const i = users.findIndex(u => u.id === id); if (i >= 0) users.splice(i, 1); },
  async getById(id: string) { return users.find(u => u.id === id) ?? null; },
};

const columns: Column<User>[] = [
  { key: "name", header: "Name", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "email", header: "Email", sortValue: r => r.email, cell: r => r.email },
  { key: "role", header: "Role", cell: r => MOCK_ROLES.find(x => x.id === r.roleId)?.name ?? "—" },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function UsersPage() {
  return (
    <CrudPage
      title="Users"
      description="Team members, roles and account status."
      service={userService as any}
      columns={columns}
      searchKeys={["name", "email", "status"]}
      emptyTitle="No users"
      primaryLabel="Invite User"
      createDefault={() => ({ name: "", email: "", roleId: "role_sales", organizationId: "org_001", status: "invited" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Email" required><Input type="email" value={v.email} onChange={e => set({ ...v, email: e.target.value })} /></Field>
          <Field label="Role">
            <Select value={v.roleId} onChange={e => set({ ...v, roleId: e.target.value })}>
              {MOCK_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="invited">Invited</option>
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
