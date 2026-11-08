"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, Search, SlidersHorizontal } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loading";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  hiddenByDefault?: boolean;
  width?: number;
}
export interface FilterDef { key: string; label: string; options: string[]; get: (row: any) => string; }

export function DataTable<T extends { id: string }>({
  data, columns, searchKeys = [], pageSize: initialPageSize = 10, rowActions, bulkActions, toolbar,
  emptyTitle = "No records", emptyDescription, onRowClick, loading, filters = [], dense,
}: {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  pageSize?: number;
  rowActions?: (row: T) => React.ReactNode;
  bulkActions?: (selected: T[], clear: () => void) => React.ReactNode;
  toolbar?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  filters?: FilterDef[];
  dense?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState<Set<string>>(new Set(columns.filter(c => !c.hiddenByDefault).map(c => c.key)));
  const [showCols, setShowCols] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let rows = [...data];
    const q = query.trim().toLowerCase();
    if (q && searchKeys.length) rows = rows.filter(r => searchKeys.some(k => String(r[k] ?? "").toLowerCase().includes(q)));
    filters.forEach(f => {
      if (filterValues[f.key]) rows = rows.filter(r => f.get(r) === filterValues[f.key]);
    });
    if (sort) {
      const col = columns.find(c => c.key === sort.key);
      if (col?.sortValue) {
        rows.sort((a, b) => {
          const av = col.sortValue!(a); const bv = col.sortValue!(b);
          return av < bv ? (sort.dir === "asc" ? -1 : 1) : av > bv ? (sort.dir === "asc" ? 1 : -1) : 0;
        });
      }
    }
    return rows;
  }, [data, query, sort, columns, searchKeys, filters, filterValues]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const py = dense ? "py-1.5" : "py-2";

  const toggleSort = (key: string) => setSort(s => s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  const allChecked = paged.length > 0 && paged.every(r => selected.has(r.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) paged.forEach(r => next.delete(r.id));
    else paged.forEach(r => next.add(r.id));
    setSelected(next);
  };

  const exportCSV = () => {
    const headers = columns.filter(c => visible.has(c.key)).map(c => c.header);
    const rows = filtered.map(r => columns.filter(c => visible.has(c.key)).map(c => {
      const raw = c.sortValue ? c.sortValue(r) : "";
      return `"${String(raw).replace(/"/g, '""')}"`;
    }).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const visibleCols = columns.filter(c => visible.has(c.key));
  const selectedRows = filtered.filter(r => selected.has(r.id));

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Search…" className="pl-8" />
          </div>
          {filters.map(f => (
            <Select key={f.key} value={filterValues[f.key] ?? ""}
              onChange={e => { setFilterValues(v => ({ ...v, [f.key]: e.target.value })); setPage(1); }}
              className="w-auto">
              <option value="">{f.label}</option>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {toolbar}
          <Select value={String(pageSize)} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="w-auto">
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} rows</option>)}
          </Select>
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-3.5 w-3.5" /></Button>
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowCols(v => !v)}><SlidersHorizontal className="h-3.5 w-3.5" /></Button>
            {showCols && (
              <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-border bg-card p-2 shadow-lg animate-fade-down">
                {columns.map(c => (
                  <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted">
                    <input type="checkbox" checked={visible.has(c.key)}
                      className="transition-transform duration-150 hover:scale-110 accent-accent"
                      onChange={() => { const n = new Set(visible); n.has(c.key) ? n.delete(c.key) : n.add(c.key); setVisible(n); }} />
                    {c.header}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selected.size > 0 && bulkActions && (
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-xs">
          <span>{selected.size} selected</span>
          <div className="flex items-center gap-2">{bulkActions(selectedRows, () => setSelected(new Set()))}</div>
        </div>
      )}

      {loading ? <TableSkeleton /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="w-9 px-3 py-2"><input type="checkbox" checked={allChecked} onChange={toggleAll} className="transition-transform duration-150 hover:scale-110 accent-accent" /></th>
                {visibleCols.map(c => (
                  <th key={c.key} className={cn(
                    "px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
                    c.className
                  )} style={c.width ? { width: c.width } : undefined}>
                    {c.sortValue ? (
                      <button className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-foreground" onClick={() => toggleSort(c.key)}>
                        {c.header}{sort?.key === c.key ? (sort.dir === "asc" ? <ArrowUp className="h-3 w-3 transition-transform duration-150" /> : <ArrowDown className="h-3 w-3 transition-transform duration-150" />) : null}
                      </button>
                    ) : c.header}
                  </th>
                ))}
                {rowActions && <th className="w-10 px-3 py-2" />}
              </tr>
            </thead>
            <tbody>
              {paged.map(row => (
                <tr key={row.id}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors duration-100",
                    "hover:bg-muted/60",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  <td className={cn("px-3", py)} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(row.id)}
                      className="transition-transform duration-150 hover:scale-110 accent-accent"
                      onChange={() => { const n = new Set(selected); n.has(row.id) ? n.delete(row.id) : n.add(row.id); setSelected(n); }} />
                  </td>
                  {visibleCols.map(c => <td key={c.key} className={cn("px-3 text-[13px] text-mono-num", py, c.className)}>{c.cell(row)}</td>)}
                  {rowActions && <td className={cn("px-3", py)} onClick={e => e.stopPropagation()}>{rowActions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && paged.length === 0 && <EmptyState title={emptyTitle} description={emptyDescription} />}

      {filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
          <span>{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <span className="px-2">{safePage} / {pageCount}</span>
            <Button variant="ghost" size="sm" disabled={safePage === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
