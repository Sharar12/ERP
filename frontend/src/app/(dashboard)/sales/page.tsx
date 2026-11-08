"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { invoiceService, quotationService, customerPaymentService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function SalesDashboard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    invoiceService.getAll().then(setInvoices);
    quotationService.getAll().then(setQuotations);
    customerPaymentService.getAll().then(setPayments);
  }, []);

  const revenue = invoices.filter(i => i.status === "paid").reduce((a, b) => a + b.total, 0);
  const outstanding = invoices.filter(i => i.status !== "paid").reduce((a, b) => a + (b.total - b.amountPaid), 0);

  return (
    <div>
      <PageHeader title="Sales" description="Sales performance and pipeline." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Revenue</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(revenue)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Outstanding</div><div className="mt-1 text-2xl font-semibold text-warning">{formatCurrency(outstanding)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Quotations</div><div className="mt-1 text-2xl font-semibold">{quotations.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Payments</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(payments.reduce((a, b) => a + b.amount, 0))}</div></CardContent></Card>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/sales/invoices", label: "Invoices", count: invoices.length },
          { href: "/sales/orders", label: "Sales Orders", count: 4 },
          { href: "/sales/quotations", label: "Quotations", count: quotations.length },
          { href: "/sales/payments", label: "Customer Payments", count: payments.length },
          { href: "/sales/returns", label: "Returns", count: 2 },
          { href: "/sales/targets", label: "Rep Targets", count: 2 },
        ].map(c => (
          <Link key={c.href} href={c.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardContent>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="mt-1 text-2xl font-semibold">{c.count}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="mt-5">
        <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {invoices.slice(0, 4).map(i => (
            <div key={i.id} className="flex items-center justify-between text-sm">
              <div><div className="font-medium">{i.number}</div><div className="text-xs text-muted-foreground">{i.customerName}</div></div>
              <div className="text-right"><div>{formatCurrency(i.total)}</div><Badge tone={statusTone(i.status)}>{i.status}</Badge></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

