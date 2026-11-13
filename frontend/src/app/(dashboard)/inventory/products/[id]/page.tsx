"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { productService, stockMovementService, batchService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Product } from "@/types";

const mvCols: Column<any>[] = [
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "type", header: "Type", cell: r => <Badge>{r.type}</Badge> },
  { key: "qty", header: "Qty", cell: r => r.quantity },
  { key: "ref", header: "Ref", cell: r => r.reference },
];

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    productService.getById(params.id as string).then(setProduct);
    stockMovementService.getAll().then(all => setMovements(all.filter((m: any) => m.productId === params.id)));
    batchService.getAll().then(all => setBatches(all.filter((b: any) => b.productId === params.id)));
  }, [params.id]);

  if (!product) return null;

  return (
    <div>
      <PageHeader title={product.name} description={`SKU ${product.sku}`}
        actions={<Badge tone={product.status === "active" ? "success" : "muted"}>{product.status}</Badge>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Product</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Category" v={product.category} />
            <Row k="Unit" v={product.unit} />
            <Row k="Stock" v={product.stock} />
            <Row k="Reorder" v={product.reorderLevel} />
            <Row k="Cost" v={formatCurrency(product.costPrice)} />
            <Row k="Price" v={formatCurrency(product.salePrice)} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <Tabs tabs={[
            { key: "moves", label: `Movements (${movements.length})`, content: <DataTable data={movements} columns={mvCols} searchKeys={["reference"]} /> },
            { key: "batches", label: `Batches (${batches.length})`, content: <DataTable data={batches} columns={[{ key: "batchNumber", header: "Batch", cell: r => r.batchNumber }, { key: "quantity", header: "Qty", cell: r => r.quantity }, { key: "expiry", header: "Expiry", cell: r => formatDate(r.expiry) }]} searchKeys={["batchNumber"]} /> },
          ]} />
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b border-border py-1.5 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

