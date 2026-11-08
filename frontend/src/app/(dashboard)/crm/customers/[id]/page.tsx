"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Badge, statusTone } from "@/components/ui/badge";
import { customerService, invoiceService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Customer, Invoice } from "@/types";

export default function CustomerProfilePage() {
  const params = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    customerService.getById(params.id as string).then(setCustomer);
    invoiceService.getAll().then(inv => setInvoices(inv.filter(i => i.customerId === params.id)));
  }, [params.id]);

  if (!customer) return null;

  return (
    <div>
      <PageHeader title={customer.name} description={customer.email}
        actions={<Badge tone={statusTone(customer.status)}>{customer.status}</Badge>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Group" v={customer.group} />
            <Row k="Phone" v={customer.phone} />
            <Row k="Address" v={customer.address} />
            <Row k="Total Revenue" v={formatCurrency(customer.totalRevenue)} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <Tabs tabs={[
            { key: "invoices", label: `Invoices (${invoices.length})`, content: (
              <Card><CardContent className="space-y-2">
                {invoices.map(i => (
                  <div key={i.id} className="flex items-center justify-between border-b border-border pb-2 text-sm last:border-0">
                    <div><div className="font-medium">{i.number}</div><div className="text-xs text-muted-foreground">{formatDate(i.issueDate)}</div></div>
                    <div className="text-right"><div>{formatCurrency(i.total)}</div><Badge tone={statusTone(i.status)}>{i.status}</Badge></div>
                  </div>
                ))}
                {invoices.length === 0 && <p className="text-sm text-muted-foreground">No invoices.</p>}
              </CardContent></Card>
            ) },
            { key: "notes", label: "Notes", content: (
              <Card><CardContent><p className="text-sm text-muted-foreground">No notes yet. Add notes about interactions here.</p></CardContent></Card>
            ) },
            { key: "activity", label: "Activity", content: (
              <Card><CardContent className="space-y-2 text-sm">
                <div>• Created as customer</div>
                <div>• Last contacted 2024-06-15</div>
                <div>• Follow-up scheduled 2024-07-01</div>
              </CardContent></Card>
            ) },
          ]} />
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b border-border py-1.5 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

