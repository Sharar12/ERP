"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { projectService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const [rows, setRows] = useState<Project[]>([]);
  useEffect(() => { projectService.getAll().then(setRows); }, []);

  return (
    <div>
      <PageHeader title="Projects" description="Portfolio performance, budgets and delivery progress." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rows.map(p => (
          <Link key={p.id} href={`/projects/${p.id}`} className="block">
            <Card className="transition-colors hover:bg-muted/40">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{p.code}</div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.clientName}</div>
                  </div>
                  <Badge tone={statusTone(p.status)}>{p.status.replace("_", " ")}</Badge>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs"><span>Progress</span><span>{p.progress}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div><div className="text-muted-foreground">Budget</div><div className="font-medium">{formatCurrency(p.budget)}</div></div>
                  <div><div className="text-muted-foreground">Spent</div><div className="font-medium">{formatCurrency(p.spent)}</div></div>
                  <div><div className="text-muted-foreground">Start</div><div className="font-medium">{formatDate(p.startDate)}</div></div>
                  <div><div className="text-muted-foreground">End</div><div className="font-medium">{formatDate(p.endDate)}</div></div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
