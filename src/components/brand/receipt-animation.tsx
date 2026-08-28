"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { UserRound } from "lucide-react";

const FORMULARIO_MS = 5400;
const EXITO_MS = 3400;

const CAMPOS = [
  { ancho: "92%", delay: 0.9 },
  { ancho: "70%", delay: 1.5 },
  { ancho: "55%", delay: 2.1 },
];

const RADIO_ANILLO = 42;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO_ANILLO;
const LARGO_TRAZO_CHECK = 32;

// Curva "easeOutExpo": arranque rápido y asentamiento suave, el estándar en
// micro-interacciones premium (Stripe, Linear, Apple) — nada de rebote.
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

const ICONO_VARIANTS = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_PREMIUM } },
  // Lo que "sale de pantalla grande" es el ícono: se agranda y se desvanece.
  exit: { opacity: 0, scale: 2.6, transition: { duration: 0.7, ease: "easeIn" } },
} as const;

/**
 * Escena decorativa del panel de inicio: alguien completa su registro, el
 * sistema lo valida (barrido) y confirma con un ícono animado. Todo flota
 * directamente sobre el fondo del panel (sin tarjeta contenedora), sin
 * gradientes ni blur: solo formas y colores planos de marca, a escala grande.
 */
export function ReceiptAnimation() {
  const [fase, setFase] = useState<"formulario" | "exito">("formulario");

  useEffect(() => {
    const ms = fase === "formulario" ? FORMULARIO_MS : EXITO_MS;
    const id = setTimeout(() => {
      setFase((f) => (f === "formulario" ? "exito" : "formulario"));
    }, ms);
    return () => clearTimeout(id);
  }, [fase]);

  return (
    <div className="relative h-80 w-full max-w-sm">
      <AnimatePresence mode="wait">
        {fase === "formulario" ? (
          <motion.div
            key="formulario"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-xs">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-violet">
                  <UserRound className="h-7 w-7 text-white" />
                </div>
                <div className="h-3 w-44 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-brand-violet"
                    initial={{ width: "0%" }}
                    animate={{ width: "70%" }}
                    transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {CAMPOS.map((campo, i) => (
                  <div key={i} className="h-3 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-brand-teal"
                      initial={{ width: "0%" }}
                      animate={{ width: campo.ancho }}
                      transition={{ delay: campo.delay, duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-brand-teal"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 2.9, duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <motion.div
                className="pointer-events-none absolute inset-x-0 h-0.5 bg-brand-violet"
                initial={{ top: "0%", opacity: 0 }}
                animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ delay: 3.9, duration: 1.1, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="exito" className="absolute inset-0 flex items-center justify-center">
            <motion.div className="relative flex h-28 w-28 items-center justify-center" variants={ICONO_VARIANTS} initial="initial" animate="animate" exit="exit">
              {/* Anillo de progreso: se dibuja a sí mismo, como una validación completándose */}
              <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx={48} cy={48} r={RADIO_ANILLO} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2.5} />
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

              {/* Pulso único al confirmar (no en loop, para que se sienta preciso, no "parpadeante") */}
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
                {/* El check no aparece: se dibuja, trazo por trazo */}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
