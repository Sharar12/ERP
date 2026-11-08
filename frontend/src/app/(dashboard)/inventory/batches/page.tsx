"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { batchService } from "@/services";
import { MOCK_PRODUCTS } from "@/mock-data/seed";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "batch", header: "Batch #", cell: r => <span className="font-medium">{r.batchNumber}</span> },
  { key: "product", header: "Product", cell: r => MOCK_PRODUCTS.find(p => p.id === r.productId)?.name ?? r.productId },
  { key: "qty", header: "Qty", cell: r => r.quantity },
  { key: "expiry", header: "Expiry", cell: r => formatDate(r.expiry) },
  { key: "received", header: "Received", cell: r => formatDate(r.received) },
];

export default function BatchesPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { batchService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Batches & Serials" description="Batch tracking and expiry monitoring." />
      <DataTable data={rows} columns={columns} searchKeys={["batchNumber"]} />
    </div>
  );
}

