import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import MenuList from "@/components/halfred/menu-list";
import type { HalfredCopy } from "@/data/content";

/**
 * Barre propre au monde Halfred ; le dock du hub est masqué sur ces routes.
 * Le menu est un `<details>` natif (sous 1024 px, pour garder le lien vers le
 * hub) ; seul `MenuList` est client, pour le refermer après un choix.
 */
export default function Nav({ t }: { t: HalfredCopy }) {
  const links = [
    ["#halfred", t.nav.about],
    ["#local", t.nav.local],
    ["#site", t.nav.site],
    ["#tarifs", t.nav.pricing],
    ["#contact", t.nav.contact],
  ] as const;
  return (
    <header className="hr-nav">
      <nav aria-label={t.nav.label} className="hr-wrap flex h-16 items-center justify-between gap-6">
        {/* Le mot-marque du footer, en petit. Au survol, les moitiés s'échangent,
            lettre par lettre depuis la coupure. */}
        <a href={t.home} aria-label="Halfred" className="hr-mark hr-display inline-flex items-center gap-2 text-xl font-semibold tracking-[-0.04em]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/halfred.webp" alt="" width={24} height={24} className="size-6 rounded-md" />
          <span aria-hidden="true">
            {[..."Half"].map((c, i) => <span key={i} data-side="w" style={{ "--d": 3 - i } as CSSProperties}>{c}</span>)}
            {[..."red"].map((c, i) => <span key={i} data-side="r" style={{ "--d": i } as CSSProperties}>{c}</span>)}
          </span>
        </a>
        <ul className="hidden items-center gap-6 text-sm lg:gap-8 text-muted-foreground md:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hr-navlink">{label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          {/* Vers le hub : au survol, le portrait de Paul se pose à côté du nom. */}
          <Link href={t.hub.href} className="hr-hub hidden text-sm lg:inline-flex">
            <Image src="/paul-hudyka.webp" alt="" width={48} height={48} className="hr-hub__face" />
            {t.hub.label}
          </Link>
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
