"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PackageCheck, ShieldAlert, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { listCampanas, listEntregas, listInfluencers } from "@/lib/store";
import type { Campana, Entrega, Influencer } from "@/lib/types";

export default function AdminResumenPage() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [campanas, setCampanas] = useState<Campana[]>([]);

  useEffect(() => {
    listInfluencers().then(setInfluencers);
    listEntregas().then(setEntregas);
    listCampanas().then(setCampanas);
  }, []);

  const nombre = (id: string) => influencers.find((i) => i.id === id)?.nombreCompleto ?? "—";
  const campana = (id: string) => campanas.find((c) => c.id === id);

  const actividad = [...entregas].sort((a, b) => (a.enviadoEn < b.enviadoEn ? 1 : -1)).slice(0, 8);

  const stats = [
    { label: "Influenciadores", valor: influencers.length, icon: Users },
    { label: "En revisión", valor: influencers.filter((i) => i.estado === "PENDIENTE_REVISION").length, icon: ShieldAlert },
    { label: "Entregas pendientes", valor: entregas.filter((e) => e.estado === "PENDIENTE").length, icon: PackageCheck },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Resumen</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <s.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-heading text-lg font-semibold text-foreground">{s.valor}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-4 font-heading text-sm font-semibold text-foreground">Actividad reciente</p>
          <div className="space-y-1">
            {actividad.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => router.push("/admin/entregas")}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-sm hover:bg-muted/60"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {campana(e.campanaId) ? `${campana(e.campanaId)!.marca} · ${campana(e.campanaId)!.nombre}` : e.numeroFactura}
                  </p>
                  <p className="text-xs text-muted-foreground">{nombre(e.influencerId)}</p>
                </div>
                <StatusBadge estado={e.estado} />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
