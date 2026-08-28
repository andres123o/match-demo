"use client";

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CampanaStatusBadge } from "@/components/shared/campana-status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useSession } from "@/hooks/use-session";
import { listCampanas } from "@/lib/store";
import type { Campana } from "@/lib/types";

export default function CampanasPage() {
  const { sesion } = useSession();
  const [campanas, setCampanas] = useState<Campana[]>([]);

  useEffect(() => {
    if (!sesion?.influencerId) return;
    listCampanas({ influencerId: sesion.influencerId }).then(setCampanas);
  }, [sesion?.influencerId]);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Campañas</h1>

      {campanas.length === 0 ? (
        <EmptyState icon={Briefcase} title="Aún no tienes campañas asignadas" description="Cuando Match te asigne una, aparecerá aquí." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campanas.map((c) => (
            <Card key={c.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{c.marca}</p>
                    <p className="font-heading text-base font-semibold text-foreground">{c.nombre}</p>
                  </div>
                  <CampanaStatusBadge estado={c.estado} />
                </div>
                {c.descripcion && <p className="text-sm text-muted-foreground">{c.descripcion}</p>}
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Monto acordado</span>
                  <span className="font-medium text-foreground">
                    {c.montoAcordado.toLocaleString("es-CO")} {c.moneda}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Inicio</span>
                  <span className="text-foreground">{new Date(c.fechaInicio).toLocaleDateString("es-CO")}</span>
                </div>
                {c.fechaEntrega && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Entrega</span>
                    <span className="text-foreground">{new Date(c.fechaEntrega).toLocaleDateString("es-CO")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
