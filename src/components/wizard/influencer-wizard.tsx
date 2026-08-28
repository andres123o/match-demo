"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WizardShell, type WizardStep } from "./wizard-shell";
import { StepRepresentacion } from "./step-representacion";
import { StepDocumentos } from "./step-documentos";
import { StepDatos } from "./step-datos";
import { StepRedes } from "./step-redes";
import { StepRevision } from "./step-revision";
import {
  clonarWizardData,
  crearWizardInicial,
  validarPasoDatosInfluencer,
  validarPasoDocumentos,
  validarPasoRedesSociales,
  validarPasoRepresentacion,
  type WizardData,
} from "./wizard-data";
import { createInfluencer } from "@/lib/store";
import { setSession } from "@/lib/auth";
import { SuccessCheck } from "@/components/brand/success-check";
import type { Documento } from "@/lib/types";

const REDIRECCION_MS = 1800;

const STEPS: WizardStep[] = [
  { id: "representacion", title: "Representación", description: "¿Quién gestiona este perfil y en qué país opera?" },
  { id: "documentos", title: "Documentos", description: "Identificación y referencia bancaria para pagos." },
  { id: "datos", title: "Datos del influencer", description: "Información personal y de contenido." },
  { id: "redes", title: "Redes sociales", description: "Agrega al menos una red social con sus métricas." },
  { id: "revision", title: "Revisión y envío", description: "Confirma que todo esté correcto antes de enviar." },
];

const VALIDADORES = [validarPasoRepresentacion, validarPasoDocumentos, validarPasoDatosInfluencer, validarPasoRedesSociales, () => true];

export function InfluencerWizard() {
  const router = useRouter();
  const [data, setData] = useState<WizardData>(crearWizardInicial);
  const [index, setIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function actualizar(mutator: (draft: WizardData) => void) {
    setData((prev) => {
      const draft = clonarWizardData(prev);
      mutator(draft);
      return draft;
    });
  }

  const esUltimoPaso = index === STEPS.length - 1;
  const puedeAvanzar = VALIDADORES[index](data);

  async function manejarSiguiente() {
    if (!puedeAvanzar) return;
    if (!esUltimoPaso) {
      setIndex((i) => i + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const documentos: Documento[] = Object.entries(data.documentos)
        .filter((entry): entry is [string, File] => !!entry[1])
        .map(([grupo, archivo]) => ({
          id: crypto.randomUUID(),
          grupo: grupo as Documento["grupo"],
          tipoDocumento: grupo,
          nombreArchivo: archivo.name,
          urlSimulada: URL.createObjectURL(archivo),
          subidoEn: new Date().toISOString(),
        }));

      const nuevo = await createInfluencer({
        representacion: data.representacion || "DIRECTO",
        nombreCompleto: data.influencer.nombreCompleto,
        genero: data.influencer.genero,
        paisId: data.paisId,
        ciudadId: data.influencer.ciudadId,
        correo: data.influencer.correo,
        telefono: data.influencer.telefono,
        whatsapp: data.influencer.whatsapp,
        biografia: data.influencer.biografia,
        fotoUrl: data.influencer.fotoPreviewUrl,
        categorias: data.influencer.categorias,
        nichos: data.influencer.nichos,
        documentos,
        banco: {
          bancoId: data.banco.bancoId,
          bancoNombre: data.banco.bancoId === "otro" ? data.banco.bancoNombreOtro : data.banco.bancoId,
          tipoCuenta: data.banco.tipoCuenta,
          numeroCuenta: data.banco.numeroCuenta,
        },
        redesSociales: data.redesSociales.map((r) => ({
          id: r.key,
          plataforma: r.plataforma,
          usuario: r.usuario,
          perfilUrl: r.perfilUrl,
          seguidores: Number(r.seguidores) || 0,
          engagement: r.engagement ? Number(r.engagement) : undefined,
          alcancePromedio: r.alcancePromedio ? Number(r.alcancePromedio) : undefined,
          viewsPromedio: r.viewsPromedio ? Number(r.viewsPromedio) : undefined,
          verificado: r.verificado,
          fechaActualizacion: new Date().toISOString(),
        })),
      });

      setSession({
        rol: data.representacion === "DIRECTO" ? "INFLUENCER" : "REPRESENTANTE",
        influencerId: nuevo.id,
        nombre: data.representacion === "DIRECTO" ? nuevo.nombreCompleto : data.entidad.nombre || nuevo.nombreCompleto,
      });

      setEnviado(true);
      setTimeout(() => router.push("/portal"), REDIRECCION_MS);
    } catch {
      toast.error("No se pudo completar el registro. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  }

  if (enviado) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <SuccessCheck />
      </div>
    );
  }

  return (
    <WizardShell
      steps={STEPS}
      currentIndex={index}
      onBack={() => setIndex((i) => Math.max(0, i - 1))}
      onNext={manejarSiguiente}
      nextDisabled={!puedeAvanzar}
      nextLabel={esUltimoPaso ? "Enviar solicitud" : "Continuar"}
      isSubmitting={isSubmitting}
    >
      {index === 0 && <StepRepresentacion data={data} onChange={actualizar} />}
      {index === 1 && <StepDocumentos data={data} onChange={actualizar} />}
      {index === 2 && <StepDatos data={data} onChange={actualizar} />}
      {index === 3 && <StepRedes data={data} onChange={actualizar} />}
      {index === 4 && <StepRevision data={data} />}
    </WizardShell>
  );
}
