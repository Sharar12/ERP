"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { announcementService } from "@/services";

const columns: Column<any>[] = [
  { key: "title", header: "Title", sortValue: r => r.title, cell: r => <span className="font-medium">{r.title}</span> },
  { key: "audience", header: "Audience", cell: r => <span className="capitalize">{r.audience ?? r.category ?? "All"}</span> },
  { key: "author", header: "Author", cell: r => typeof r.author === "object" ? (r.author?.name ?? "System") : (r.author ?? "System") },
  { key: "date", header: "Date", sortValue: r => r.published_at ?? r.created_at ?? r.date, cell: r => (r.published_at ?? r.created_at ?? r.date ?? "").slice(0, 10) },
];

export default function AnnouncementsPage() {
  return (
    <CrudPage
      title="Company Announcements"
      description="Internal announcements, updates, events, and bulletins."
      service={announcementService as any}
      columns={columns}
      searchKeys={["title", "author", "category"]}
      emptyTitle="No announcements"
      createDefault={() => ({
        title: "",
        category: "General",
        author: "Management",
        date: new Date().toISOString().slice(0, 10),
        content: "",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Announcement Title" required><Input value={v.title} onChange={e => set({ ...v, title: e.target.value })} /></Field>
          </div>
          <Field label="Category">
            <Select value={v.category} onChange={e => set({ ...v, category: e.target.value })}>
              <option value="General">General</option>
              <option value="HR">HR / Policy</option>
              <option value="System">System Maintenance</option>
              <option value="Celebration">Celebration</option>
            </Select>
          </Field>
          <Field label="Author" required><Input value={v.author} onChange={e => set({ ...v, author: e.target.value })} /></Field>
          <div className="sm:col-span-2">
            <Field label="Content" required><Textarea rows={4} value={v.content} onChange={e => set({ ...v, content: e.target.value })} /></Field>
          </div>
        </div>
      )}
    />
  );
}
