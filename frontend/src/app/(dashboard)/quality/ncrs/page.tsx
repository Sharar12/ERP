"use client";
import { CrudPage } from "@/components/common/crud-page";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge, statusTone } from "@/components/ui/badge";
import type { Column } from "@/components/tables/data-table";
import { ncrService } from "@/services";

const columns: Column<any>[] = [
  { key: "ncrNumber", header: "NCR #", sortValue: r => r.ncrNumber, cell: r => <span className="font-medium">{r.ncrNumber}</span> },
  { key: "title", header: "Title", sortValue: r => r.title, cell: r => r.title },
  { key: "severity", header: "Severity", sortValue: r => r.severity, cell: r => <Badge tone={r.severity === "critical" ? "danger" : r.severity === "major" ? "warning" : "info"}>{r.severity}</Badge> },
  { key: "reportedBy", header: "Reported By", cell: r => r.reportedBy },
  { key: "status", header: "Status", sortValue: r => r.status, cell: r => <Badge tone={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge> },
];

export default function NcrsPage() {
  return (
    <CrudPage
      title="Non-Conformance Reports (NCR)"
      description="Quality deviations, defects triage, root cause analysis, and CAPA."
      service={ncrService as any}
      columns={columns}
      searchKeys={["ncrNumber", "title", "reportedBy"]}
      emptyTitle="No NCR reports"
      createDefault={() => ({
        ncrNumber: "NCR-" + Math.floor(Math.random() * 9000 + 1000),
        title: "",
        severity: "minor",
        reportedBy: "QA Lead",
        status: "open",
        description: "",
      })}
      renderForm={(v, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="NCR Number" required><Input value={v.ncrNumber} onChange={e => set({ ...v, ncrNumber: e.target.value })} /></Field>
          <Field label="Summary / Title" required><Input value={v.title} onChange={e => set({ ...v, title: e.target.value })} /></Field>
          <Field label="Severity">
            <Select value={v.severity} onChange={e => set({ ...v, severity: e.target.value })}>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </Select>
          </Field>
          <Field label="Reported By" required><Input value={v.reportedBy} onChange={e => set({ ...v, reportedBy: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={v.status} onChange={e => set({ ...v, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="capa_pending">CAPA Pending</option>
              <option value="closed">Closed</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Defect Details"><Textarea value={v.description} onChange={e => set({ ...v, description: e.target.value })} /></Field>
          </div>
        </div>
      )}
    />
  );
}
