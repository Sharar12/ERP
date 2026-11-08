import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export function ErrorState({ title = "Something went wrong", description, onRetry }: {
  title?: string; description?: string; onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-3"><AlertCircle className="h-6 w-6 text-destructive" /></div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      {onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Retry</Button>}
    </div>
  );
}

