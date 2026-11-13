"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { roleService } from "@/services";
import { useToast } from "@/components/ui/toast";

const ACTIONS = ["read", "create", "update", "delete", "export"];
const PAGES: Record<string, string[]> = {
  crm: ["customers", "leads", "contacts", "pipeline"],
  sales: ["invoices", "orders", "quotations", "payments"],
  purchases: ["suppliers", "orders", "requests", "grns"],
  inventory: ["products", "warehouses", "transfers", "adjustments"],
  finance: ["accounts", "ledger", "journal", "budgets"],
  hr: ["employees", "attendance", "leaves", "payroll"],
  projects: ["projects", "tasks", "milestones"],
  reports: ["sales", "purchases", "inventory", "finance"],
};

export default function RoleDetailPage() {
  const params = useParams();
  const [role, setRole] = useState<any>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toast = useToast();

  useEffect(() => {
    roleService.getById(params.id as string).then(r => {
      if (r) {
        setRole(r);
        const perms = (r.permissions ?? []).map((p: any) => typeof p === 'string' ? p : p.slug ?? p.name);
        setSelected(new Set(perms));
      }
    });
  }, [params.id]);

  if (!role) return null;
  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelected(next);
  };
  const save = async () => {
    try {
      await roleService.update(params.id as string, { permissions: Array.from(selected) } as any);
      toast.push("Permissions saved", "success");
    } catch (e: any) {
      toast.push(e.message || "Failed to save permissions", "error");
    }
  };

  return (
    <div>
      <PageHeader title={`Role: ${role.name}`} description={role.description}
        actions={<Button onClick={save}>Save Permissions</Button>} />
      <div className="space-y-4">
        {Object.entries(PAGES).map(([mod, pages]) => (
          <Card key={mod}>
            <CardContent>
              <div className="font-semibold capitalize">{mod}</div>
              <div className="mt-2 space-y-2">
                {pages.map(page => (
                  <div key={page} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
                    <span className="capitalize">{page}</span>
                    <div className="flex gap-2">
                      {ACTIONS.map(act => {
                        const key = `${mod}.${page}.${act}`;
                        const on = selected.has(key);
                        return (
                          <button key={act} type="button" onClick={() => toggle(key)}
                            className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${on ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                            {act}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
