"use client";

import { useEffect, useState } from "react";
import { PackageCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField } from "@/components/shared/form-field";
import { FileDrop } from "@/components/shared/file-drop";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useSession } from "@/hooks/use-session";
import { createEntrega, getInfluencer, listCampanas, listEntregas } from "@/lib/store";
import { MONEDAS } from "@/lib/catalogs";
import type { Campana, Entrega, Influencer, TipoEvidencia } from "@/lib/types";

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

export default function EntregasPage() {
  const { sesion } = useSession();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [viendo, setViendo] = useState<Entrega | null>(null);

  const [campanaId, setCampanaId] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [monto, setMonto] = useState("");
  const [moneda, setMoneda] = useState("COP");
  const [fechaEmision, setFechaEmision] = useState("");
  const [notaFactura, setNotaFactura] = useState("");
  const [archivoFactura, setArchivoFactura] = useState<File | null>(null);

  const [tipoEvidencia, setTipoEvidencia] = useState<TipoEvidencia>("METRICAS");
  const [tituloEvidencia, setTituloEvidencia] = useState("");
  const [redSocialId, setRedSocialId] = useState("");
  const [alcance, setAlcance] = useState("");
  const [impresiones, setImpresiones] = useState("");
  const [engagement, setEngagement] = useState("");
  const [linkContenido, setLinkContenido] = useState("");
  const [descripcionEvidencia, setDescripcionEvidencia] = useState("");
  const [archivoEvidencia, setArchivoEvidencia] = useState<File | null>(null);

  function cargar() {
    if (!sesion?.influencerId) return;
    getInfluencer(sesion.influencerId).then((i) => setInfluencer(i ?? null));
    listEntregas({ influencerId: sesion.influencerId }).then(setEntregas);
    listCampanas({ influencerId: sesion.influencerId }).then(setCampanas);
  }

  useEffect(cargar, [sesion?.influencerId]);

  function campana(id: string) {
    return campanas.find((c) => c.id === id);
  }

  function seleccionarCampana(id: string) {
    setCampanaId(id);
    const c = campana(id);
    if (c) setMoneda(c.moneda);
  }

  function limpiar() {
    setCampanaId("");
    setNumeroFactura("");
    setMonto("");
    setFechaEmision("");
    setNotaFactura("");
    setArchivoFactura(null);
    setTipoEvidencia("METRICAS");
    setTituloEvidencia("");
    setRedSocialId("");
    setAlcance("");
    setImpresiones("");
    setEngagement("");
    setLinkContenido("");
    setDescripcionEvidencia("");
    setArchivoEvidencia(null);
  }

  const formularioValido =
    !!campanaId &&
    !!numeroFactura &&
    !!monto &&
    !!fechaEmision &&
    !!archivoFactura &&
    tituloEvidencia.trim().length > 0 &&
    (tipoEvidencia === "METRICAS" ? !!redSocialId && !!alcance : tipoEvidencia === "EVIDENCIA" ? !!linkContenido : !!descripcionEvidencia);

  async function enviar() {
    if (!sesion?.influencerId || !archivoFactura || !formularioValido) return;
    setEnviando(true);
    try {
      await createEntrega({
        influencerId: sesion.influencerId,
        campanaId,
        numeroFactura,
        monto: Number(monto),
        moneda,
        fechaEmision,
        archivoFacturaNombre: archivoFactura.name,
        archivoFacturaUrl: URL.createObjectURL(archivoFactura),
        notaFactura: notaFactura || undefined,
        tipoEvidencia,
        tituloEvidencia,
        redSocialId: tipoEvidencia === "METRICAS" ? redSocialId : undefined,
        alcance: tipoEvidencia === "METRICAS" ? Number(alcance) : undefined,
        impresiones: tipoEvidencia === "METRICAS" && impresiones ? Number(impresiones) : undefined,
        engagement: tipoEvidencia === "METRICAS" && engagement ? Number(engagement) : undefined,
        linkContenido: tipoEvidencia === "EVIDENCIA" ? linkContenido : undefined,
        descripcionEvidencia: tipoEvidencia === "LIBRE" ? descripcionEvidencia : undefined,
        archivoEvidenciaNombre: archivoEvidencia?.name,
        archivoEvidenciaUrl: archivoEvidencia ? URL.createObjectURL(archivoEvidencia) : undefined,
        enviadoPor: sesion.rol === "INFLUENCER" ? "INFLUENCER" : "REPRESENTANTE",
      });
      toast.success("Entrega enviada. Quedó pendiente de revisión.");
      setAbierto(false);
      limpiar();
      cargar();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Entregas</h1>
        <Dialog open={abierto} onOpenChange={setAbierto}>
          <DialogTrigger asChild>
            <Button disabled={campanas.length === 0}>
              <Plus className="h-4 w-4" />
              Nueva entrega
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar entrega de campaña</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <FormField label="Campaña" required>
                <Select value={campanaId} onValueChange={seleccionarCampana}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona la campaña" />
                  </SelectTrigger>
                  <SelectContent>
                    {campanas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.marca} · {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <Separator />
              <p className="font-heading text-sm font-semibold text-foreground">Factura</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Número de factura" required>
                  <Input value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} />
                </FormField>
                <FormField label="Fecha de emisión" required>
                  <Input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} />
                </FormField>
                <FormField label="Monto" required>
                  <Input type="number" min={0} value={monto} onChange={(e) => setMonto(e.target.value)} />
                </FormField>
                <FormField label="Moneda" required>
                  <Select value={moneda} onValueChange={setMoneda}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONEDAS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField label="Nota adicional" hint="Opcional">
                <Textarea rows={2} value={notaFactura} onChange={(e) => setNotaFactura(e.target.value)} />
              </FormField>
              <FormField label="Archivo PDF de la factura" required>
                <FileDrop id="archivo-factura" file={archivoFactura} accept=".pdf" hint="PDF · máx. 5MB" onChange={setArchivoFactura} />
              </FormField>

              <Separator />
              <p className="font-heading text-sm font-semibold text-foreground">Evidencia de resultados</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Tipo de evidencia" required>
                  <Select value={tipoEvidencia} onValueChange={(v) => setTipoEvidencia(v as TipoEvidencia)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ETIQUETAS_TIPO) as TipoEvidencia[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {ETIQUETAS_TIPO[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Título" required>
                  <Input value={tituloEvidencia} onChange={(e) => setTituloEvidencia(e.target.value)} />
                </FormField>
              </div>

              {tipoEvidencia === "METRICAS" && (
                <>
                  <FormField label="Red social" required>
                    <Select value={redSocialId} onValueChange={setRedSocialId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {influencer?.redesSociales.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.plataforma} · {r.usuario}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Alcance" required>
                      <Input type="number" min={0} value={alcance} onChange={(e) => setAlcance(e.target.value)} />
                    </FormField>
                    <FormField label="Impresiones">
                      <Input type="number" min={0} value={impresiones} onChange={(e) => setImpresiones(e.target.value)} />
                    </FormField>
                    <FormField label="Engagement (%)">
                      <Input type="number" min={0} step="0.1" value={engagement} onChange={(e) => setEngagement(e.target.value)} />
                    </FormField>
                  </div>
                </>
              )}

              {tipoEvidencia === "EVIDENCIA" && (
                <FormField label="Link del contenido" required>
                  <Input placeholder="https://..." value={linkContenido} onChange={(e) => setLinkContenido(e.target.value)} />
                </FormField>
              )}

              {tipoEvidencia === "LIBRE" && (
                <FormField label="Descripción" required>
                  <Textarea rows={3} value={descripcionEvidencia} onChange={(e) => setDescripcionEvidencia(e.target.value)} />
                </FormField>
              )}

              <FormField label="Captura o adjunto de evidencia" hint="PDF, JPG o PNG · opcional">
                <FileDrop id="archivo-evidencia" file={archivoEvidencia} accept=".pdf,.jpg,.jpeg,.png" hint="PDF, JPG, PNG" onChange={setArchivoEvidencia} />
              </FormField>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setAbierto(false)}>
                Cancelar
              </Button>
              <Button disabled={!formularioValido || enviando} onClick={enviar}>
                {enviando ? "Enviando..." : "Enviar entrega"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {entregas.length === 0 ? (
        <EmptyState
          icon={PackageCheck}
          title="Aún no has enviado entregas"
          description={campanas.length === 0 ? "Cuando Match te asigne una campaña podrás entregarla desde aquí." : "Cada entrega incluye tu factura y la evidencia de resultados de la campaña."}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaña</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Evidencia</TableHead>
                <TableHead>Enviada</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entregas.map((e) => (
                <TableRow key={e.id} className="cursor-pointer" onClick={() => setViendo(e)}>
                  <TableCell className="max-w-[200px] truncate font-medium">{campana(e.campanaId)?.nombre ?? "—"}</TableCell>
                  <TableCell>{e.numeroFactura}</TableCell>
                  <TableCell>
                    {e.monto.toLocaleString("es-CO")} {e.moneda}
                  </TableCell>
                  <TableCell>{ETIQUETAS_TIPO[e.tipoEvidencia]}</TableCell>
                  <TableCell>{new Date(e.enviadoEn).toLocaleDateString("es-CO")}</TableCell>
                  <TableCell>
                    <StatusBadge estado={e.estado} />
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
                <DialogTitle>Entrega · {campana(viendo.campanaId)?.nombre ?? viendo.numeroFactura}</DialogTitle>
              </DialogHeader>
              <div className="space-y-1">
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
                    <Fila etiqueta="Red social" valor={influencer?.redesSociales.find((r) => r.id === viendo.redSocialId)?.usuario} />
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
                <Fila etiqueta="Enviado por" valor={viendo.enviadoPor === "INFLUENCER" ? "Ti" : "Tu representante"} />
                <Fila etiqueta="Enviado el" valor={new Date(viendo.enviadoEn).toLocaleDateString("es-CO")} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
