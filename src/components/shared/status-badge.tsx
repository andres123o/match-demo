import { cn } from "@/lib/utils";
import type { EstadoSolicitud } from "@/lib/types";

const ESTILOS: Record<EstadoSolicitud, string> = {
  PENDIENTE: "bg-[#FFF2E2] text-[#8A5A1E] border border-[#FFE1BC]",
  APROBADA: "bg-[#E9FBF8] text-[#0F6B63] border border-[#C8F5ED]",
  RECHAZADA: "bg-[#FBEBEC] text-[#9A2F35] border border-[#F3D3D5]",
};

const ETIQUETAS: Record<EstadoSolicitud, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
};

export function StatusBadge({ estado, className }: { estado: EstadoSolicitud; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        ESTILOS[estado],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ETIQUETAS[estado]}
    </span>
  );
}
