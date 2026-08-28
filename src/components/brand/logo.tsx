import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * El lockup oficial (public/brand/match-agency-logo.svg) tiene el wordmark
 * en blanco -> solo se lee sobre fondos oscuros. Sobre superficies claras lo
 * envolvemos en una píldora tinta (--color-brand-ink) para no alterar los
 * colores de marca.
 */
export function Logo({ className, variant = "onLight" }: { className?: string; variant?: "onLight" | "onDark" }) {
  if (variant === "onDark") {
    return (
      <Image
        src="/brand/match-agency-logo.svg"
        alt="Match Agency"
        width={150}
        height={47}
        className={cn("h-8 w-auto", className)}
        priority
      />
    );
  }

  return (
    <div className={cn("inline-flex items-center rounded-xl bg-brand-ink px-3 py-2", className)}>
      <Image src="/brand/match-agency-logo.svg" alt="Match Agency" width={150} height={47} className="h-6 w-auto" priority />
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return <Image src="/brand/match-agency-icon.svg" alt="" width={40} height={28} className={cn("h-6 w-auto", className)} />;
}
