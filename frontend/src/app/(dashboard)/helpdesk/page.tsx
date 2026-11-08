"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { ticketService } from "@/services";

const columns: Column<any>[] = [
  { key: "ticketNumber", header: "Ticket #", sortValue: r => r.ticketNumber, cell: r => <span className="font-medium">{r.ticketNumber}</span> },
  { key: "subject", header: "Subject", sortValue: r => r.subject, cell: r => r.subject },
  { key: "customer", header: "Customer", sortValue: r => r.customer, cell: r => r.customer },
  { key: "priority", header: "Priority", sortValue: r => r.priority, cell: r => <Badge tone={r.priority === "urgent" ? "danger" : r.priority === "high" ? "warning" : "info"}>{r.priority}</Badge> },
  { key: "assignedTo", header: "Assigned To", cell: r => r.assignedTo },
  { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge> },
];

export default function HelpdeskPage() {
  return (
    <CrudPage
      title="Helpdesk Tickets"
      description="Customer inquiries, support SLAs, and issue triage."
      service={ticketService as any}
      columns={columns}
      searchKeys={["ticketNumber", "subject", "customer", "assignedTo"]}
      emptyTitle="No tickets"
      createDefault={() => ({
        ticketNumber: "TKT-" + Math.floor(Math.random() * 9000 + 1000),
        subject: "",
        customer: "",
        priority: "medium",
        assignedTo: "Support Agent",
        status: "open",
        description: "",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Ticket Number" required><Input value={v.ticketNumber} onChange={e => set({ ...v, ticketNumber: e.target.value })} /></Field>
          <Field label="Customer" required><Input value={v.customer} onChange={e => set({ ...v, customer: e.target.value })} /></Field>
          <Field label="Subject" required><Input value={v.subject} onChange={e => set({ ...v, subject: e.target.value })} /></Field>
          <Field label="Assigned To" required><Input value={v.assignedTo} onChange={e => set({ ...v, assignedTo: e.target.value })} /></Field>
          <Field label="Priority">
            <Select value={v.priority} onChange={e => set({ ...v, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Ticket Details"><Textarea value={v.description} onChange={e => set({ ...v, description: e.target.value })} /></Field>
          </div>
        </div>
      )}
    />
  );
}
