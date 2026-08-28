"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  className,
  indicatorClassName = "bg-primary",
  activeLabelClassName = "text-primary-foreground",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
  className?: string;
  indicatorClassName?: string;
  activeLabelClassName?: string;
}) {
  return (
    <div className={cn("flex rounded-full border border-border bg-muted/50 p-1", className)}>
      {options.map((option) => {
        const activo = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={activo}
            onClick={() => onChange(option.value)}
            className="relative flex-1 rounded-full px-5 py-2 text-sm font-medium transition-colors"
          >
            {activo && (
              <motion.span
                layoutId={layoutId}
                className={cn("absolute inset-0 rounded-full shadow-sm", indicatorClassName)}
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            )}
            <span className={cn("relative z-10", activo ? activeLabelClassName : "text-muted-foreground")}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
