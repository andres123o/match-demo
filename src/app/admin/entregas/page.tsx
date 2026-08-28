"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, PackageCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { listCampanas, listEntregas, listInfluencers, updateEntregaEstado } from "@/lib/store";
import type { Campana, Entrega, EstadoSolicitud, Influencer, TipoEvidencia } from "@/lib/types";

const FILTROS: { id: EstadoSolicitud | "TODAS"; label: string }[] = [
  { id: "PENDIENTE", label: "Pendientes" },
  { id: "APROBADA", label: "Aprobadas" },
  { id: "RECHAZADA", label: "Rechazadas" },
  { id: "TODAS", label: "Todas" },
];

const ETIQUETAS_TIPO: Record<TipoEvidencia, string> = {
  METRICAS: "Métricas",
  EVIDENCIA: "Evidencia de contenido",
  LIBRE: "Reporte libre",
};

function Fila({ etiqueta, valor }: { etiqueta: string; valor?: string | number | null }) {
  if (!valor && valor !== 0) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{etiqueta}</span>
      <span className="text-right font-medium text-foreground">{valor}</span>
    </div>
  );
}

export default function AdminEntregasPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [filtro, setFiltro] = useState<EstadoSolicitud | "TODAS">("PENDIENTE");
  const [viendo, setViendo] = useState<Entrega | null>(null);
  const [rechazando, setRechazando] = useState<Entrega | null>(null);
  const [comentario, setComentario] = useState("");

  function cargar() {
    listEntregas().then(setEntregas);
    listInfluencers().then(setInfluencers);
    listCampanas().then(setCampanas);
  }

  useEffect(cargar, []);

  const nombre = (id: string) => influencers.find((i) => i.id === id)?.nombreCompleto ?? "—";
  const campana = (id: string) => campanas.find((c) => c.id === id);
  const filtradas = useMemo(() => (filtro === "TODAS" ? entregas : entregas.filter((e) => e.estado === filtro)), [entregas, filtro]);
  const influencerDe = (e: Entrega) => influencers.find((i) => i.id === e.influencerId);

  async function aprobar(id: string) {
    await updateEntregaEstado(id, "APROBADA");
    toast.success("Entrega aprobada. Ya se puede procesar el pago.");
    cargar();
  }

  async function confirmarRechazo() {
    if (!rechazando) return;
    await updateEntregaEstado(rechazando.id, "RECHAZADA", comentario || "Rechazada por el equipo Match.");
    toast.success("Entrega rechazada");
    setRechazando(null);
    setComentario("");
    cargar();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Entregas</h1>

      <Tabs value={filtro} onValueChange={(v) => setFiltro(v as EstadoSolicitud | "TODAS")}>
        <TabsList>
          {FILTROS.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtradas.length === 0 ? (
        <EmptyState icon={PackageCheck} title="No hay entregas en este filtro" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Campaña</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Evidencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtradas.map((e) => (
                <TableRow key={e.id} className="cursor-pointer" onClick={() => setViendo(e)}>
                  <TableCell className="font-medium">{nombre(e.influencerId)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {campana(e.campanaId) ? `${campana(e.campanaId)!.marca} · ${campana(e.campanaId)!.nombre}` : "—"}
                  </TableCell>
                  <TableCell>{e.numeroFactura}</TableCell>
                  <TableCell>
                    {e.monto.toLocaleString("es-CO")} {e.moneda}
                  </TableCell>
                  <TableCell>{ETIQUETAS_TIPO[e.tipoEvidencia]}</TableCell>
                  <TableCell>
                    <StatusBadge estado={e.estado} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                    {e.estado === "PENDIENTE" && (
                      <div className="flex justify-end gap-1.5">
                        <Button size="icon" variant="outline" className="h-8 w-8 text-brand-teal" onClick={() => aprobar(e.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 text-destructive" onClick={() => setRechazando(e)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!viendo} onOpenChange={(open) => !open && setViendo(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {viendo && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {nombre(viendo.influencerId)} · {campana(viendo.campanaId)?.nombre ?? viendo.numeroFactura}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-1">
                <Fila etiqueta="Influencer" valor={nombre(viendo.influencerId)} />
                <Fila etiqueta="Campaña" valor={campana(viendo.campanaId) ? `${campana(viendo.campanaId)!.marca} · ${campana(viendo.campanaId)!.nombre}` : "—"} />
                <Separator className="my-2" />
                <p className="pb-1 font-heading text-sm font-semibold text-foreground">Factura</p>
                <Fila etiqueta="Número" valor={viendo.numeroFactura} />
                <Fila etiqueta="Monto" valor={`${viendo.monto.toLocaleString("es-CO")} ${viendo.moneda}`} />
                <Fila etiqueta="Fecha de emisión" valor={new Date(viendo.fechaEmision).toLocaleDateString("es-CO")} />
                <Fila etiqueta="Archivo" valor={viendo.archivoFacturaNombre} />
                {viendo.notaFactura && <Fila etiqueta="Nota" valor={viendo.notaFactura} />}
                <Separator className="my-2" />
                <p className="pb-1 font-heading text-sm font-semibold text-foreground">Evidencia de resultados</p>
                <Fila etiqueta="Tipo" valor={ETIQUETAS_TIPO[viendo.tipoEvidencia]} />
                <Fila etiqueta="Título" valor={viendo.tituloEvidencia} />
                {viendo.tipoEvidencia === "METRICAS" && (
                  <>
                    <Fila etiqueta="Red social" valor={influencerDe(viendo)?.redesSociales.find((r) => r.id === viendo.redSocialId)?.usuario} />
                    <Fila etiqueta="Alcance" valor={viendo.alcance?.toLocaleString("es-CO")} />
                    <Fila etiqueta="Impresiones" valor={viendo.impresiones?.toLocaleString("es-CO")} />
                    <Fila etiqueta="Engagement" valor={viendo.engagement ? `${viendo.engagement}%` : undefined} />
                  </>
                )}
                {viendo.tipoEvidencia === "EVIDENCIA" && <Fila etiqueta="Link" valor={viendo.linkContenido} />}
                {viendo.tipoEvidencia === "LIBRE" && <Fila etiqueta="Descripción" valor={viendo.descripcionEvidencia} />}
                {viendo.archivoEvidenciaNombre && <Fila etiqueta="Archivo evidencia" valor={viendo.archivoEvidenciaNombre} />}
                <Separator className="my-2" />
                <div className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <StatusBadge estado={viendo.estado} />
                </div>
                {viendo.comentarioAdmin && <Fila etiqueta="Comentario de Match" valor={viendo.comentarioAdmin} />}
                <Fila etiqueta="Enviado por" valor={viendo.enviadoPor === "INFLUENCER" ? "El influencer" : "Su representante"} />
                <Fila etiqueta="Enviado el" valor={new Date(viendo.enviadoEn).toLocaleDateString("es-CO")} />
              </div>
              {viendo.estado === "PENDIENTE" && (
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    className="text-destructive"
                    onClick={() => {
                      setRechazando(viendo);
                      setViendo(null);
                    }}
                  >
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => {
                      aprobar(viendo.id);
                      setViendo(null);
                    }}
                  >
                    Aprobar
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!rechazando} onOpenChange={(open) => !open && setRechazando(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar entrega {rechazando?.numeroFactura}</AlertDialogTitle>
          </AlertDialogHeader>
          <Textarea
            placeholder="Motivo del rechazo (visible para el creador)"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setComentario("")}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarRechazo}>Rechazar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
