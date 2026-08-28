"use client";

import { UserRound } from "lucide-react";
import { FormField } from "@/components/shared/form-field";
import { ChipMultiSelect } from "@/components/shared/chip-multiselect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIAS, GENEROS, NICHOS, getCiudades } from "@/lib/catalogs";
import { esCorreoValido } from "@/lib/validation";
import type { WizardData } from "./wizard-data";

function alternar(lista: string[], valor: string): string[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

export function StepDatos({ data, onChange }: { data: WizardData; onChange: (updater: (draft: WizardData) => void) => void }) {
  const ciudades = data.paisId ? getCiudades(data.paisId) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
          {data.influencer.fotoPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.influencer.fotoPreviewUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <UserRound className="h-7 w-7" />
          )}
        </div>
        <div>
          <label htmlFor="foto-influencer" className="inline-flex cursor-pointer items-center rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted">
            Subir foto de perfil
          </label>
          <input
            id="foto-influencer"
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              const preview = file ? URL.createObjectURL(file) : "";
              onChange((d) => {
                d.influencer.fotoFile = file;
                d.influencer.fotoPreviewUrl = preview;
              });
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">JPG o PNG · opcional</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre completo" required>
          <Input value={data.influencer.nombreCompleto} onChange={(e) => onChange((d) => (d.influencer.nombreCompleto = e.target.value))} />
        </FormField>

        <FormField label="Género" required>
          <Select value={data.influencer.genero} onValueChange={(v) => onChange((d) => (d.influencer.genero = v))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {GENEROS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Ciudad" required>
          <Select value={data.influencer.ciudadId} onValueChange={(v) => onChange((d) => (d.influencer.ciudadId = v))} disabled={!data.paisId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={data.paisId ? "Selecciona una ciudad" : "Elige un país en el paso 1"} />
            </SelectTrigger>
            <SelectContent>
              {ciudades.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Correo" required error={data.influencer.correo && !esCorreoValido(data.influencer.correo) ? "Correo inválido" : undefined}>
          <Input type="email" value={data.influencer.correo} onChange={(e) => onChange((d) => (d.influencer.correo = e.target.value))} />
        </FormField>

        <FormField label="Teléfono">
          <Input value={data.influencer.telefono} onChange={(e) => onChange((d) => (d.influencer.telefono = e.target.value))} />
        </FormField>

        <FormField label="WhatsApp">
          <Input value={data.influencer.whatsapp} onChange={(e) => onChange((d) => (d.influencer.whatsapp = e.target.value))} />
        </FormField>
      </div>

      <FormField label="Biografía" hint="Máximo 1000 caracteres">
        <Textarea
          rows={3}
          maxLength={1000}
          value={data.influencer.biografia}
          onChange={(e) => onChange((d) => (d.influencer.biografia = e.target.value))}
        />
      </FormField>

      <FormField label="Categorías de contenido" required hint="Selecciona al menos una">
        <ChipMultiSelect
          options={CATEGORIAS}
          selected={data.influencer.categorias}
          onToggle={(v) => onChange((d) => (d.influencer.categorias = alternar(d.influencer.categorias, v)))}
        />
      </FormField>

      <FormField label="Nichos" required hint="Selecciona al menos uno">
        <ChipMultiSelect
          options={NICHOS}
          selected={data.influencer.nichos}
          onToggle={(v) => onChange((d) => (d.influencer.nichos = alternar(d.influencer.nichos, v)))}
        />
      </FormField>
    </div>
  );
}
