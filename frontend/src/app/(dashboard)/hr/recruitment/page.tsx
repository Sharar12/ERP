"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { jobService } from "@/services/mock/extended";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "title", header: "Role", cell: r => <span className="font-medium">{r.title}</span> },
  { key: "dept", header: "Department", cell: r => r.department },
  { key: "loc", header: "Location", cell: r => r.location },
  { key: "app", header: "Applicants", cell: r => r.applicants },
  { key: "posted", header: "Posted", cell: r => formatDate(r.postedAt) },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

export default function RecruitmentPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { jobService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Recruitment" description="Open roles and applications." />
      <DataTable data={rows} columns={columns} searchKeys={["title", "department", "status"]} />
    </div>
  );
}

