"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { kbService } from "@/services";

const columns: Column<any>[] = [
  { key: "title", header: "Article Title", sortValue: r => r.title, cell: r => <span className="font-medium">{r.title}</span> },
  { key: "category", header: "Category", sortValue: r => r.category, cell: r => r.category },
  { key: "views", header: "Views", sortValue: r => r.views, cell: r => `${r.views ?? 0} views` },
  { key: "updatedAt", header: "Updated", cell: r => r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : "—" },
];

export default function KnowledgeBasePage() {
  return (
    <CrudPage
      title="Knowledge Base (KB)"
      description="Help articles, onboarding guides, and standard operating procedures."
      service={kbService as any}
      columns={columns}
      searchKeys={["title", "category"]}
      emptyTitle="No articles"
      createDefault={() => ({
        title: "",
        category: "Getting Started",
        views: 0,
        content: "",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Article Title" required><Input value={v.title} onChange={e => set({ ...v, title: e.target.value })} /></Field>
          </div>
          <Field label="Category">
            <Select value={v.category} onChange={e => set({ ...v, category: e.target.value })}>
              <option value="Getting Started">Getting Started</option>
              <option value="Billing">Billing & Invoices</option>
              <option value="Technical">Technical FAQs</option>
              <option value="Operations">Operations</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Content / Markdown" required><Textarea rows={6} value={v.content} onChange={e => set({ ...v, content: e.target.value })} /></Field>
          </div>
        </div>
      )}
    />
  );
}
