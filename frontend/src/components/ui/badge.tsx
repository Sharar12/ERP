import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "info" | "muted";
const tones: Record<Tone, string> = {
  default: "bg-muted text-foreground/70 ring-1 ring-inset ring-border",
  success: "bg-success/8 text-success ring-1 ring-inset ring-success/20",
  warning: "bg-warning/8 text-warning ring-1 ring-inset ring-warning/20",
  danger:  "bg-destructive/8 text-destructive ring-1 ring-inset ring-destructive/20",
  info:    "bg-accent/8 text-accent ring-1 ring-inset ring-accent/20",
  muted:   "bg-muted text-muted-foreground",
};

export function Badge({ tone = "default", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-1.5 py-0 text-[11px] font-medium capitalize",
      "transition-transform duration-150 ease-out hover:scale-105",
      tones[tone], className
    )}>
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const map: Record<string, Tone> = {
    active: "success", paid: "success", completed: "success", won: "success", fulfilled: "success", received: "success",
    pending: "warning", sent: "info", confirmed: "info", qualified: "info", proposal: "warning", on_hold: "warning", on_leave: "warning",
    overdue: "danger", inactive: "muted", cancelled: "danger", lost: "danger", terminated: "danger", draft: "muted", new: "info", contacted: "warning", planning: "info", discontinued: "danger", lead: "info",
  };
  return map[status] ?? "default";
}
