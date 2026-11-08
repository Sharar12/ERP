"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_ROLES } from "@/mock-data/seed";
import { MOCK_MODULES } from "@/mock-data/seed";
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
    const r = MOCK_ROLES.find(x => x.id === params.id);
    if (r) { setRole(r); setSelected(new Set(r.permissions)); }
  }, [params.id]);

  if (!role) return null;
  const toggle = (key: string) => {
    const n = new Set(selected);
    n.has(key) ? n.delete(key) : n.add(key);
    setSelected(n);
  };
  const save = () => {
    /* MOCK CRUD — API REPLACEMENT: PATCH /api/v1/roles/{id}/permissions */
    toast.push("Permissions saved", "success");
  };

  return (
    <div>
      <PageHeader title={`Permissions: ${role.name}`} description={role.description}
        actions={<Button onClick={save}>Save changes</Button>} />
      <Card>
        <CardContent className="space-y-4">
          {MOCK_MODULES.filter(m => PAGES[m.key]).map(mod => (
            <div key={mod.key} className="rounded-lg border border-border p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium capitalize">{mod.name}</div>
                <button onClick={() => {
                  const n = new Set(selected);
                  const all = PAGES[mod.key].flatMap(p => ACTIONS.map(a => `${mod.key}.${p}.${a}`));
                  const hasAll = all.every(k => n.has(k));
                  all.forEach(k => hasAll ? n.delete(k) : n.add(k));
                  setSelected(n);
                }} className="text-xs text-accent hover:underline">Toggle all</button>
              </div>
              <div className="space-y-1">
                {PAGES[mod.key].map(page => (
                  <div key={page} className="flex items-center gap-2">
                    <div className="w-28 text-xs">{page}</div>
                    {ACTIONS.map(a => {
                      const key = `${mod.key}.${page}.${a}`;
                      return (
                        <label key={a} className="flex cursor-pointer items-center gap-1 text-xs">
                          <input type="checkbox" checked={selected.has(key)} onChange={() => toggle(key)} />
                          {a}
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

