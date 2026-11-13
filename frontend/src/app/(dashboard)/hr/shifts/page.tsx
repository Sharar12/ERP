"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { shiftService } from "@/services";

export default function ShiftsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { shiftService.getAll().then(setRows).catch(() => setRows([])); }, []);
  return (
    <div>
      <PageHeader title="Shift Management" description="Rosters and work schedules." />
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map(s => (
          <Card key={s.id}><CardContent>
            <div className="font-semibold">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.days ?? "Mon - Fri"}</div>
            <div className="mt-2 text-lg">{s.start ?? s.start_time ?? "09:00"} – {s.end ?? s.end_time ?? "17:00"}</div>
            <div className="text-xs text-muted-foreground">{s.employees ?? (s.break_minutes ? `Break: ${s.break_minutes}m` : "Active")}</div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
