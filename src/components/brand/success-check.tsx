"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const RADIO_ANILLO = 42;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO_ANILLO;
const LARGO_TRAZO_CHECK = 32;

// Curva "easeOutExpo": mismo lenguaje de movimiento premium usado en el
// panel de inicio de sesión (sin rebote).
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

/**
 * El mismo efecto de éxito del login (anillo que se dibuja + check trazado),
 * ajustado para fondos claros. Se usa como confirmación real tras un envío,
 * no como loop decorativo.
 */
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-28 w-28 items-center justify-center", className)}>
      <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx={48} cy={48} r={RADIO_ANILLO} fill="none" stroke="rgba(21,9,31,0.08)" strokeWidth={2.5} />
        <motion.circle
          cx={48}
          cy={48}
          r={RADIO_ANILLO}
          fill="none"
          stroke="#33CCCC"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          initial={{ strokeDashoffset: CIRCUNFERENCIA }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.85, ease: EASE_PREMIUM }}
        />
      </svg>

      <motion.span
        className="absolute h-16 w-16 rounded-full border border-brand-teal"
        initial={{ opacity: 0.6, scale: 0.8 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.8 }}
      />

      <motion.div
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_PREMIUM, delay: 0.5 }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8">
          <motion.path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="#15091F"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={LARGO_TRAZO_CHECK}
            initial={{ strokeDashoffset: LARGO_TRAZO_CHECK }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.8 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
