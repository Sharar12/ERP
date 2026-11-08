"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { leadService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import type { Lead } from "@/types";

const STAGES = ["new", "contacted", "qualified", "proposal", "won", "lost"];

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dragging, setDragging] = useState<Lead | null>(null);

  const load = async () => setLeads(await leadService.getAll());
  useEffect(() => { load(); }, []);

  const move = async (id: string, status: any) => {
    /* MOCK CRUD — API REPLACEMENT: PATCH /api/v1/crm/leads/{id} */
    await leadService.update(id, { status });
    load();
  };

  return (
    <div>
      <PageHeader title="Sales Pipeline" description="Drag leads across stages to progress the funnel." />
      <div className="grid gap-3 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(240px, 1fr))` }}>
        {STAGES.map(stage => (
          <div key={stage}
            onDragOver={e => e.preventDefault()}
            onDrop={() => { if (dragging) { move(dragging.id, stage); setDragging(null); } }}
            className="rounded-xl border border-border bg-muted/30 p-2 transition-colors duration-200">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-sm font-medium capitalize">{stage}</span>
              <Badge tone="muted">{leads.filter(l => l.status === stage).length}</Badge>
            </div>
            <div className="space-y-2">
              {leads.filter(l => l.status === stage).map(l => (
                <div key={l.id} draggable
                  onDragStart={() => setDragging(l)}
                  className="cursor-grab rounded-lg border border-border bg-card p-2.5 text-sm shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 hover:border-accent/30 active:cursor-grabbing active:scale-[0.98]">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.company}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs">{formatCurrency(l.value)}</span>
                    <Badge tone="info">{l.source}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

