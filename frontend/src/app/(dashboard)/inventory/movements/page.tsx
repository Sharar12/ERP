"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { stockMovementService, productService } from "@/services";
import { formatDate } from "@/lib/utils";
import type { Product } from "@/types";

export default function MovementsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    stockMovementService.getAll().then(setRows).catch(() => setRows([]));
    productService.getAll().then(setProducts).catch(() => setProducts([]));
  }, []);

  const columns: Column<any>[] = [
    { key: "date", header: "Date", sortValue: r => r.date ?? r.moved_at ?? r.created_at, cell: r => formatDate(r.date ?? r.moved_at ?? r.created_at) },
    {
      key: "product",
      header: "Product",
      cell: r => {
        const prod = products.find(p => String(p.id) === String(r.productId ?? r.product_id));
        return prod?.name ?? r.product?.name ?? (r.product_id ? `Product #${r.product_id}` : "Product");
      }
    },
    { key: "type", header: "Type", cell: r => <Badge tone={r.type === "in" ? "success" : r.type === "out" ? "danger" : "warning"}>{r.type}</Badge> },
    { key: "qty", header: "Qty", cell: r => r.quantity },
    { key: "ref", header: "Reference", cell: r => r.reference ?? r.type ?? "—" },
  ];

  return (
    <div>
      <PageHeader title="Stock Movements" description="Full transaction ledger of inventory changes." />
      <DataTable data={rows} columns={columns} searchKeys={["reference", "type"]}
        filters={[{ key: "type", label: "Type", options: ["in", "out", "adjust", "adjustment"], get: r => r.type }]} />
    </div>
  );
}
