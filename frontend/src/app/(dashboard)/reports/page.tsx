"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const reports = [
  { name: "Sales Overview", desc: "Revenue, orders and invoices by period.", cat: "Sales" },
  { name: "Purchase Analysis", desc: "Supplier spend and PO status breakdown.", cat: "Purchases" },
  { name: "Inventory Valuation", desc: "Stock value by product and warehouse.", cat: "Inventory" },
  { name: "Profit & Loss", desc: "Income, expenses and net profit summary.", cat: "Finance" },
  { name: "Headcount & Payroll", desc: "Employees by department and payroll cost.", cat: "HR" },
  { name: "Project Delivery", desc: "Budget vs spend and progress by project.", cat: "Projects" },
  { name: "Customer Lifetime Value", desc: "Revenue concentration and top customers.", cat: "CRM" },
  { name: "Low Stock Detail", desc: "Products at or below reorder level.", cat: "Inventory" },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Cross-module analytics and exportable reports." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map(r => (
          <Card key={r.name}>
            <CardHeader><CardTitle>{r.name}</CardTitle><Badge tone="info">{r.cat}</Badge></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
              <div className="mt-3 flex gap-2">
                <button className="text-xs font-medium text-accent hover:underline">View report →</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

