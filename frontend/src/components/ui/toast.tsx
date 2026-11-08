"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
interface ToastItem { id: number; message: string; tone: ToastTone; }
interface ToastCtx { push: (message: string, tone?: ToastTone) => void; }

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {toasts.map(t => {
          const Icon = t.tone === "success" ? CheckCircle2 : t.tone === "error" ? XCircle : Info;
          return (
            <div key={t.id} className={cn(
              "pointer-events-auto flex items-start gap-2 rounded-lg border bg-card p-3 text-sm shadow-lg",
              "animate-slide-in-right",
              t.tone === "success" && "border-success/40",
              t.tone === "error" && "border-destructive/40",
              t.tone === "info" && "border-border"
            )}>
              <Icon className={cn("h-4 w-4 shrink-0 mt-0.5",
                t.tone === "success" && "text-success",
                t.tone === "error" && "text-destructive",
                t.tone === "info" && "text-accent")} />
              <span className="flex-1">{t.message}</span>
              <button onClick={() => setToasts(x => x.filter(i => i.id !== t.id))} className="hover:rotate-90 transition-transform duration-200">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

