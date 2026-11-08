"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_BOMS, MOCK_MFG_ORDERS, MOCK_WORK_CENTERS } from "@/mock-data/extended-seed";
import Link from "next/link";
import { Factory, Cog, Layers, CheckCircle2 } from "lucide-react";

export default function ManufacturingDashboardPage() {
  const activeOrders = MOCK_MFG_ORDERS.filter(o => o.status === "in_progress").length;
  const completedOrders = MOCK_MFG_ORDERS.filter(o => o.status === "completed").length;

  return (
    <div>
      <PageHeader title="Manufacturing" description="Work orders, bills of materials, and production centers." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Active Work Orders</div><div className="mt-1 text-2xl font-semibold">{activeOrders}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Bills of Materials</div><div className="mt-1 text-2xl font-semibold">{MOCK_BOMS.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Work Centers</div><div className="mt-1 text-2xl font-semibold">{MOCK_WORK_CENTERS.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Completed MOs</div><div className="mt-1 text-2xl font-semibold text-success">{completedOrders}</div></CardContent></Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Work Centers Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {MOCK_WORK_CENTERS.map(wc => (
                <div key={wc.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{wc.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${wc.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{wc.status}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Capacity: {wc.capacity} units/day · Utilization: {wc.utilization}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Link href="/manufacturing/orders" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Manufacturing Orders</Link>
            <Link href="/manufacturing/boms" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Bills of Materials (BOM)</Link>
            <Link href="/manufacturing/work-centers" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Work Centers</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
