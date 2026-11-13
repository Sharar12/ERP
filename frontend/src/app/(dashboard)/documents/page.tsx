"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { documentService } from "@/services";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "name", header: "Document", cell: r => <span className="font-medium">{r.name}</span> },
  { key: "folder", header: "Folder", cell: r => <Badge tone="info">{r.folder}</Badge> },
  { key: "size", header: "Size", cell: r => r.size },
  { key: "version", header: "Version", cell: r => `v${r.version}` },
  { key: "owner", header: "Owner", cell: r => r.owner },
  { key: "updated", header: "Updated", sortValue: r => r.updatedAt, cell: r => formatDate(r.updatedAt) },
];

export default function DocumentsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { documentService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Documents" description="Central file repository and version management." />
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent><FileUpload label="Drop documents here to upload" multiple /></CardContent>
        </Card>
        <div className="lg:col-span-3">
          <DataTable data={rows} columns={columns} searchKeys={["name", "folder", "owner"]}
            filters={[{ key: "folder", label: "Folder", options: ["Finance", "HR", "Inventory", "Purchases", "CRM"], get: r => r.folder }]} />
        </div>
      </div>
    </div>
  );
}

