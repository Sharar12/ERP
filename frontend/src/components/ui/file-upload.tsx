// File Location: frontend/src/components/ui/file-upload.tsx
// Purpose: Drag-and-Drop File Upload Area with Validation and File List

'use client';

import * as React from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  label,
  accept,
  multiple = false,
  maxSizeMB = 10,
  files = [],
  onFilesChange,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = React.useState<File[]>(files);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const activeFiles = files.length > 0 ? files : internalFiles;

  const handleIncoming = (incoming: FileList | null) => {
    if (!incoming) return;
    setError(null);
    const valid: File[] = [];

    Array.from(incoming).forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the ${maxSizeMB}MB size limit.`);
      } else {
        valid.push(file);
      }
    });

    const next = multiple ? [...activeFiles, ...valid] : valid.slice(0, 1);
    setInternalFiles(next);
    onFilesChange?.(next);
  };

  const removeFile = (index: number) => {
    const next = activeFiles.filter((_, i) => i !== index);
    setInternalFiles(next);
    onFilesChange?.(next);
  };

  return (
    <div className={cn('space-y-2.5', className)}>
      {label && <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleIncoming(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 text-center transition-all',
          dragging
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30'
            : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40'
        )}
      >
        <div className="mb-2.5 rounded-full bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <UploadCloud className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {accept ? `Accepted: ${accept}` : 'Any document or image'} (Max {maxSizeMB}MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleIncoming(e.target.files)}
        />
      </div>

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

      {activeFiles.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {activeFiles.map((file, idx) => (
            <li key={`${file.name}-${idx}`} className="flex items-center justify-between px-3.5 py-2.5 text-sm">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="h-4 w-4 shrink-0 text-indigo-500" />
                <span className="truncate font-medium text-slate-700 dark:text-slate-200">{file.name}</span>
                <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
