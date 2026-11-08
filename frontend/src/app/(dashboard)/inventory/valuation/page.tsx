"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/tables/data-table";
import { productService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

const columns: Column<Product>[] = [
  { key: "name", header: "Product", cell: r => r.name },
  { key: "stock", header: "Stock", sortValue: r => r.stock, cell: r => r.stock },
  { key: "cost", header: "Cost", sortValue: r => r.costPrice, cell: r => formatCurrency(r.costPrice) },
  { key: "value", header: "Total Value", sortValue: r => r.stock * r.costPrice, cell: r => formatCurrency(r.stock * r.costPrice) },
];

export default function ValuationPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { productService.getAll().then(setProducts); }, []);
  const totalValue = products.reduce((a, p) => a + p.stock * p.costPrice, 0);
  const retailValue = products.reduce((a, p) => a + p.stock * p.salePrice, 0);
  return (
    <div>
      <PageHeader title="Stock Valuation" description="Current inventory value by product." />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Card><CardContent><div className="text-xs text-muted-foreground">Cost Value</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(totalValue)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Retail Value</div><div className="mt-1 text-2xl font-semibold">{formatCurrency(retailValue)}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Potential Margin</div><div className="mt-1 text-2xl font-semibold text-success">{formatCurrency(retailValue - totalValue)}</div></CardContent></Card>
      </div>
      <DataTable data={products} columns={columns} searchKeys={["name", "sku"]} />
    </div>
  );
}

