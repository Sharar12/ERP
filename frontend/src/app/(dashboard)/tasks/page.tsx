"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/tables/data-table";
import { taskService } from "@/services";
import { formatDate } from "@/lib/utils";

const columns: Column<any>[] = [
  { key: "title", header: "Task", cell: r => <span className="font-medium">{r.title}</span> },
  { key: "assignee", header: "Assignee", cell: r => r.assignee },
  { key: "priority", header: "Priority", cell: r => <Badge tone={r.priority === "high" ? "danger" : r.priority === "medium" ? "warning" : "info"}>{r.priority}</Badge> },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{(r.status || "todo").replace("_", " ")}</Badge> },
  { key: "due", header: "Due", sortValue: r => r.dueDate, cell: r => r.dueDate },
];

export default function TasksPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { taskService.getAll().then(setRows); }, []);
  const byDay = new Map<string, any[]>();
  rows.forEach(r => { if (!byDay.has(r.dueDate)) byDay.set(r.dueDate, []); byDay.get(r.dueDate)!.push(r); });

  return (
    <div>
      <PageHeader title="Tasks" description="My work, team workload and views."
        actions={<Link href="/projects/kanban"><Button variant="outline" size="sm">Kanban View</Button></Link>} />
      <Tabs tabs={[
        { key: "list", label: "List", content: <DataTable data={rows} columns={columns} searchKeys={["title", "assignee", "status"]} /> },
        { key: "board", label: "Board", content: (
          <div className="grid gap-3 md:grid-cols-4">
            {["todo", "in_progress", "in_review", "done"].map(s => (
              <Card key={s}><CardContent>
                <div className="mb-2 text-sm font-medium capitalize">{s.replace("_", " ")}</div>
                {rows.filter(r => r.status === s).map(r => (
                  <div key={r.id} className="mb-2 cursor-grab rounded-lg border border-border bg-card p-2 text-sm shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 hover:border-accent/30 active:cursor-grabbing active:scale-[0.98]">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.assignee}</div>
                  </div>
                ))}
              </CardContent></Card>
            ))}
          </div>
        ) },
        { key: "calendar", label: "Calendar", content: (
          <Card><CardContent>
            <div className="space-y-3">
              {Array.from(byDay.entries()).map(([date, items]) => (
                <div key={date}>
                  <div className="text-xs font-semibold text-muted-foreground">{date}</div>
                  <div className="mt-1 space-y-1">
                    {items.map(t => (
                      <div key={t.id} className="flex items-center justify-between rounded border border-border p-2 text-sm">
                        <span>{t.title}</span>
                        <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        ) },
      ]} />
    </div>
  );
}

