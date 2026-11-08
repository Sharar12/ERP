"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { journalService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "number", header: "JE", cell: r => <span className="font-mono text-xs">{r.number}</span> },
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "description", header: "Description", cell: r => r.description },
  { key: "debit", header: "Debit", cell: r => formatCurrency(r.debit) },
  { key: "credit", header: "Credit", cell: r => formatCurrency(r.credit) },
];

export default function JournalPage() {
  return (
    <CrudPage
      title="Journal Entries"
      description="Double-entry ledger entries."
      service={journalService as any}
      columns={columns}
      searchKeys={["number", "description", "account"]}
      createDefault={() => ({ number: "", date: "", description: "", debit: 0, credit: 0, account: "" })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="JE #"><Input value={v.number} onChange={e => set({ ...v, number: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={v.date} onChange={e => set({ ...v, date: e.target.value })} /></Field>
          <Field label="Description"><Input value={v.description} onChange={e => set({ ...v, description: e.target.value })} /></Field>
          <Field label="Account"><Input value={v.account} onChange={e => set({ ...v, account: e.target.value })} /></Field>
          <Field label="Debit"><Input type="number" value={v.debit} onChange={e => set({ ...v, debit: Number(e.target.value) })} /></Field>
          <Field label="Credit"><Input type="number" value={v.credit} onChange={e => set({ ...v, credit: Number(e.target.value) })} /></Field>
        </div>
      )}
    />
  );
}

