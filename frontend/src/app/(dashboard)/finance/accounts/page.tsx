"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { coaService } from "@/services";
import { formatCurrency } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "code", header: "Code", sortValue: r => r.code, cell: r => <span className="font-mono text-xs">{r.code}</span> },
  { key: "name", header: "Account", sortValue: r => r.name, cell: r => <span className="font-medium">{r.name}</span> },
  { key: "type", header: "Type", cell: r => <Badge tone={r.type === "revenue" ? "success" : r.type === "expense" ? "danger" : r.type === "asset" ? "info" : "muted"}>{r.type}</Badge> },
  { key: "balance", header: "Balance", sortValue: r => r.balance, cell: r => formatCurrency(r.balance) },
];

export default function CoaPage() {
  return (
    <CrudPage
      title="Chart of Accounts"
      description="Accounts for the ledger."
      service={coaService as any}
      columns={columns}
      searchKeys={["code", "name", "type"]}
      createDefault={() => ({ code: "", name: "", type: "asset", balance: 0 })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Code"><Input value={v.code} onChange={e => set({ ...v, code: e.target.value })} /></Field>
          <Field label="Name"><Input value={v.name} onChange={e => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Type">
            <Select value={v.type} onChange={e => set({ ...v, type: e.target.value })}>
              {["asset", "liability", "equity", "revenue", "expense"].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Balance"><Input type="number" value={v.balance} onChange={e => set({ ...v, balance: Number(e.target.value) })} /></Field>
        </div>
      )}
    />
  );
}

