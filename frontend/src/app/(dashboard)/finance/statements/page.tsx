"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

/* MOCK DATA — Statement figures. API REPLACEMENT: GET /api/v1/finance/statements/{type} */
const PL = {
  revenue: [
    { label: "Product Sales", amount: 380000 },
    { label: "Service Revenue", amount: 100000 },
  ],
  expenses: [
    { label: "COGS", amount: 210000 },
    { label: "Payroll", amount: 84000 },
    { label: "Rent", amount: 24000 },
  ],
};
const BS = {
  assets: [
    { label: "Cash", amount: 42000 },
    { label: "Receivables", amount: 148000 },
    { label: "Inventory", amount: 218000 },
  ],
  liabilities: [
    { label: "Payables", amount: 62000 },
  ],
  equity: [{ label: "Owner Equity", amount: 346000 }],
};

function Section({ title, items, total }: { title: string; items: { label: string; amount: number }[]; total: number }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="mb-2 text-sm font-medium">{title}</div>
      {items.map(i => <div key={i.label} className="flex justify-between text-sm py-0.5"><span className="text-muted-foreground">{i.label}</span><span>{formatCurrency(i.amount)}</span></div>)}
      <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
    </div>
  );
}

export default function StatementsPage() {
  const totalRev = PL.revenue.reduce((a, b) => a + b.amount, 0);
  const totalExp = PL.expenses.reduce((a, b) => a + b.amount, 0);
  return (
    <div>
      <PageHeader title="Financial Statements" description="P&L, Balance Sheet and Cash Flow." />
      <Tabs tabs={[
        { key: "pl", label: "Profit & Loss", content: (
          <div className="grid gap-3 md:grid-cols-2">
            <Section title="Revenue" items={PL.revenue} total={totalRev} />
            <Section title="Expenses" items={PL.expenses} total={totalExp} />
            <div className="col-span-full rounded-lg border-2 border-accent bg-accent/5 p-3 text-sm font-semibold">
              Net Profit: {formatCurrency(totalRev - totalExp)}
            </div>
          </div>
        ) },
        { key: "bs", label: "Balance Sheet", content: (
          <div className="grid gap-3 md:grid-cols-2">
            <Section title="Assets" items={BS.assets} total={BS.assets.reduce((a, b) => a + b.amount, 0)} />
            <div className="space-y-3">
              <Section title="Liabilities" items={BS.liabilities} total={BS.liabilities.reduce((a, b) => a + b.amount, 0)} />
              <Section title="Equity" items={BS.equity} total={BS.equity.reduce((a, b) => a + b.amount, 0)} />
            </div>
          </div>
        ) },
        { key: "cf", label: "Cash Flow", content: (
          <Card><CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Operating activities</span><span className="text-success">{formatCurrency(86000)}</span></div>
              <div className="flex justify-between"><span>Investing activities</span><span className="text-destructive">{formatCurrency(-24000)}</span></div>
              <div className="flex justify-between"><span>Financing activities</span><span className="text-success">{formatCurrency(12000)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Net change</span><span>{formatCurrency(74000)}</span></div>
            </div>
          </CardContent></Card>
        ) },
      ]} />
    </div>
  );
}

