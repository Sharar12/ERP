"use client";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./modal";
import { Button } from "./button";

export function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Confirm", destructive }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title?: string; description?: string; confirmLabel?: string; destructive?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={destructive ? "destructive" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </>}>
      <div className="flex gap-3">
        <div className="rounded-full bg-warning/10 p-2 text-warning"><AlertTriangle className="h-4 w-4" /></div>
        <p className="text-sm text-muted-foreground">{description ?? "This action cannot be undone."}</p>
      </div>
    </Modal>
  );
}

