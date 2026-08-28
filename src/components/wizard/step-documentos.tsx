"use client";

import { FormField } from "@/components/shared/form-field";
import { FileDrop } from "@/components/shared/file-drop";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBancos, getConfigDocumento, getDocumentosRequeridos, getTiposDocumento, TIPOS_CUENTA, validarFormatoDocumento } from "@/lib/catalogs";
import { validarArchivo } from "@/lib/validation";
import type { WizardData } from "./wizard-data";

const NOMBRE_GRUPO: Record<string, string> = {
  IDENTIDAD: "Identidad",
  TRIBUTARIO: "Tributario",
  BANCARIO: "Bancario",
  LEGAL: "Legal",
  CAMARA_COMERCIO: "Cámara de comercio",
};

export function StepDocumentos({ data, onChange }: { data: WizardData; onChange: (updater: (draft: WizardData) => void) => void }) {
  const representacion = data.representacion || "DIRECTO";
  const requeridos = getDocumentosRequeridos(representacion);
  const tiposDocumentoDirecto = data.paisId ? getTiposDocumento(data.paisId, "N") : [];
  const configDocDirecto = data.paisId && data.identificacionDirecto.tipoDocumentoId
    ? getConfigDocumento(data.paisId, data.identificacionDirecto.tipoDocumentoId)
    : undefined;
  const numeroInvalido =
    !!data.identificacionDirecto.numeroDocumento &&
    !!configDocDirecto &&
    !validarFormatoDocumento(data.paisId, data.identificacionDirecto.tipoDocumentoId, data.identificacionDirecto.numeroDocumento);
  const bancos = data.paisId ? getBancos(data.paisId) : [];

  return (
    <div className="space-y-6">
      {representacion === "DIRECTO" && (
        <div className="grid gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
          <p className="col-span-full font-heading text-sm font-semibold text-foreground">Tu identificación</p>
          <FormField label="Tipo de documento" required>
            <Select
              value={data.identificacionDirecto.tipoDocumentoId}
              onValueChange={(v) => onChange((d) => (d.identificacionDirecto.tipoDocumentoId = v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {tiposDocumentoDirecto.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            label="Número de documento"
            required
            hint={configDocDirecto ? `Ej: ${configDocDirecto.ejemplo}` : undefined}
            error={numeroInvalido ? "El formato no coincide con el tipo de documento" : undefined}
          >
            <Input
              value={data.identificacionDirecto.numeroDocumento}
              onChange={(e) => onChange((d) => (d.identificacionDirecto.numeroDocumento = e.target.value))}
              disabled={!data.identificacionDirecto.tipoDocumentoId}
            />
          </FormField>
        </div>
      )}

      <div className="space-y-3">
        <p className="font-heading text-sm font-semibold text-foreground">Documentos requeridos</p>
        {requeridos
          .filter((r) => r.grupo !== "BANCARIO")
          .map((req) => {
            const archivo = data.documentos[req.grupo] ?? null;
            const error = archivo ? validarArchivo(archivo, req).error : undefined;
            return (
              <div key={req.grupo}>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{req.nombre}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{NOMBRE_GRUPO[req.grupo]}</span>
                  {!req.obligatorio && <span className="text-[11px] text-muted-foreground">(opcional)</span>}
                </div>
                <FileDrop
                  id={`doc-${req.grupo}`}
                  file={archivo}
                  accept={req.formatosPermitidos.map((f) => `.${f}`).join(",")}
                  hint={`${req.formatosPermitidos.join(", ").toUpperCase()} · máx. ${req.tamanoMaximoMb}MB`}
                  error={error}
                  onChange={(f) =>
                    onChange((d) => {
                      d.documentos[req.grupo] = f;
                    })
                  }
                />
              </div>
            );
          })}
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-4">
        <p className="font-heading text-sm font-semibold text-foreground">Referencia bancaria</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Banco" required>
            <Select value={data.banco.bancoId} onValueChange={(v) => onChange((d) => (d.banco.bancoId = v))} disabled={!data.paisId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={data.paisId ? "Selecciona un banco" : "Elige un país primero"} />
              </SelectTrigger>
              <SelectContent>
                {bancos.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {data.banco.bancoId === "otro" && (
            <FormField label="Nombre del banco" required>
              <Input value={data.banco.bancoNombreOtro} onChange={(e) => onChange((d) => (d.banco.bancoNombreOtro = e.target.value))} />
            </FormField>
          )}

          <FormField label="Tipo de cuenta" required>
            <Select value={data.banco.tipoCuenta} onValueChange={(v) => onChange((d) => (d.banco.tipoCuenta = v as "AHORROS" | "CORRIENTE"))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_CUENTA.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Número de cuenta" required>
            <Input value={data.banco.numeroCuenta} onChange={(e) => onChange((d) => (d.banco.numeroCuenta = e.target.value))} />
          </FormField>
        </div>

        {requeridos
          .filter((r) => r.grupo === "BANCARIO")
          .map((req) => {
            const archivo = data.documentos[req.grupo] ?? null;
            const error = archivo ? validarArchivo(archivo, req).error : undefined;
            return (
              <div key={req.grupo}>
                <p className="mb-1.5 text-sm font-medium text-foreground">{req.nombre}</p>
                <FileDrop
                  id={`doc-${req.grupo}`}
                  file={archivo}
                  accept={req.formatosPermitidos.map((f) => `.${f}`).join(",")}
                  hint={`${req.formatosPermitidos.join(", ").toUpperCase()} · máx. ${req.tamanoMaximoMb}MB`}
                  error={error}
                  onChange={(f) =>
                    onChange((d) => {
                      d.documentos[req.grupo] = f;
                    })
                  }
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
