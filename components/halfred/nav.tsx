import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { HalfButton } from "@/components/halfred/half";
import { BRAND_LOGO } from "@/components/ui/kit";
import type { HalfredCopy } from "@/data/content";

/**
 * Barre propre au monde Halfred ; le dock du hub est masqué sur ces routes.
 * Le menu mobile est un `<details>` natif : aucun JavaScript.
 */
export default function Nav({ t }: { t: HalfredCopy }) {
  const links = [
    ["#halfred", t.nav.about],
    ["#tarifs", t.nav.pricing],
    ["#contact", t.nav.contact],
  ] as const;
  return (
    <header className="hr-nav">
      <nav aria-label={t.nav.label} className="hr-wrap flex h-16 items-center justify-between gap-6">
        <a href={t.home} className="flex items-center gap-2.5 font-medium">
          <Image src={BRAND_LOGO.halfred} alt="" width={28} height={28} className="rounded-md" />
          Halfred
        </a>
        <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="transition-colors hover:text-foreground">{label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href={t.hub.href}
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline"
          >
            {t.hub.label} ↗
          </Link>
          <HalfButton href="#contact" small>{t.ctaContact}</HalfButton>
          <details className="hr-menu md:hidden">
            <summary aria-label={t.nav.menu}>
              <Menu className="size-4" aria-hidden />
            </summary>
            <ul>
              {links.map(([href, label]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
              <li><Link href={t.hub.href}>{t.hub.label} ↗</Link></li>
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
