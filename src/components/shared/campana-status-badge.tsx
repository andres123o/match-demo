import { cn } from "@/lib/utils";
import type { EstadoCampana } from "@/lib/types";

const ESTILOS: Record<EstadoCampana, string> = {
  ACTIVA: "bg-[#E9FBF8] text-[#0F6B63] border border-[#C8F5ED]",
  EN_REVISION: "bg-[#FFF2E2] text-[#8A5A1E] border border-[#FFE1BC]",
  COMPLETADA: "bg-secondary text-primary border border-border",
  CANCELADA: "bg-[#FBEBEC] text-[#9A2F35] border border-[#F3D3D5]",
};

const ETIQUETAS: Record<EstadoCampana, string> = {
  ACTIVA: "Activa",
  EN_REVISION: "En revisión",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export function CampanaStatusBadge({ estado, className }: { estado: EstadoCampana; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", ESTILOS[estado], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ETIQUETAS[estado]}
    </span>
  );
}
