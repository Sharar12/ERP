"use client";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge, statusTone } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Field } from "@/components/ui/field";
import { DataTable, type Column } from "@/components/tables/data-table";
import { productService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ sku: "", name: "", category: "Components", unit: "pcs", costPrice: 0, salePrice: 0, stock: 0, reorderLevel: 0, status: "active" as Product["status"] });

  const load = async () => setRows(await productService.getAll());
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ sku: "", name: "", category: "Components", unit: "pcs", costPrice: 0, salePrice: 0, stock: 0, reorderLevel: 0, status: "active" }); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setOpen(true); };

  const save = async () => {
    if (editing) await productService.update(editing.id, form);
    else await productService.create({ ...form, warehouseId: "wh_001" });
    setOpen(false); load();
  };

  const columns: Column<Product>[] = [
    { key: "name", header: "Product", sortValue: r => r.name, cell: r => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">SKU {r.sku}</div>
      </div>
    )},
    { key: "category", header: "Category", sortValue: r => r.category, cell: r => r.category },
    { key: "stock", header: "Stock", sortValue: r => r.stock, cell: r => (
      <span className={r.stock <= r.reorderLevel ? "text-destructive font-medium" : ""}>{r.stock} {r.unit}</span>
    )},
    { key: "cost", header: "Cost", sortValue: r => r.costPrice, cell: r => formatCurrency(r.costPrice) },
    { key: "price", header: "Price", sortValue: r => r.salePrice, cell: r => formatCurrency(r.salePrice) },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Products" description="Product catalogue, stock levels and pricing."
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Product</Button>} />
      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["name", "sku", "category", "status"]}
        onRowClick={r => router.push(`/inventory/products/${r.id}`)}
        rowActions={r => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" onClick={async () => { await productService.delete(r.id); load(); }}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        )}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Product" : "New Product"}
        footer={<>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={!form.name || !form.sku}>Save</Button>
        </>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="SKU" required><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></Field>
          <Field label="Name" required><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Category"><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></Field>
          <Field label="Unit"><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /></Field>
          <Field label="Cost Price"><Input type="number" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: Number(e.target.value) })} /></Field>
          <Field label="Sale Price"><Input type="number" value={form.salePrice} onChange={e => setForm({ ...form, salePrice: Number(e.target.value) })} /></Field>
          <Field label="Stock"><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} /></Field>
          <Field label="Reorder Level"><Input type="number" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Product["status"] })}>
              <option value="active">Active</option><option value="discontinued">Discontinued</option>
            </Select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
