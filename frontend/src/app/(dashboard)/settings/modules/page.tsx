"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { moduleService } from "@/services";
import type { ModuleConfig } from "@/types";
import { cn } from "@/lib/utils";

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  useEffect(() => { moduleService.getAll().then(setModules); }, []);
  const toggle = async (key: string) => setModules(await moduleService.toggle(key));

  return (
    <div>
      <PageHeader title="Module Configuration" description="Enable or disable ERP modules for this organization. Disabled modules are hidden from navigation." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(m => (
          <Card key={m.key} className={cn(!m.enabled && "opacity-70")}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.category}</div>
                </div>
                <Badge tone={m.enabled ? "success" : "muted"}>{m.enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{m.description}</p>
              {m.dependencies.length > 0 && (
                <p className="mt-2 text-xs"><span className="text-muted-foreground">Depends on:</span> {m.dependencies.join(", ")}</p>
              )}
              <div className="mt-3 flex justify-end">
                <Button variant={m.enabled ? "outline" : "primary"} size="sm" onClick={() => toggle(m.key)}>
                  {m.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

