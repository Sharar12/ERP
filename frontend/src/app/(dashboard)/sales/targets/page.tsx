"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { salesTargetService } from "@/services";
import { formatCurrency } from "@/lib/utils";

export default function SalesTargetsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { salesTargetService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Sales Targets" description="Rep performance against quarterly quota." />
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(r => {
          const pct = Math.round((r.achieved / r.target) * 100);
          return (
            <Card key={r.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div><div className="font-semibold">{r.repName}</div><div className="text-xs text-muted-foreground">{r.period}</div></div>
                  <div className="text-lg font-semibold">{pct}%</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${pct >= 100 ? "bg-success" : "bg-accent"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(r.achieved)}</span><span>{formatCurrency(r.target)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

