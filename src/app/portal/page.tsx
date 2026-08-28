"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, AtSign, Briefcase, PackageCheck, ShieldCheck, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { useSession } from "@/hooks/use-session";
import { getInfluencer, listEntregas } from "@/lib/store";
import type { Entrega, Influencer } from "@/lib/types";

export default function PortalResumenPage() {
  const { sesion } = useSession();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  useEffect(() => {
    if (!sesion?.influencerId) return;
    getInfluencer(sesion.influencerId).then((i) => setInfluencer(i ?? null));
    listEntregas({ influencerId: sesion.influencerId }).then(setEntregas);
  }, [sesion?.influencerId]);

  const pendientes = entregas.filter((e) => e.estado === "PENDIENTE").length;

  const stats = [
    { icon: ShieldCheck, label: "Estado del perfil", valor: influencer?.estado === "ACTIVO" ? "Activo" : "En revisión" },
    { icon: PackageCheck, label: "Entregas pendientes", valor: pendientes },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Hola, {sesion?.nombre?.split(" ")[0]}</h1>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
                {influencer?.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={influencer.fotoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </span>
              <p className="font-heading text-sm font-semibold text-foreground">Mi perfil</p>
              {influencer && <StatusBadge estado={influencer.estado === "ACTIVO" ? "APROBADA" : "PENDIENTE"} className="ml-auto" />}
            </div>
            {influencer ? (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Nombre</p>
                    <p className="text-sm font-medium text-foreground">{influencer.nombreCompleto}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Representación</p>
                    <p className="text-sm font-medium capitalize text-foreground">{influencer.representacion.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Categorías</p>
                    <p className="text-sm font-medium text-foreground">{influencer.categorias.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nichos</p>
                    <p className="text-sm font-medium text-foreground">{influencer.nichos.join(", ")}</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {influencer.redesSociales.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-foreground">
                        <AtSign className="h-4 w-4 text-primary" />
                        {r.usuario}
                      </span>
                      <span className="text-muted-foreground">{r.seguidores.toLocaleString("es-CO")} seguidores</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Cargando perfil...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="font-heading text-sm font-semibold text-foreground">Acciones rápidas</p>
            <Button asChild className="w-full justify-between">
              <Link href="/portal/entregas">
                Enviar entrega <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/portal/campanas">
                Ver campañas <Briefcase className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
