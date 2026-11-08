"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { MOCK_ROLES } from "@/mock-data/seed";
import type { Role } from "@/types";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const toast = useToast();

  useEffect(() => { setRoles(MOCK_ROLES.slice()); }, []);

  const create = () => {
    /* MOCK CRUD — API REPLACEMENT: POST /api/v1/roles */
    const r: Role = { id: `role_${Date.now()}`, name: form.name, description: form.description, permissions: [], isSystem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setRoles([...roles, r]);
    setOpen(false); setForm({ name: "", description: "" });
    toast.push("Role created", "success");
  };

  return (
    <div>
      <PageHeader title="Roles & Permissions" description="Configure role-based access control."
        actions={<Button onClick={() => setOpen(true)}>+ New Role</Button>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map(r => (
          <Card key={r.id}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                </div>
                {r.isSystem && <Badge tone="muted">System</Badge>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {r.permissions.slice(0, 6).map(p => <Badge key={p} tone="info">{p}</Badge>)}
                {r.permissions.length > 6 && <Badge tone="muted">+{r.permissions.length - 6}</Badge>}
              </div>
              <div className="mt-3 text-right">
                <Link href={`/roles/${r.id}`}><Button variant="outline" size="sm">Edit Permissions</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Role"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={create} disabled={!form.name}>Create</Button></>}>
        <div className="space-y-3">
          <Field label="Role Name" required><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Description"><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

