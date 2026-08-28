import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { InfluencerWizard } from "@/components/wizard/influencer-wizard";

export default function RegistroPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader
        cta={
          <Link href="/" className="text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white">
            Ya tengo una cuenta
          </Link>
        }
      />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <h1 className="mx-auto mb-8 max-w-5xl text-center font-heading text-3xl font-semibold text-foreground">
          Únete a la red de creadores de Match
        </h1>
        <InfluencerWizard />
      </main>
    </div>
  );
}
