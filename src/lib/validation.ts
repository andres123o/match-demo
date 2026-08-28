import type { DocumentoRequerido } from "./catalogs";

export interface ValidacionArchivo {
  valido: boolean;
  error?: string;
}

export function validarArchivo(archivo: File, requisito: DocumentoRequerido): ValidacionArchivo {
  const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "";
  if (!requisito.formatosPermitidos.includes(extension)) {
    return { valido: false, error: `Formato no permitido. Usa: ${requisito.formatosPermitidos.join(", ").toUpperCase()}` };
  }
  const maxBytes = requisito.tamanoMaximoMb * 1024 * 1024;
  if (archivo.size > maxBytes) {
    return { valido: false, error: `El archivo supera el máximo de ${requisito.tamanoMaximoMb}MB` };
  }
  return { valido: true };
}

export function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function esTelefonoValido(telefono: string): boolean {
  return /^[0-9+\s-]{7,15}$/.test(telefono.trim());
}

export function soloTextoRequerido(valor: string | undefined | null): boolean {
  return !!valor && valor.trim().length > 0;
}
