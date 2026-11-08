"use client";
import { Upload } from "lucide-react";
import { useState } from "react";

export function FileUpload({ label = "Upload files", accept, multiple }: {
  label?: string; accept?: string; multiple?: boolean;
}) {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center hover:bg-muted/40">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={e => setFiles(Array.from(e.target.files ?? []).map(f => f.name))}
        />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs">
          {files.map(f => <li key={f} className="rounded bg-muted px-2 py-1">{f}</li>)}
        </ul>
      )}
    </div>
  );
}

