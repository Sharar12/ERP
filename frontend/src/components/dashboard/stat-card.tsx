import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, delta, icon: Icon, tone = "accent" }: {
  label: string; value: string; delta?: number; icon: LucideIcon;
  tone?: "accent" | "success" | "warning" | "danger";
}) {
  const tones = {
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  };
  return (
    <Card className="group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </span>
          <Icon className={cn("h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110", tones[tone])} />
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="text-2xl font-semibold tracking-tight text-mono-num">{value}</span>
          {delta !== undefined && (
            <span className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-medium text-mono-num",
              delta >= 0 ? "text-success" : "text-destructive"
            )}>
              {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
