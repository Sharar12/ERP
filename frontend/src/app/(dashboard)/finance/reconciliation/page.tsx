"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function ReconciliationPage() {
  /* MOCK DATA — Reconciliation view. API REPLACEMENT: GET /api/v1/finance/reconciliation */
  const rows = [
    { id: 1, date: "2024-06-01", description: "Northwind payment", book: 13640, bank: 13640, matched: true },
    { id: 2, date: "2024-06-03", description: "Apex payout", book: -18400, bank: -18400, matched: true },
    { id: 3, date: "2024-06-15", description: "Payroll batch", book: -84200, bank: -84200, matched: true },
    { id: 4, date: "2024-06-20", description: "Rent", book: -12000, bank: -11950, matched: false },
  ];
  return (
    <div>
      <PageHeader title="Bank Reconciliation" description="Match transactions against bank statements." />
      <Card>
        <CardContent className="space-y-2">
          {rows.map(r => (
            <div key={r.id} className="flex items-center justify-between border-b border-border py-2 last:border-0 text-sm">
              <div><div className="font-medium">{r.description}</div><div className="text-xs text-muted-foreground">{r.date}</div></div>
              <div className="text-right"><div>{formatCurrency(r.book)}</div>
                <Badge tone={r.matched ? "success" : "warning"}>{r.matched ? "matched" : "review"}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

