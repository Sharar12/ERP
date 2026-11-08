"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PurchasesDashboard() {
  const links = [
    { href: "/purchases/suppliers", label: "Suppliers" },
    { href: "/purchases/orders", label: "Purchase Orders" },
    { href: "/purchases/requests", label: "Purchase Requests" },
    { href: "/purchases/rfqs", label: "RFQs" },
    { href: "/purchases/grns", label: "Goods Received" },
    { href: "/purchases/returns", label: "Returns" },
    { href: "/purchases/payments", label: "Supplier Payments" },
  ];
  return (
    <div>
      <PageHeader title="Purchases" description="Procurement pipeline and vendor management." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map(l => <Link key={l.href} href={l.href}><Card className="hover:bg-muted/40"><CardContent><div className="text-sm font-medium">{l.label}</div><div className="mt-1 text-xs text-muted-foreground">Manage →</div></CardContent></Card></Link>)}
      </div>
    </div>
  );
}

