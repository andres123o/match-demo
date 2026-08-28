import type { TipoRepresentacion } from "@/lib/types";
import { esCorreoValido, soloTextoRequerido, validarArchivo } from "@/lib/validation";
import { getDocumentosRequeridos, validarFormatoDocumento, validarUrlRedSocial } from "@/lib/catalogs";

export interface WizardRedSocial {
  key: string;
  plataforma: string;
  usuario: string;
  perfilUrl: string;
  seguidores: string;
  engagement: string;
  alcancePromedio: string;
  viewsPromedio: string;
  verificado: boolean;
}

export interface WizardData {
  representacion: TipoRepresentacion | "";
  paisId: string;

  entidad: {
    tipoDocumentoId: string;
    numeroDocumento: string;
    nombre: string;
    nombreComercial: string;
    contactoPrincipal: string;
    correo: string;
    telefono: string;
    whatsapp: string;
    sitioWeb: string;
    ciudadId: string;
    condicionesComerciales: string;
    observaciones: string;
  };

  identificacionDirecto: {
    tipoDocumentoId: string;
    numeroDocumento: string;
  };

  documentos: Record<string, File | null>;

  banco: {
    bancoId: string;
    bancoNombreOtro: string;
    tipoCuenta: "AHORROS" | "CORRIENTE";
    numeroCuenta: string;
  };

  influencer: {
    nombreCompleto: string;
    genero: string;
    ciudadId: string;
    correo: string;
    telefono: string;
    whatsapp: string;
    biografia: string;
    fotoFile: File | null;
    fotoPreviewUrl: string;
    categorias: string[];
    nichos: string[];
  };

  redesSociales: WizardRedSocial[];
}

export function crearRedSocialVacia(): WizardRedSocial {
  return {
    key: crypto.randomUUID(),
    plataforma: "",
    usuario: "",
    perfilUrl: "",
    seguidores: "",
    engagement: "",
    alcancePromedio: "",
    viewsPromedio: "",
    verificado: false,
  };
}

export function crearWizardInicial(): WizardData {
  return {
    representacion: "",
    paisId: "",
    entidad: {
      tipoDocumentoId: "",
      numeroDocumento: "",
      nombre: "",
      nombreComercial: "",
      contactoPrincipal: "",
      correo: "",
      telefono: "",
      whatsapp: "",
      sitioWeb: "",
      ciudadId: "",
      condicionesComerciales: "",
      observaciones: "",
    },
    identificacionDirecto: { tipoDocumentoId: "", numeroDocumento: "" },
    documentos: {},
    banco: { bancoId: "", bancoNombreOtro: "", tipoCuenta: "AHORROS", numeroCuenta: "" },
    influencer: {
      nombreCompleto: "",
      genero: "",
      ciudadId: "",
      correo: "",
      telefono: "",
      whatsapp: "",
      biografia: "",
      fotoFile: null,
      fotoPreviewUrl: "",
      categorias: [],
      nichos: [],
    },
    redesSociales: [crearRedSocialVacia()],
  };
}

/** Clona el estado del wizard preservando referencias a File (no serializables). */
export function clonarWizardData(data: WizardData): WizardData {
  return {
    ...data,
    entidad: { ...data.entidad },
    identificacionDirecto: { ...data.identificacionDirecto },
    documentos: { ...data.documentos },
    banco: { ...data.banco },
    influencer: { ...data.influencer, categorias: [...data.influencer.categorias], nichos: [...data.influencer.nichos] },
    redesSociales: data.redesSociales.map((r) => ({ ...r })),
  };
}

export function validarPasoRepresentacion(data: WizardData): boolean {
  if (!data.representacion || !data.paisId) return false;
  if (data.representacion === "DIRECTO") return true;

  const e = data.entidad;
  if (!soloTextoRequerido(e.tipoDocumentoId) || !soloTextoRequerido(e.numeroDocumento)) return false;
  if (!validarFormatoDocumento(data.paisId, e.tipoDocumentoId, e.numeroDocumento)) return false;
  if (!soloTextoRequerido(e.nombre) || !esCorreoValido(e.correo)) return false;
  if (data.representacion === "AGENCIA" && (!soloTextoRequerido(e.contactoPrincipal) || !soloTextoRequerido(e.ciudadId))) return false;
  return true;
}

export function validarPasoDocumentos(data: WizardData): boolean {
  if (data.representacion === "DIRECTO") {
    if (!soloTextoRequerido(data.identificacionDirecto.tipoDocumentoId) || !soloTextoRequerido(data.identificacionDirecto.numeroDocumento)) return false;
    if (!validarFormatoDocumento(data.paisId, data.identificacionDirecto.tipoDocumentoId, data.identificacionDirecto.numeroDocumento)) return false;
  }

  const requeridos = getDocumentosRequeridos(data.representacion || "DIRECTO");
  for (const req of requeridos) {
    if (!req.obligatorio) continue;
    const archivo = data.documentos[req.grupo];
    if (!archivo) return false;
    if (!validarArchivo(archivo, req).valido) return false;
  }

  if (!soloTextoRequerido(data.banco.bancoId)) return false;
  if (data.banco.bancoId === "otro" && !soloTextoRequerido(data.banco.bancoNombreOtro)) return false;
  if (!soloTextoRequerido(data.banco.numeroCuenta)) return false;

  return true;
}

export function validarPasoDatosInfluencer(data: WizardData): boolean {
  const i = data.influencer;
  if (!soloTextoRequerido(i.nombreCompleto) || !soloTextoRequerido(i.genero) || !soloTextoRequerido(i.ciudadId)) return false;
  if (!esCorreoValido(i.correo)) return false;
  if (i.categorias.length === 0 || i.nichos.length === 0) return false;
  return true;
}

export function validarPasoRedesSociales(data: WizardData): boolean {
  if (data.redesSociales.length === 0) return false;
  for (const red of data.redesSociales) {
    if (!soloTextoRequerido(red.plataforma) || !soloTextoRequerido(red.usuario)) return false;
    if (!validarUrlRedSocial(red.plataforma, red.perfilUrl)) return false;
    if (!red.seguidores || Number(red.seguidores) < 0) return false;
  }
  const combinaciones = data.redesSociales.map((r) => `${r.plataforma}:${r.usuario.toLowerCase()}`);
  return new Set(combinaciones).size === combinaciones.length;
}
