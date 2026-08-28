"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export function WizardShell({
  steps,
  currentIndex,
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continuar",
  isSubmitting,
  children,
}: {
  steps: WizardStep[];
  currentIndex: number;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
  children: React.ReactNode;
}) {
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Paso {currentIndex + 1} de {steps.length}
          </span>
          <span>{steps[currentIndex].title}</span>
        </div>
        <Progress value={progress} className="h-1.5" />

        <ol className="mt-5 hidden gap-2 sm:flex">
          {steps.map((step, index) => {
            const estado = index < currentIndex ? "hecho" : index === currentIndex ? "actual" : "pendiente";
            return (
              <li key={step.id} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
                    estado === "hecho" && "bg-primary text-primary-foreground",
                    estado === "actual" && "border-2 border-primary text-primary",
                    estado === "pendiente" && "border border-border text-muted-foreground"
                  )}
                >
                  {estado === "hecho" ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className={cn("truncate text-xs", estado === "pendiente" ? "text-muted-foreground" : "text-foreground")}>
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">{steps[currentIndex].title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{steps[currentIndex].description}</p>
        </div>

        {children}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={onBack} disabled={currentIndex === 0 || isSubmitting}>
            Atrás
          </Button>
          <Button type="button" onClick={onNext} disabled={nextDisabled || isSubmitting}>
            {isSubmitting ? "Enviando..." : nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
