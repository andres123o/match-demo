"use client";

import { BadgeCheck, Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REDES_SOCIALES, validarUrlRedSocial } from "@/lib/catalogs";
import type { WizardData, WizardRedSocial } from "./wizard-data";
import { crearRedSocialVacia } from "./wizard-data";

export function StepRedes({ data, onChange }: { data: WizardData; onChange: (updater: (draft: WizardData) => void) => void }) {
  const combinaciones = data.redesSociales.map((r) => `${r.plataforma}:${r.usuario.toLowerCase()}`);

  function actualizar(key: string, patch: Partial<WizardRedSocial>) {
    onChange((d) => {
      const red = d.redesSociales.find((r) => r.key === key);
      if (red) Object.assign(red, patch);
    });
  }

  return (
    <div className="space-y-4">
      {data.redesSociales.map((red, index) => {
        const catalogo = REDES_SOCIALES.find((r) => r.id === red.plataforma);
        const urlInvalida = !!red.perfilUrl && !validarUrlRedSocial(red.plataforma, red.perfilUrl);
        const duplicada = red.plataforma && red.usuario && combinaciones.filter((c) => c === `${red.plataforma}:${red.usuario.toLowerCase()}`).length > 1;

        return (
          <div key={red.key} className="rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-heading text-sm font-semibold text-foreground">Red social {index + 1}</p>
              {data.redesSociales.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange((d) => (d.redesSociales = d.redesSociales.filter((r) => r.key !== red.key)))}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Plataforma" required>
                <Select value={red.plataforma} onValueChange={(v) => actualizar(red.key, { plataforma: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {REDES_SOCIALES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Usuario" required error={duplicada ? "Ya agregaste este usuario en esta red" : undefined}>
                <Input
                  placeholder={catalogo?.placeholderUsuario}
                  value={red.usuario}
                  onChange={(e) => actualizar(red.key, { usuario: e.target.value })}
                />
              </FormField>

              <FormField
                label="URL de perfil"
                required
                className="sm:col-span-2"
                hint={catalogo ? `Debe pertenecer a ${catalogo.dominios[0]}` : undefined}
                error={urlInvalida ? "La URL no corresponde a la plataforma seleccionada" : undefined}
              >
                <Input
                  placeholder="https://..."
                  value={red.perfilUrl}
                  onChange={(e) => actualizar(red.key, { perfilUrl: e.target.value })}
                />
              </FormField>

              <FormField label="Seguidores" required>
                <Input type="number" min={0} value={red.seguidores} onChange={(e) => actualizar(red.key, { seguidores: e.target.value })} />
              </FormField>

              <FormField label="Engagement (%)">
                <Input type="number" min={0} step="0.1" value={red.engagement} onChange={(e) => actualizar(red.key, { engagement: e.target.value })} />
              </FormField>

              <FormField label="Alcance promedio">
                <Input type="number" min={0} value={red.alcancePromedio} onChange={(e) => actualizar(red.key, { alcancePromedio: e.target.value })} />
              </FormField>

              <FormField label="Views promedio">
                <Input type="number" min={0} value={red.viewsPromedio} onChange={(e) => actualizar(red.key, { viewsPromedio: e.target.value })} />
              </FormField>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
              <Checkbox checked={red.verificado} onCheckedChange={(v) => actualizar(red.key, { verificado: !!v })} />
              <BadgeCheck className="h-4 w-4 text-brand-teal" />
              Cuenta verificada
            </label>
          </div>
        );
      })}

      <Button type="button" variant="outline" className="w-full" onClick={() => onChange((d) => d.redesSociales.push(crearRedSocialVacia()))}>
        <Plus className="h-4 w-4" />
        Agregar red social
      </Button>
    </div>
  );
}
