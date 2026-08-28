"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { ReceiptAnimation } from "@/components/brand/receipt-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { listInfluencers } from "@/lib/store";
import { setSession, rutaInicioPara } from "@/lib/auth";
import type { Influencer } from "@/lib/types";
import { cn } from "@/lib/utils";

type Modo = "creador" | "admin";

const BOTON_INGRESAR = "h-12 w-full bg-brand-violet text-white hover:bg-brand-violet/90";
const INPUT_LINEA = "h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-2.5 text-base shadow-none focus-visible:border-brand-violet focus-visible:ring-0";

// Credencial fija del simulador, igual en ambas pestañas: en producción esto
// sería un login real contra el proveedor de autenticación, no una constante
// en el cliente.
const CREDENCIAL_DEMO = { correo: "admin@match.com", password: "admin" };

export default function LoginPage() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modo, setModo] = useState<Modo>("creador");
  const [adminCorreo, setAdminCorreo] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    listInfluencers().then(setInfluencers);
  }, []);

  function esCredencialDemo(correoIngresado: string, passwordIngresado: string) {
    return correoIngresado.trim().toLowerCase() === CREDENCIAL_DEMO.correo && passwordIngresado === CREDENCIAL_DEMO.password;
  }

  function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();
    // La credencial demo entra siempre como el primer perfil de la lista;
    // cualquier otro correo se resuelve contra los perfiles registrados.
    const influencer = esCredencialDemo(correo, password) ? influencers[0] : influencers.find((i) => i.correo.trim().toLowerCase() === correo.trim().toLowerCase());
    if (!influencer) {
      setError("No encontramos una cuenta con ese correo.");
      return;
    }
    setError("");
    setSession({
      rol: influencer.representacion === "DIRECTO" ? "INFLUENCER" : "REPRESENTANTE",
      influencerId: influencer.id,
      nombre: influencer.nombreCompleto,
    });
    router.push(rutaInicioPara("INFLUENCER"));
  }

  function iniciarSesionAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!esCredencialDemo(adminCorreo, adminPassword)) {
      setAdminError("Correo o contraseña incorrectos.");
      return;
    }
    setAdminError("");
    setSession({ rol: "ADMIN", nombre: "Equipo Match" });
    router.push(rutaInicioPara("ADMIN"));
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col items-center justify-center bg-brand-ink p-10 text-white lg:flex">
        <Logo variant="onDark" className="mb-10 h-9" />
        <ReceiptAnimation />
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="font-heading text-2xl font-semibold text-foreground">Iniciar sesión</h1>

          <SegmentedControl
            className="mt-6 w-full"
            layoutId="modo-ingreso"
            value={modo}
            onChange={setModo}
            indicatorClassName="bg-brand-violet"
            activeLabelClassName="text-white"
            options={[
              { value: "creador", label: "Creador" },
              { value: "admin", label: "Equipo interno" },
            ]}
          />

          {/* Alto fijo + hijos absolutos: el panel nunca cambia de tamaño al cambiar de modo */}
          <div className="relative mt-8 h-[228px]">
            <AnimatePresence mode="wait">
              {modo === "creador" ? (
                <motion.form
                  key="creador"
                  onSubmit={iniciarSesion}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 space-y-5"
                >
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    className={INPUT_LINEA}
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    className={INPUT_LINEA}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {error && <p className="text-xs font-medium text-destructive">{error}</p>}

                  <Button type="submit" className={cn(BOTON_INGRESAR)} disabled={!correo || !password}>
                    Iniciar sesión
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    ¿Aún no tienes perfil?{" "}
                    <Link href="/registro" className="font-medium text-brand-violet hover:underline">
                      Regístrate aquí
                    </Link>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="admin"
                  onSubmit={iniciarSesionAdmin}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 space-y-5"
                >
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    className={INPUT_LINEA}
                    value={adminCorreo}
                    onChange={(e) => setAdminCorreo(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    className={INPUT_LINEA}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />

                  {adminError && <p className="text-xs font-medium text-destructive">{adminError}</p>}

                  <Button type="submit" className={cn(BOTON_INGRESAR)} disabled={!adminCorreo || !adminPassword}>
                    Iniciar sesión
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Simulador de acceso interno. En producción, este ingreso no estaría en esta misma pantalla.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
