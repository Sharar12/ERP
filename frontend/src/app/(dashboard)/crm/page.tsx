"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CUSTOMERS, MOCK_LEADS } from "@/mock-data/seed";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Users, Target, TrendingUp, Award } from "lucide-react";

export default function CrmDashboardPage() {
  const pipeline = ["new", "contacted", "qualified", "proposal", "won", "lost"];
  const byStage = pipeline.map(s => ({ stage: s, count: MOCK_LEADS.filter(l => l.status === s).length, value: MOCK_LEADS.filter(l => l.status === s).reduce((a, b) => a + b.value, 0) }));

  return (
    <div>
      <PageHeader title="CRM" description="Pipeline, customers and revenue." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Total Customers</div><div className="mt-1 text-2xl font-semibold">{MOCK_CUSTOMERS.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Open Leads</div><div className="mt-1 text-2xl font-semibold">{MOCK_LEADS.filter(l => !["won", "lost"].includes(l.status)).length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Pipeline Value</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(MOCK_LEADS.reduce((a, b) => a + b.value, 0))}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Won This Q</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(MOCK_LEADS.filter(l => l.status === "won").reduce((a, b) => a + b.value, 0))}</div></CardContent></Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Pipeline</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {byStage.map(s => (
                <div key={s.stage} className="rounded-lg border border-border p-3">
                  <div className="text-xs capitalize text-muted-foreground">{s.stage}</div>
                  <div className="mt-1 text-lg font-semibold">{s.count}</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(s.value)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Link href="/crm/customers" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Customers</Link>
            <Link href="/crm/leads" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Leads</Link>
            <Link href="/crm/contacts" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Contacts</Link>
            <Link href="/crm/pipeline" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Kanban Pipeline</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

