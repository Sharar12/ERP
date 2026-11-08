"use client";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/tables/data-table";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { leaveService } from "@/services/mock/extended";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function LeavesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const toast = useToast();
  const load = async () => setRows(await leaveService.getAll());
  useEffect(() => { load(); }, []);
  const approve = async (id: string) => { await leaveService.update(id, { status: "approved" }); toast.push("Approved", "success"); load(); };
  const reject = async (id: string) => { await leaveService.update(id, { status: "rejected" }); toast.push("Rejected", "info"); load(); };

  const columns: Column<any>[] = [
    { key: "name", header: "Employee", cell: r => r.employeeName },
    { key: "type", header: "Type", cell: r => r.type },
    { key: "from", header: "From", cell: r => formatDate(r.from) },
    { key: "to", header: "To", cell: r => formatDate(r.to) },
    { key: "days", header: "Days", cell: r => r.days },
    { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ];
  return (
    <div>
      <PageHeader title="Leave Requests" description="Approve or reject time off requests." />
      <DataTable data={rows} columns={columns} searchKeys={["employeeName", "type", "status"]}
        rowActions={r => r.status === "pending" ? (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => approve(r.id)}><Check className="h-3.5 w-3.5 text-success" /></Button>
            <Button variant="ghost" size="icon" onClick={() => reject(r.id)}><X className="h-3.5 w-3.5 text-destructive" /></Button>
          </div>
        ) : null}
      />
    </div>
  );
}

