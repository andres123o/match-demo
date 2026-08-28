"use client";

import { useRef, useState } from "react";
import { FileCheck2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileDrop({
  id,
  file,
  accept,
  hint,
  error,
  onChange,
}: {
  id: string;
  file: File | null;
  accept: string;
  hint: string;
  error?: string;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) onChange(dropped);
        }}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3 text-sm transition-colors",
          isDragging ? "border-primary bg-secondary" : "border-border hover:bg-muted/60",
          error && "border-destructive/60"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", file ? "bg-accent text-brand-teal" : "bg-secondary text-primary")}>
            {file ? <FileCheck2 className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{file ? file.name : "Arrastra un archivo o haz clic para subirlo"}</p>
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          </div>
        </div>
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
