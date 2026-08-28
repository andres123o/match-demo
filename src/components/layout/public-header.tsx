import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function PublicHeader({ cta }: { cta?: React.ReactNode }) {
  return (
    <header className="bg-brand-ink">
      <div className="flex w-full items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/">
          <Logo variant="onDark" />
        </Link>
        {cta}
      </div>
    </header>
  );
}
