"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, LayoutGrid, LogOut, PackageCheck, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/hooks/use-session";
import { clearSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/portal", label: "Resumen", icon: LayoutGrid },
  { href: "/portal/campanas", label: "Campañas", icon: Briefcase },
  { href: "/portal/entregas", label: "Entregas", icon: PackageCheck },
  { href: "/portal/perfil", label: "Mi perfil", icon: UserRound },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { sesion, cargando } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && (!sesion || sesion.rol === "ADMIN")) {
      router.replace("/");
    }
  }, [cargando, sesion, router]);

  if (cargando || !sesion || sesion.rol === "ADMIN") {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Cargando...</div>;
  }

  const iniciales = sesion.nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <Link href="/portal" className="flex h-16 shrink-0 items-center justify-center border-b border-border bg-brand-ink">
          <Logo variant="onDark" />
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAV.map((item) => {
            const activo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activo ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-secondary text-xs text-primary">{iniciales}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{sesion.nombre}</p>
              <p className="text-xs text-muted-foreground">{sesion.rol === "INFLUENCER" ? "Creador" : "Representante"}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                clearSession();
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              clearSession();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
