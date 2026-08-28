"use client";

import { Building2, User, Users } from "lucide-react";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PAISES, getCiudades, getTiposDocumento, getConfigDocumento, validarFormatoDocumento } from "@/lib/catalogs";
import { esCorreoValido } from "@/lib/validation";
import type { WizardData } from "./wizard-data";
import type { TipoRepresentacion } from "@/lib/types";

const OPCIONES = [
  { id: "DIRECTO" as TipoRepresentacion, titulo: "Directo", descripcion: "El influencer gestiona su propio perfil.", icon: User },
  { id: "MANAGER" as TipoRepresentacion, titulo: "Manager", descripcion: "Una persona lo representa.", icon: Users },
  { id: "AGENCIA" as TipoRepresentacion, titulo: "Agencia", descripcion: "Una agencia lo representa.", icon: Building2 },
];

export function StepRepresentacion({ data, onChange }: { data: WizardData; onChange: (updater: (draft: WizardData) => void) => void }) {
  const naturaleza = data.representacion === "AGENCIA" ? "J" : "N";
  const tiposDocumento = data.paisId ? getTiposDocumento(data.paisId, naturaleza) : [];
  const configDoc = data.paisId && data.entidad.tipoDocumentoId ? getConfigDocumento(data.paisId, data.entidad.tipoDocumentoId) : undefined;
  const numeroInvalido =
    !!data.entidad.numeroDocumento && !!configDoc && !validarFormatoDocumento(data.paisId, data.entidad.tipoDocumentoId, data.entidad.numeroDocumento);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {OPCIONES.map((op) => {
          const Icon = op.icon;
          const activo = data.representacion === op.id;
          return (
            <button
              key={op.id}
              type="button"
              onClick={() =>
                onChange((d) => {
                  d.representacion = op.id;
                })
              }
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                activo ? "border-primary bg-secondary" : "border-border hover:border-primary/40"
              )}
            >
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", activo ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="font-heading text-sm font-semibold text-foreground">{op.titulo}</span>
              <span className="text-xs text-muted-foreground">{op.descripcion}</span>
            </button>
          );
        })}
      </div>

      <FormField label="País" required>
        <Select
          value={data.paisId}
          onValueChange={(v) =>
            onChange((d) => {
              d.paisId = v;
              d.entidad.tipoDocumentoId = "";
              d.entidad.numeroDocumento = "";
              d.entidad.ciudadId = "";
              d.identificacionDirecto.tipoDocumentoId = "";
              d.identificacionDirecto.numeroDocumento = "";
              d.banco.bancoId = "";
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un país" />
          </SelectTrigger>
          <SelectContent>
            {PAISES.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      {data.representacion && data.representacion !== "DIRECTO" && (
        <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-4">
          <p className="font-heading text-sm font-semibold text-foreground">
            Identificación de {data.representacion === "MANAGER" ? "el manager" : "la agencia"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Tipo de documento" required>
              <Select
                value={data.entidad.tipoDocumentoId}
                onValueChange={(v) => onChange((d) => (d.entidad.tipoDocumentoId = v))}
                disabled={!data.paisId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={data.paisId ? "Selecciona" : "Elige un país primero"} />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento.map((t) => (
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
              hint={configDoc ? `Formato esperado, ej: ${configDoc.ejemplo}` : undefined}
              error={numeroInvalido ? "El formato no coincide con el tipo de documento seleccionado" : undefined}
            >
              <Input
                value={data.entidad.numeroDocumento}
                onChange={(e) => onChange((d) => (d.entidad.numeroDocumento = e.target.value))}
                disabled={!data.entidad.tipoDocumentoId}
              />
            </FormField>

            <FormField label={data.representacion === "AGENCIA" ? "Nombre de la agencia" : "Nombre completo"} required>
              <Input value={data.entidad.nombre} onChange={(e) => onChange((d) => (d.entidad.nombre = e.target.value))} />
            </FormField>

            {data.representacion === "AGENCIA" && (
              <FormField label="Nombre comercial">
                <Input value={data.entidad.nombreComercial} onChange={(e) => onChange((d) => (d.entidad.nombreComercial = e.target.value))} />
              </FormField>
            )}

            {data.representacion === "AGENCIA" && (
              <FormField label="Contacto principal" required>
                <Input value={data.entidad.contactoPrincipal} onChange={(e) => onChange((d) => (d.entidad.contactoPrincipal = e.target.value))} />
              </FormField>
            )}

            <FormField
              label="Correo de contacto"
              required
              error={data.entidad.correo && !esCorreoValido(data.entidad.correo) ? "Correo inválido" : undefined}
            >
              <Input type="email" value={data.entidad.correo} onChange={(e) => onChange((d) => (d.entidad.correo = e.target.value))} />
            </FormField>

            <FormField label="Teléfono">
              <Input value={data.entidad.telefono} onChange={(e) => onChange((d) => (d.entidad.telefono = e.target.value))} />
            </FormField>

            <FormField label="WhatsApp">
              <Input value={data.entidad.whatsapp} onChange={(e) => onChange((d) => (d.entidad.whatsapp = e.target.value))} />
            </FormField>

            {data.representacion === "AGENCIA" && (
              <>
                <FormField label="Sitio web">
                  <Input value={data.entidad.sitioWeb} onChange={(e) => onChange((d) => (d.entidad.sitioWeb = e.target.value))} />
                </FormField>

                <FormField label="Ciudad" required>
                  <Select value={data.entidad.ciudadId} onValueChange={(v) => onChange((d) => (d.entidad.ciudadId = v))} disabled={!data.paisId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCiudades(data.paisId).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </>
            )}
          </div>

          {data.representacion === "AGENCIA" && (
            <FormField label="Condiciones comerciales">
              <Textarea
                rows={2}
                value={data.entidad.condicionesComerciales}
                onChange={(e) => onChange((d) => (d.entidad.condicionesComerciales = e.target.value))}
              />
            </FormField>
          )}

          <FormField label="Observaciones">
            <Textarea rows={2} value={data.entidad.observaciones} onChange={(e) => onChange((d) => (d.entidad.observaciones = e.target.value))} />
          </FormField>
        </div>
      )}
    </div>
  );
}
