"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Badge, statusTone } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { projectService, taskService, milestoneService, timeEntryService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Project } from "@/types";

const taskCols: Column<any>[] = [
  { key: "title", header: "Task", cell: r => <span className="font-medium">{r.title}</span> },
  { key: "assignee", header: "Assignee", cell: r => r.assignee },
  { key: "priority", header: "Priority", cell: r => <Badge tone={r.priority === "high" ? "danger" : r.priority === "medium" ? "warning" : "info"}>{r.priority}</Badge> },
  { key: "status", header: "Status", cell: r => <Badge tone={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge> },
  { key: "due", header: "Due", cell: r => r.dueDate },
];
const msCols: Column<any>[] = [
  { key: "name", header: "Milestone", cell: r => r.name },
  { key: "dueDate", header: "Due", cell: r => formatDate(r.dueDate) },
  { key: "completed", header: "Done", cell: r => <Badge tone={r.completed ? "success" : "warning"}>{r.completed ? "yes" : "no"}</Badge> },
];
const teCols: Column<any>[] = [
  { key: "date", header: "Date", cell: r => formatDate(r.date) },
  { key: "employee", header: "Employee", cell: r => r.employeeId },
  { key: "hours", header: "Hours", cell: r => r.hours },
  { key: "description", header: "Description", cell: r => r.description },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [time, setTime] = useState<any[]>([]);

  useEffect(() => {
    projectService.getById(params.id as string).then(setProject);
    taskService.getAll().then(all => setTasks(all.filter((x: any) => x.projectId === params.id)));
    milestoneService.getAll().then(all => setMilestones(all.filter((x: any) => x.projectId === params.id)));
    timeEntryService.getAll().then(all => setTime(all.filter((x: any) => x.projectId === params.id)));
  }, [params.id]);

  if (!project) return null;

  return (
    <div>
      <PageHeader title={project.name} description={`${project.code} · ${project.clientName}`}
        actions={<Badge tone={statusTone(project.status)}>{project.status.replace("_", " ")}</Badge>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Client" v={project.clientName} />
            <Row k="Start" v={formatDate(project.startDate)} />
            <Row k="End" v={formatDate(project.endDate)} />
            <Row k="Budget" v={formatCurrency(project.budget)} />
            <Row k="Spent" v={formatCurrency(project.spent)} />
            <div className="pt-2">
              <div className="flex justify-between text-xs"><span>Progress</span><span>{project.progress}%</span></div>
              <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} /></div>
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <Tabs tabs={[
            { key: "tasks", label: `Tasks (${tasks.length})`, content: <DataTable data={tasks} columns={taskCols} searchKeys={["title", "assignee", "status"]} /> },
            { key: "ms", label: `Milestones (${milestones.length})`, content: <DataTable data={milestones} columns={msCols} searchKeys={["name"]} /> },
            { key: "time", label: `Time (${time.length})`, content: <DataTable data={time} columns={teCols} searchKeys={["description"]} /> },
            { key: "gantt", label: "Timeline", content: (
              <Card><CardContent>
                <div className="text-xs text-muted-foreground mb-2">Simplified Gantt</div>
                <div className="space-y-2">
                  {milestones.map((m, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs"><span>{m.name}</span><span>{m.dueDate}</span></div>
                      <div className="mt-1 h-3 rounded bg-muted"><div className={`h-full rounded ${m.completed ? "bg-success" : "bg-accent"}`} style={{ width: `${m.completed ? 100 : 50}%` }} /></div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            ) },
          ]} />
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b border-border py-1.5 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

