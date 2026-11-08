"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { transactionService } from "@/services";
import { coaService, budgetService } from "@/services/mock/extended";
import { formatCurrency } from "@/lib/utils";

export default function FinanceDashboard() {
  const [txs, setTxs] = useState<any[]>([]);
  const [coa, setCoa] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  useEffect(() => {
    transactionService.getAll().then(setTxs);
    coaService.getAll().then(setCoa);
    budgetService.getAll().then(setBudgets);
  }, []);
  const income = txs.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expenses = txs.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const cash = coa.find(c => c.code === "1000")?.balance ?? 0;
  const ar = coa.find(c => c.code === "1100")?.balance ?? 0;
  const ap = coa.find(c => c.code === "2000")?.balance ?? 0;

  return (
    <div>
      <PageHeader title="Finance" description="Accounting, reporting and control." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Cash</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(cash)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Receivables</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(ar)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Payables</div><div className="mt-1 text-2xl font-semibold text-warning">{formatCurrency(ap)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Net Income</div><div className="mt-1 text-2xl font-semibold text-success">{formatCurrency(income - expenses)}</div></CardContent></Card>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/finance/accounts", label: "Chart of Accounts" },
          { href: "/finance/ledger", label: "General Ledger" },
          { href: "/finance/journal", label: "Journal Entries" },
          { href: "/finance/receivables", label: "Receivables" },
          { href: "/finance/payables", label: "Payables" },
          { href: "/finance/bank", label: "Bank Accounts" },
          { href: "/finance/reconciliation", label: "Reconciliation" },
          { href: "/finance/budgets", label: "Budgets" },
          { href: "/finance/statements", label: "Financial Statements" },
          { href: "/finance/transactions", label: "Transactions" },
        ].map(l => <Link key={l.href} href={l.href}><Card className="hover:bg-muted/40"><CardContent><div className="text-sm font-medium">{l.label}</div></CardContent></Card></Link>)}
      </div>
      <Card className="mt-5">
        <CardContent>
          <div className="text-sm font-medium">Active Budgets</div>
          <div className="mt-2 space-y-2">
            {budgets.map(b => {
              const pct = Math.round((b.spent / b.budget) * 100);
              return (
                <div key={b.id}>
                  <div className="flex justify-between text-xs"><span>{b.name}</span><span>{pct}%</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${pct > 90 ? "bg-destructive" : "bg-accent"}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

