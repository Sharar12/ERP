"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { journalService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "JE", cell: r => <span className="font-mono text-xs">{r.number}</span> },
  { key: "date", header: "Date", sortValue: r => r.date, cell: r => formatDate(r.date) },
  { key: "description", header: "Description", cell: r => r.description },
  { key: "account", header: "Account", cell: r => r.account },
  { key: "debit", header: "Debit", sortValue: r => r.debit, cell: r => formatCurrency(r.debit) },
  { key: "credit", header: "Credit", sortValue: r => r.credit, cell: r => formatCurrency(r.credit) },
];

export default function LedgerPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { journalService.getAll().then(setRows); }, []);
  const debits = rows.reduce((a, b) => a + b.debit, 0);
  const credits = rows.reduce((a, b) => a + b.credit, 0);
  return (
    <div>
      <PageHeader title="General Ledger" description="Posted journal entries." />
      <div className="mb-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Debits</div><div className="text-lg font-semibold">{formatCurrency(debits)}</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Credits</div><div className="text-lg font-semibold">{formatCurrency(credits)}</div></div>
        <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Balance</div><div className="text-lg font-semibold">{formatCurrency(debits - credits)}</div></div>
      </div>
      <DataTable data={rows} columns={columns} searchKeys={["number", "description", "account"]} />
    </div>
  );
}

