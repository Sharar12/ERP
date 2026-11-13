"use client";
import { useEffect, useState } from "react";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import type { User, Role } from "@/types";
import { userService, roleService } from "@/services";

export default function UsersPage() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    roleService.getAll().then(setRoles).catch(() => setRoles([]));
  }, []);

  const columns: Column<User>[] = [
    { key: "name", header: "Name", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
    { key: "email", header: "Email", sortValue: r => r.email, cell: r => r.email },
    {
      key: "role",
      header: "Role",
      cell: r => {
        const found = roles.find(x => String(x.id) === String((r as any).roleId ?? (r as any).role_id));
        return found?.name ?? (r as any).roles?.[0]?.name ?? (r as any).role ?? "—";
      }
    },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ];

  return (
    <CrudPage
      title="Users"
      description="Team members, roles and account status."
      service={userService as any}
      columns={columns}
      searchKeys={["name", "email", "status"]}
      emptyTitle="No users"
      primaryLabel="Invite User"
      createDefault={() => ({ name: "", email: "", roleId: roles[0]?.id ?? "", status: "active" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full Name" required><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Email" required><Input type="email" value={v.email} onChange={e => set({ ...v, email: e.target.value })} /></Field>
          <Field label="Role">
            <Select value={v.roleId} onChange={e => set({ ...v, roleId: e.target.value })}>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
        </div>
      )}
    />
  );
}
