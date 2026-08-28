"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import type { Sesion } from "@/lib/types";

/**
 * Hook cliente para leer la sesión simulada (localStorage), evitando
 * desajustes de hidratación SSR/cliente.
 *
 * Nota: se usa `useState` + `useEffect` en vez de `useSyncExternalStore`
 * a propósito. Con `useSyncExternalStore`, el primer render post-hidratación
 * usa el snapshot "de servidor" (null) antes de sincronizar con el valor
 * real; si un componente consumidor redirige en un efecto cuando no hay
 * sesión (como hacen los guards de /portal y /admin), ese efecto puede
 * dispararse con el snapshot null y expulsar a un usuario ya autenticado
 * al recargar una ruta protegida. El flag `cargando` hace explícito que
 * el primer render no es autoritativo, y los guards esperan a que sea
 * `false` antes de decidir si redirigir.
 */
export function useSession() {
  const [sesion, setSesionState] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza desde localStorage (sistema externo) al montar; ver nota arriba.
    setSesionState(getSession());
    setCargando(false);
  }, []);

  return { sesion, cargando };
}
