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
        {modules.map(m => {
          const deps = Array.isArray(m.dependencies) ? m.dependencies : [];
          const isEnabled = Boolean(m.enabled ?? (m as any).is_enabled);
          return (
            <Card key={m.key} className={cn(!isEnabled && "opacity-70")}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.category}</div>
                  </div>
                  <Badge variant={isEnabled ? "success" : "default"}>{isEnabled ? "Enabled" : "Disabled"}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{m.description}</p>
                {deps.length > 0 && (
                  <p className="mt-2 text-xs"><span className="text-muted-foreground">Depends on:</span> {deps.join(", ")}</p>
                )}
                <div className="mt-3 flex justify-end">
                  <Button variant={isEnabled ? "outline" : "primary"} size="sm" onClick={() => toggle(m.key)}>
                    {isEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

