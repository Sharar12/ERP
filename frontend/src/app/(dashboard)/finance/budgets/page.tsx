"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { budgetService } from "@/services";
import { formatCurrency } from "@/lib/utils";

export default function BudgetsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { budgetService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Budgets" description="Plan vs actual by category." />
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(b => {
          const pct = Math.round((b.spent / b.budget) * 100);
          return (
            <Card key={b.id}>
              <CardContent>
                <div className="flex justify-between">
                  <div><div className="font-semibold">{b.name}</div><div className="text-xs text-muted-foreground">{b.category} · {b.period}</div></div>
                  <div className="text-lg font-semibold">{pct}%</div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div className={`h-full rounded-full ${pct > 90 ? "bg-destructive" : pct > 70 ? "bg-warning" : "bg-success"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Spent {formatCurrency(b.spent)}</span><span>Budget {formatCurrency(b.budget)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

