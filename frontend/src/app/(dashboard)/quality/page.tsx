"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_INSPECTIONS, MOCK_NCRS } from "@/mock-data/extended-seed";
import Link from "next/link";
import { ShieldCheck, AlertOctagon, CheckCircle2 } from "lucide-react";

export default function QualityDashboardPage() {
  const passed = MOCK_INSPECTIONS.filter(i => i.result === "passed").length;
  const failed = MOCK_INSPECTIONS.filter(i => i.result === "failed").length;
  const openNcrs = MOCK_NCRS.filter(n => n.status !== "closed").length;

  return (
    <div>
      <PageHeader title="Quality Management" description="QA inspections, non-conformance reports, and compliance tracking." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent><div className="text-xs text-muted-foreground">Total Inspections</div><div className="mt-1 text-2xl font-semibold">{MOCK_INSPECTIONS.length}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Passed</div><div className="mt-1 text-2xl font-semibold text-success">{passed}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Failed Inspections</div><div className="mt-1 text-2xl font-semibold text-destructive">{failed}</div></CardContent></Card>
        <Card><CardContent><div className="text-xs text-muted-foreground">Open NCRs</div><div className="mt-1 text-2xl font-semibold text-warning">{openNcrs}</div></CardContent></Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent Non-Conformance Reports (NCR)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOCK_NCRS.map(ncr => (
                <div key={ncr.id} className="rounded-lg border border-border p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{ncr.number}: {ncr.rootCause}</div>
                    <div className="text-xs text-muted-foreground">{ncr.severity.toUpperCase()} · Related: {ncr.related}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded capitalize ${ncr.status === "closed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{ncr.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Link href="/quality/inspections" className="block rounded-lg border border-border p-2 text-sm hover:bg-muted">→ Quality Inspections</Link>
            <Link href="/quality/ncrs" className="block rounded-lg border border-border p-2 text-sm hover:bg-muted">→ Non-Conformance Reports (NCR)</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
