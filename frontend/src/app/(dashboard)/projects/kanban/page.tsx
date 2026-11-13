"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { taskService } from "@/services";

const COLS = ["todo", "in_progress", "in_review", "done"];

export default function ProjectKanban() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [drag, setDrag] = useState<any>(null);
  const load = () => taskService.getAll().then(setTasks);
  useEffect(() => { load(); }, []);
  const move = async (id: string, status: string) => { await taskService.update(id, { status }); load(); };

  return (
    <div>
      <PageHeader title="Kanban Board" description="Drag tasks to update status." />
      <div className="grid gap-3 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${COLS.length}, minmax(240px, 1fr))` }}>
        {COLS.map(col => (
          <div key={col} onDragOver={e => e.preventDefault()} onDrop={() => { if (drag) { move(drag.id, col); setDrag(null); } }}
            className="rounded-xl border border-border bg-muted/30 p-2 transition-colors duration-200">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-sm font-medium capitalize">{col.replace("_", " ")}</span>
              <Badge tone="muted">{tasks.filter(t => t.status === col).length}</Badge>
            </div>
            <div className="space-y-2">
              {tasks.filter(t => t.status === col).map(t => (
                <div key={t.id} draggable onDragStart={() => setDrag(t)}
                  className="cursor-grab rounded-lg border border-border bg-card p-2.5 text-sm shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 hover:border-accent/30 active:cursor-grabbing active:scale-[0.98]">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.assignee}</div>
                  <Badge tone={t.priority === "high" ? "danger" : t.priority === "medium" ? "warning" : "info"}>{t.priority}</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

