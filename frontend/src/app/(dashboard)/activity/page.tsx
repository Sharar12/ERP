"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Column } from "@/components/tables/data-table";
import { activityService } from "@/services";

const columns: Column<any>[] = [
  { key: "user", header: "User", sortValue: r => typeof r.user === "object" ? r.user?.name : r.user, cell: r => <span className="font-medium">{typeof r.user === "object" ? (r.user?.name ?? "System") : (r.user ?? "System")}</span> },
  { key: "action", header: "Action", sortValue: r => r.event ?? r.action, cell: r => <span className="capitalize">{r.event ?? r.action ?? "—"}</span> },
  { key: "target", header: "Description / Target", sortValue: r => r.description ?? r.target, cell: r => r.description ?? r.target ?? "—" },
  { key: "timestamp", header: "Timestamp", sortValue: r => r.created_at ?? r.timestamp, cell: r => r.created_at ?? r.timestamp ? new Date(r.created_at ?? r.timestamp).toLocaleString() : "—" },
  { key: "ipAddress", header: "IP Address", cell: r => r.ip_address ?? r.ipAddress ?? "127.0.0.1" },
];

export default function ActivityLogPage() {
  return (
    <CrudPage
      title="Audit & Activity Log"
      description="System-wide audit trail of user actions, edits, status updates, and security logs."
      service={activityService as any}
      columns={columns}
      searchKeys={["user", "action", "target"]}
      emptyTitle="No activity entries"
      primaryLabel="Add Entry"
      createDefault={() => ({
        user: "Admin",
        action: "Updated Record",
        target: "General",
        timestamp: new Date().toISOString(),
        ipAddress: "127.0.0.1",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="User" required><Input value={v.user} onChange={e => set({ ...v, user: e.target.value })} /></Field>
          <Field label="Action" required><Input value={v.action} onChange={e => set({ ...v, action: e.target.value })} /></Field>
          <Field label="Target Entity" required><Input value={v.target} onChange={e => set({ ...v, target: e.target.value })} /></Field>
          <Field label="IP Address"><Input value={v.ipAddress} onChange={e => set({ ...v, ipAddress: e.target.value })} /></Field>
        </div>
      )}
    />
  );
}
