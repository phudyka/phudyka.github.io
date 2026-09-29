import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { HalfButton } from "@/components/halfred/half";
import MenuList from "@/components/halfred/menu-list";
import { BRAND_LOGO } from "@/components/ui/kit";
import type { HalfredCopy } from "@/data/content";

/**
 * Barre propre au monde Halfred ; le dock du hub est masqué sur ces routes.
 * Le menu est un `<details>` natif (sous 1024 px, pour garder le lien vers le
 * hub) ; seul `MenuList` est client, pour le refermer après un choix.
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
            {t.hub.label}
          </Link>
          {/* Sous 420 px, le logo, ce bouton et le menu ne tiennent pas ensemble ; le menu garde « Contact ». */}
          <span className="hidden min-[420px]:contents">
            <HalfButton href="#contact" small>{t.ctaContact}</HalfButton>
          </span>
          <details className="hr-menu lg:hidden">
            <summary aria-label={t.nav.menu}>
              <Menu className="size-4" aria-hidden />
            </summary>
            <MenuList>
              {links.map(([href, label]) => (
                <li key={href} className="md:hidden"><a href={href}>{label}</a></li>
              ))}
              <li><Link href={t.hub.href}>{t.hub.label}</Link></li>
            </MenuList>
          </details>
        </div>
      </nav>
    </header>
  );
}
