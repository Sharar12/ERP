"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { batchService, productService } from "@/services";
import { formatDate } from "@/lib/utils";
import type { Product } from "@/types";

export default function BatchesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    batchService.getAll().then(setRows).catch(() => setRows([]));
    productService.getAll().then(setProducts).catch(() => setProducts([]));
  }, []);

  const columns: Column<any>[] = [
    { key: "batch", header: "Batch #", cell: r => <span className="font-medium">{r.batchNumber ?? r.batch_number}</span> },
    {
      key: "product",
      header: "Product",
      cell: r => {
        const prod = products.find(p => String(p.id) === String(r.productId ?? r.product_id));
        return prod?.name ?? r.product?.name ?? (r.product_id ? `Product #${r.product_id}` : "Product");
      }
    },
    { key: "qty", header: "Qty", cell: r => r.quantity },
    { key: "expiry", header: "Expiry", cell: r => formatDate(r.expiry ?? r.expiry_date) },
    { key: "received", header: "Manufacture / Received", cell: r => formatDate(r.received ?? r.manufacture_date ?? r.created_at) },
  ];

  return (
    <div>
      <PageHeader title="Batches & Serials" description="Batch tracking and expiry monitoring." />
      <DataTable data={rows} columns={columns} searchKeys={["batchNumber", "batch_number"]} />
    </div>
  );
}
