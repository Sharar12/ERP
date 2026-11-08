"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { transactionService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

export default function TransactionsPage() {
  const [rows, setRows] = useState<Transaction[]>([]);
  useEffect(() => { transactionService.getAll().then(setRows); }, []);

  const columns: Column<Transaction>[] = [
    { key: "ref", header: "Reference", sortValue: r => r.reference, cell: r => <span className="font-medium">{r.reference}</span> },
    { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
    { key: "desc", header: "Description", cell: r => r.description },
    { key: "category", header: "Category", cell: r => r.category },
    { key: "type", header: "Type", cell: r => <Badge tone={r.type === "income" ? "success" : r.type === "expense" ? "danger" : "info"}>{r.type}</Badge> },
    { key: "amount", header: "Amount", sortValue: r => r.amount, cell: r => (
      <span className={r.type === "income" ? "text-success font-medium" : "text-destructive font-medium"}>
        {r.type === "income" ? "+" : "-"}{formatCurrency(r.amount)}
      </span>
    )},
  ];

  return (
    <div>
      <PageHeader title="Transactions" description="Income, expenses and account movements." />
      <DataTable data={rows} columns={columns} searchKeys={["reference", "description", "category"]} />
    </div>
  );
}

