"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { stockMovementService } from "@/services";
import { MOCK_PRODUCTS } from "@/mock-data/seed";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "product", header: "Product", cell: r => MOCK_PRODUCTS.find(p => p.id === r.productId)?.name ?? r.productId },
  { key: "type", header: "Type", cell: r => <Badge tone={r.type === "in" ? "success" : r.type === "out" ? "danger" : "warning"}>{r.type}</Badge> },
  { key: "qty", header: "Qty", cell: r => r.quantity },
  { key: "ref", header: "Reference", cell: r => r.reference },
];

export default function MovementsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { stockMovementService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Stock Movements" description="Full transaction ledger of inventory changes." />
      <DataTable data={rows} columns={columns} searchKeys={["reference"]}
        filters={[{ key: "type", label: "Type", options: ["in", "out", "adjust"], get: r => r.type }]} />
    </div>
  );
}

