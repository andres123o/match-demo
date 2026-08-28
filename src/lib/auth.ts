import type { Rol, Sesion } from "./types";

// Sesión simulada (sin backend real): vive en localStorage del navegador.
// En una versión con backend real, esto se reemplaza por cookies de sesión
// / JWT emitidos por un servidor de autenticación, sin cambiar las pantallas
// que consumen getSession()/useSession().

const SESSION_KEY = "match_prototype_session_v1";

// useSyncExternalStore exige que getSnapshot devuelva la MISMA referencia
// mientras el valor no cambie (si no, entra en loop infinito). Por eso se
// cachea el objeto parseado y solo se recalcula si el string crudo cambió.
let rawCacheado: string | null = null;
let sesionCacheada: Sesion | null = null;

export function getSession(): Sesion | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === rawCacheado) return sesionCacheada;

  rawCacheado = raw;
  try {
    sesionCacheada = raw ? (JSON.parse(raw) as Sesion) : null;
  } catch {
    sesionCacheada = null;
  }
  return sesionCacheada;
}

export function setSession(sesion: Sesion) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function rutaInicioPara(rol: Rol): string {
  return rol === "ADMIN" ? "/admin" : "/portal";
}
