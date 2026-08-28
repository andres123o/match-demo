"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { PAISES } from "@/lib/catalogs";
import { listInfluencers } from "@/lib/store";
import type { Influencer } from "@/lib/types";

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{etiqueta}</p>
      <p className="break-words text-sm text-foreground">{valor || "—"}</p>
    </div>
  );
}

export default function InfluenciadoresPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [seleccionado, setSeleccionado] = useState<Influencer | null>(null);

  useEffect(() => {
    listInfluencers().then(setInfluencers);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Influenciadores</h1>

      {influencers.length === 0 ? (
        <EmptyState icon={Users} title="Sin influenciadores registrados" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Representación</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Categorías</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencers.map((i) => (
                <TableRow key={i.id} className="cursor-pointer" onClick={() => setSeleccionado(i)}>
                  <TableCell className="font-medium">{i.nombreCompleto}</TableCell>
                  <TableCell className="capitalize">{i.representacion.toLowerCase()}</TableCell>
                  <TableCell>{PAISES.find((p) => p.id === i.paisId)?.nombre ?? i.paisId}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{i.categorias.join(", ")}</TableCell>
                  <TableCell>
                    <span className={i.estado === "ACTIVO" ? "text-brand-teal" : "text-muted-foreground"}>
                      {i.estado === "ACTIVO" ? "Activo" : "En revisión"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => setSeleccionado(i)}>
                      Ver perfil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!seleccionado} onOpenChange={(open) => !open && setSeleccionado(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {seleccionado && (
            <>
              <DialogHeader>
                <DialogTitle>{seleccionado.nombreCompleto}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-4">
                <Dato etiqueta="Representación" valor={seleccionado.representacion} />
                <Dato etiqueta="País" valor={PAISES.find((p) => p.id === seleccionado.paisId)?.nombre} />
                <Dato etiqueta="Ciudad" valor={seleccionado.ciudadId} />
                <Dato etiqueta="Correo" valor={seleccionado.correo} />
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs text-muted-foreground">Biografía</p>
                <p className="text-sm text-foreground">{seleccionado.biografia || "Sin biografía."}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Categorías</p>
                  <div className="flex flex-wrap gap-1.5">
                    {seleccionado.categorias.map((c) => (
                      <span key={c} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Nichos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {seleccionado.nichos.map((n) => (
                      <span key={n} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs text-muted-foreground">Redes sociales</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {seleccionado.redesSociales.map((r) => (
                    <div key={r.id} className="min-w-0 rounded-lg border border-border px-3 py-2 text-sm">
                      <p className="truncate font-medium capitalize text-foreground">
                        {r.plataforma} · {r.usuario}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.seguidores.toLocaleString("es-CO")} seguidores</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-3">
                <Dato etiqueta="Banco" valor={seleccionado.banco?.bancoNombre} />
                <Dato etiqueta="Tipo de cuenta" valor={seleccionado.banco?.tipoCuenta} />
                <Dato etiqueta="Número de cuenta" valor={seleccionado.banco?.numeroCuenta} />
              </div>

              <Dato etiqueta="Documentos adjuntos" valor={`${seleccionado.documentos.length} archivo(s)`} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
