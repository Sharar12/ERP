"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { productService, warehouseService } from "@/services";
import { formatCurrency } from "@/lib/utils";

export default function InventoryDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  useEffect(() => { productService.getAll().then(setProducts); warehouseService.getAll().then(setWarehouses); }, []);
  const value = products.reduce((a, p) => a + p.stock * p.costPrice, 0);
  const lowStock = products.filter(p => p.stock <= p.reorderLevel);
  return (
    <div>
      <PageHeader title="Inventory" description="Stock, warehouses and valuation." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Products</div><div className="mt-1 text-2xl font-semibold">{products.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Stock Value</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(value)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Low Stock</div><div className="mt-1 text-2xl font-semibold text-destructive">{lowStock.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Warehouses</div><div className="mt-1 text-2xl font-semibold">{warehouses.length}</div></CardContent></Card>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/inventory/products", label: "Products" },
          { href: "/inventory/warehouses", label: "Warehouses" },
          { href: "/inventory/transfers", label: "Stock Transfers" },
          { href: "/inventory/adjustments", label: "Stock Adjustments" },
          { href: "/inventory/movements", label: "Stock Movements" },
          { href: "/inventory/valuation", label: "Valuation" },
          { href: "/inventory/batches", label: "Batches" },
        ].map(l => <Link key={l.href} href={l.href}><Card className="hover:bg-muted/40"><CardContent><div className="text-sm font-medium">{l.label}</div></CardContent></Card></Link>)}
      </div>
    </div>
  );
}

