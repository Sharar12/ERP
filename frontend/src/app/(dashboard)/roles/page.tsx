"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { roleService } from "@/services";
import type { Role } from "@/types";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const toast = useToast();

  const load = () => {
    roleService.getAll().then(setRoles).catch(() => setRoles([]));
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await roleService.create({ name: form.name, description: form.description } as any);
      setOpen(false);
      setForm({ name: "", description: "" });
      toast.push("Role created", "success");
      load();
    } catch (e: any) {
      toast.push(e.message || "Failed to create role", "error");
    }
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
                {(r.isSystem ?? (r as any).is_system) && <Badge tone="muted">System</Badge>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {(r.permissions ?? []).slice(0, 6).map((p: any) => (
                  <Badge key={typeof p === 'string' ? p : p.name ?? p.id} tone="info">
                    {typeof p === 'string' ? p : p.name ?? p.slug}
                  </Badge>
                ))}
                {(r.permissions ?? []).length > 6 && <Badge tone="muted">+{(r.permissions ?? []).length - 6}</Badge>}
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
