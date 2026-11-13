"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bomService, mfgOrderService, workCenterService } from "@/services";
import Link from "next/link";

export default function ManufacturingDashboardPage() {
  const [boms, setBoms] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [workCenters, setWorkCenters] = useState<any[]>([]);

  useEffect(() => {
    bomService.getAll().then(setBoms).catch(() => setBoms([]));
    mfgOrderService.getAll().then(setOrders).catch(() => setOrders([]));
    workCenterService.getAll().then(setWorkCenters).catch(() => setWorkCenters([]));
  }, []);

  const activeOrders = orders.filter(o => o.status === "in_progress" || o.status === "planned").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  return (
    <div>
      <PageHeader title="Manufacturing" description="Work orders, bills of materials, and production centers." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Active Work Orders</div><div className="mt-1 text-2xl font-semibold">{activeOrders}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Bills of Materials</div><div className="mt-1 text-2xl font-semibold">{boms.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Work Centers</div><div className="mt-1 text-2xl font-semibold">{workCenters.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Completed MOs</div><div className="mt-1 text-2xl font-semibold text-success">{completedOrders}</div></CardContent></Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Work Centers Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {workCenters.map(wc => (
                <div key={wc.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{wc.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${wc.status === "active" || !wc.status ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{wc.status ?? "active"}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Capacity: {wc.capacity_per_hour ?? wc.capacity ?? 50} units/hr · Cost: ${wc.cost_per_hour ?? wc.cost ?? 25}/hr</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Manufacturing Modules</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Link href="/manufacturing/orders" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Work Orders</Link>
            <Link href="/manufacturing/boms" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Bills of Materials</Link>
            <Link href="/manufacturing/work-centers" className="block rounded-lg border border-border p-2 text-sm hover-lift">→ Work Centers</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
