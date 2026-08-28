import { Separator } from "@/components/ui/separator";
import { PAISES, REDES_SOCIALES, getBancos } from "@/lib/catalogs";
import type { WizardData } from "./wizard-data";

function Fila({ etiqueta, valor }: { etiqueta: string; valor?: string | number | null }) {
  if (!valor && valor !== 0) return null;
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{etiqueta}</span>
      <span className="text-right font-medium text-foreground">{valor}</span>
    </div>
  );
}

export function StepRevision({ data }: { data: WizardData }) {
  const pais = PAISES.find((p) => p.id === data.paisId)?.nombre;
  const banco = getBancos(data.paisId).find((b) => b.id === data.banco.bancoId)?.nombre ?? data.banco.bancoNombreOtro;
  const documentosAdjuntos = Object.entries(data.documentos).filter(([, f]) => f);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border p-4">
        <p className="mb-1 font-heading text-sm font-semibold text-foreground">Representación</p>
        <Fila etiqueta="Tipo" valor={data.representacion} />
        <Fila etiqueta="País" valor={pais} />
        {data.representacion !== "DIRECTO" && (
          <>
            <Fila etiqueta="Nombre" valor={data.entidad.nombre} />
            <Fila etiqueta="Correo" valor={data.entidad.correo} />
          </>
        )}
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="mb-1 font-heading text-sm font-semibold text-foreground">Documentos y banco</p>
        <Fila etiqueta="Documentos adjuntos" valor={documentosAdjuntos.length} />
        <Fila etiqueta="Banco" valor={banco} />
        <Fila etiqueta="Tipo de cuenta" valor={data.banco.tipoCuenta} />
        <Fila etiqueta="Número de cuenta" valor={data.banco.numeroCuenta} />
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="mb-1 font-heading text-sm font-semibold text-foreground">Datos del influencer</p>
        <Fila etiqueta="Nombre" valor={data.influencer.nombreCompleto} />
        <Fila etiqueta="Correo" valor={data.influencer.correo} />
        <Fila etiqueta="Ciudad" valor={data.influencer.ciudadId} />
        <Fila etiqueta="Categorías" valor={data.influencer.categorias.join(", ")} />
        <Fila etiqueta="Nichos" valor={data.influencer.nichos.join(", ")} />
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="mb-2 font-heading text-sm font-semibold text-foreground">Redes sociales</p>
        {data.redesSociales.map((r, i) => {
          const nombre = REDES_SOCIALES.find((cat) => cat.id === r.plataforma)?.nombre ?? r.plataforma;
          return (
            <div key={r.key}>
              {i > 0 && <Separator className="my-2" />}
              <Fila etiqueta={nombre} valor={`${r.usuario} · ${Number(r.seguidores).toLocaleString("es-CO")} seguidores`} />
            </div>
          );
        })}
      </div>

      <p className="rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
        Modo demo: esta información se guarda solo en tu navegador para esta demostración, no se envía a un servidor real.
      </p>
    </div>
  );
}
