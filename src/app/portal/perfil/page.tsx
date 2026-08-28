"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/shared/form-field";
import { ChipMultiSelect } from "@/components/shared/chip-multiselect";
import { useSession } from "@/hooks/use-session";
import { getInfluencer, updateInfluencer } from "@/lib/store";
import { CATEGORIAS, GENEROS, NICHOS, PAISES, REDES_SOCIALES, TIPOS_CUENTA, getBancos, getCiudades, validarUrlRedSocial } from "@/lib/catalogs";
import { esCorreoValido } from "@/lib/validation";
import type { Influencer, ReferenciaBancaria, RedSocial } from "@/lib/types";

function alternar(lista: string[], valor: string): string[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

function redVacia(): RedSocial {
  return {
    id: crypto.randomUUID(),
    plataforma: "",
    usuario: "",
    perfilUrl: "",
    seguidores: 0,
    verificado: false,
    fechaActualizacion: new Date().toISOString(),
  };
}

export default function PerfilPage() {
  const { sesion } = useSession();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);

  const [datos, setDatos] = useState({
    nombreCompleto: "",
    genero: "",
    ciudadId: "",
    correo: "",
    telefono: "",
    whatsapp: "",
    biografia: "",
    categorias: [] as string[],
    nichos: [] as string[],
  });
  const [fotoPreview, setFotoPreview] = useState("");
  const [redes, setRedes] = useState<RedSocial[]>([]);
  const [banco, setBanco] = useState<ReferenciaBancaria>({ bancoId: "", bancoNombre: "", tipoCuenta: "AHORROS", numeroCuenta: "" });

  const [guardandoDatos, setGuardandoDatos] = useState(false);
  const [guardandoRedes, setGuardandoRedes] = useState(false);
  const [guardandoBanco, setGuardandoBanco] = useState(false);

  useEffect(() => {
    if (!sesion?.influencerId) return;
    getInfluencer(sesion.influencerId).then((i) => {
      if (!i) return;
      setInfluencer(i);
      setDatos({
        nombreCompleto: i.nombreCompleto,
        genero: i.genero,
        ciudadId: i.ciudadId ?? "",
        correo: i.correo,
        telefono: i.telefono ?? "",
        whatsapp: i.whatsapp ?? "",
        biografia: i.biografia ?? "",
        categorias: i.categorias,
        nichos: i.nichos,
      });
      setFotoPreview(i.fotoUrl ?? "");
      setRedes(i.redesSociales);
      setBanco(i.banco ?? { bancoId: "", bancoNombre: "", tipoCuenta: "AHORROS", numeroCuenta: "" });
    });
  }, [sesion?.influencerId]);

  if (!influencer) {
    return <p className="text-sm text-muted-foreground">Cargando perfil...</p>;
  }

  const pais = PAISES.find((p) => p.id === influencer.paisId);
  const datosValidos = datos.nombreCompleto.trim().length > 0 && esCorreoValido(datos.correo) && datos.categorias.length > 0 && datos.nichos.length > 0;
  const redesValidas =
    redes.length > 0 &&
    redes.every((r) => r.plataforma && r.usuario && validarUrlRedSocial(r.plataforma, r.perfilUrl) && r.seguidores >= 0);
  const bancoValido = !!banco.bancoId && !!banco.numeroCuenta;

  async function guardarDatos() {
    if (!influencer || !datosValidos) return;
    setGuardandoDatos(true);
    try {
      await updateInfluencer(influencer.id, { ...datos, fotoUrl: fotoPreview });
      toast.success("Datos personales actualizados.");
    } finally {
      setGuardandoDatos(false);
    }
  }

  async function guardarRedes() {
    if (!influencer || !redesValidas) return;
    setGuardandoRedes(true);
    try {
      await updateInfluencer(influencer.id, { redesSociales: redes });
      toast.success("Redes sociales actualizadas.");
    } finally {
      setGuardandoRedes(false);
    }
  }

  async function guardarBanco() {
    if (!influencer || !bancoValido) return;
    setGuardandoBanco(true);
    try {
      await updateInfluencer(influencer.id, { banco });
      toast.success("Referencia bancaria actualizada.");
    } finally {
      setGuardandoBanco(false);
    }
  }

  function actualizarRed(id: string, patch: Partial<RedSocial>) {
    setRedes((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const bancos = getBancos(influencer.paisId);
  const ciudades = getCiudades(influencer.paisId);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Mi perfil</h1>

      <Card>
        <CardContent className="grid gap-3 pt-6 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Representación</p>
            <p className="capitalize text-foreground">{influencer.representacion.toLowerCase()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">País</p>
            <p className="text-foreground">{pais?.nombre}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Documentos e identificación</p>
            <p className="text-foreground">No editable aquí — contacta a Match para actualizarlos.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 pt-6">
          <p className="font-heading text-sm font-semibold text-foreground">Datos personales</p>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
              {fotoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoPreview} alt="Foto de perfil" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-7 w-7" />
              )}
            </div>
            <div>
              <label htmlFor="foto-perfil" className="inline-flex cursor-pointer items-center rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted">
                Cambiar foto
              </label>
              <input
                id="foto-perfil"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFotoPreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nombre completo" required>
              <Input value={datos.nombreCompleto} onChange={(e) => setDatos((d) => ({ ...d, nombreCompleto: e.target.value }))} />
            </FormField>
            <FormField label="Género" required>
              <Select value={datos.genero} onValueChange={(v) => setDatos((d) => ({ ...d, genero: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
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
              <Select value={datos.ciudadId} onValueChange={(v) => setDatos((d) => ({ ...d, ciudadId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
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
            <FormField label="Correo" required error={datos.correo && !esCorreoValido(datos.correo) ? "Correo inválido" : undefined}>
              <Input type="email" value={datos.correo} onChange={(e) => setDatos((d) => ({ ...d, correo: e.target.value }))} />
            </FormField>
            <FormField label="Teléfono">
              <Input value={datos.telefono} onChange={(e) => setDatos((d) => ({ ...d, telefono: e.target.value }))} />
            </FormField>
            <FormField label="WhatsApp">
              <Input value={datos.whatsapp} onChange={(e) => setDatos((d) => ({ ...d, whatsapp: e.target.value }))} />
            </FormField>
          </div>

          <FormField label="Biografía" hint="Máximo 1000 caracteres">
            <Textarea rows={3} maxLength={1000} value={datos.biografia} onChange={(e) => setDatos((d) => ({ ...d, biografia: e.target.value }))} />
          </FormField>

          <FormField label="Categorías de contenido" required>
            <ChipMultiSelect options={CATEGORIAS} selected={datos.categorias} onToggle={(v) => setDatos((d) => ({ ...d, categorias: alternar(d.categorias, v) }))} />
          </FormField>

          <FormField label="Nichos" required>
            <ChipMultiSelect options={NICHOS} selected={datos.nichos} onToggle={(v) => setDatos((d) => ({ ...d, nichos: alternar(d.nichos, v) }))} />
          </FormField>

          <div className="flex justify-end">
            <Button disabled={!datosValidos || guardandoDatos} onClick={guardarDatos}>
              {guardandoDatos ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="font-heading text-sm font-semibold text-foreground">Redes sociales</p>

          {redes.map((red) => (
            <div key={red.id} className="rounded-xl border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{REDES_SOCIALES.find((r) => r.id === red.plataforma)?.nombre ?? "Red social"}</p>
                <button
                  type="button"
                  onClick={() => setRedes((prev) => prev.filter((r) => r.id !== red.id))}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Plataforma" required>
                  <Select value={red.plataforma} onValueChange={(v) => actualizarRed(red.id, { plataforma: v })}>
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
                <FormField label="Usuario" required>
                  <Input value={red.usuario} onChange={(e) => actualizarRed(red.id, { usuario: e.target.value })} />
                </FormField>
                <FormField
                  label="URL de perfil"
                  required
                  className="sm:col-span-2"
                  error={red.perfilUrl && !validarUrlRedSocial(red.plataforma, red.perfilUrl) ? "La URL no corresponde a la plataforma" : undefined}
                >
                  <Input value={red.perfilUrl} onChange={(e) => actualizarRed(red.id, { perfilUrl: e.target.value })} />
                </FormField>
                <FormField label="Seguidores" required>
                  <Input type="number" min={0} value={red.seguidores} onChange={(e) => actualizarRed(red.id, { seguidores: Number(e.target.value) })} />
                </FormField>
                <FormField label="Engagement (%)">
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    value={red.engagement ?? ""}
                    onChange={(e) => actualizarRed(red.id, { engagement: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </FormField>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
                <Checkbox checked={red.verificado} onCheckedChange={(v) => actualizarRed(red.id, { verificado: !!v })} />
                Cuenta verificada
              </label>
            </div>
          ))}

          <Button type="button" variant="outline" className="w-full" onClick={() => setRedes((prev) => [...prev, redVacia()])}>
            <Plus className="h-4 w-4" />
            Agregar red social
          </Button>

          <div className="flex justify-end">
            <Button disabled={!redesValidas || guardandoRedes} onClick={guardarRedes}>
              {guardandoRedes ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="font-heading text-sm font-semibold text-foreground">Referencia bancaria</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Banco" required>
              <Select value={banco.bancoId} onValueChange={(v) => setBanco((b) => ({ ...b, bancoId: v, bancoNombre: bancos.find((x) => x.id === v)?.nombre ?? v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
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
            <FormField label="Tipo de cuenta" required>
              <Select value={banco.tipoCuenta} onValueChange={(v) => setBanco((b) => ({ ...b, tipoCuenta: v as "AHORROS" | "CORRIENTE" }))}>
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
              <Input value={banco.numeroCuenta} onChange={(e) => setBanco((b) => ({ ...b, numeroCuenta: e.target.value }))} />
            </FormField>
          </div>
          <div className="flex justify-end">
            <Button disabled={!bancoValido || guardandoBanco} onClick={guardarBanco}>
              {guardandoBanco ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
