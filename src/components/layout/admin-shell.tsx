"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, PackageCheck, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { clearSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutGrid },
  { href: "/admin/influenciadores", label: "Influenciadores", icon: Users },
  { href: "/admin/entregas", label: "Entregas", icon: PackageCheck },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { sesion, cargando } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && sesion?.rol !== "ADMIN") {
      router.replace("/");
    }
  }, [cargando, sesion, router]);

  if (cargando || sesion?.rol !== "ADMIN") {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar lg:flex">
        <Link href="/admin" className="flex h-16 shrink-0 items-center justify-center border-b border-white/10">
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
                  activo ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="flex items-center justify-between rounded-lg border border-white/10 p-2.5 text-sidebar-foreground">
            <span className="text-sm font-medium">Equipo Match</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
