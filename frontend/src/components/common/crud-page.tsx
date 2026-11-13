// File Location: frontend/src/components/common/crud-page.tsx
// Purpose: Generic CRUD Page Layout Template (Standard Header, Data Grid, Create/Edit Modals, Filters)

"use client";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DataTable, type Column, type FilterDef } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import type { CrudService, BaseEntity } from "@/types";

export function CrudPage<T extends BaseEntity>({
  title, description, service, columns, searchKeys, renderForm, createDefault,
  buildCreate, emptyTitle, filters, primaryLabel = "Add",
}: {
  title: string; description: string;
  service: CrudService<T>;
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  renderForm: (value: any, setValue: (v: any) => void) => React.ReactNode;
  createDefault: () => any;
  buildCreate?: (form: any) => any;
  emptyTitle?: string;
  filters?: FilterDef[];
  primaryLabel?: string;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<any>(createDefault());
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const toast = useToast();

  const load = async () => { setLoading(true); setRows(await service.getAll()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(createDefault()); setOpen(true); };
  const openEdit = (row: T) => { setEditing(row); setForm({ ...row }); setOpen(true); };

  const save = async () => {
    /* MOCK CRUD — Phase 3 replaces with POST / PUT */
    try {
      if (editing) await service.update(editing.id, form);
      else await service.create(buildCreate ? buildCreate(form) : form);
      toast.push(editing ? "Updated successfully" : "Created successfully", "success");
      setOpen(false); load();
    } catch (e: any) { toast.push(e.message ?? "Operation failed", "error"); }
  };

  const remove = async (id: string) => {
    await service.delete(id); toast.push("Deleted", "success"); load();
  };

  return (
    <div>
      <PageHeader title={title} description={description}
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> {primaryLabel}</Button>} />
      <DataTable
        data={rows} columns={columns} searchKeys={searchKeys} loading={loading}
        filters={filters}
        emptyTitle={emptyTitle ?? `No ${title.toLowerCase()}`}
        rowActions={r => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmId(r.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
          </div>
        )}
        bulkActions={(sel, clear) => (
          <Button variant="destructive" size="sm" onClick={async () => {
            for (const s of sel) await service.delete(s.id);
            toast.push(`${sel.length} deleted`, "success"); clear(); load();
          }}>Delete selected</Button>
        )}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`} size="lg"
        footer={<>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </>}>
        {renderForm(form, setForm)}
      </Modal>
      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && remove(confirmId)}
        title="Delete record?" description="This action cannot be undone." confirmLabel="Delete" destructive />
    </div>
  );
}

