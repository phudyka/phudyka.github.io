import { display } from "@/components/halfred/font";
import Hero from "@/components/halfred/hero";
import Nav from "@/components/halfred/nav";
import { HALFRED } from "@/data/content";
import { HALFRED_EN } from "@/data/content.en";

/**
 * Landing Halfred, rendue une fois pour les deux langues (monde « Half-red »,
 * spec du 2026-09-29). Pleine largeur : elle ne passe pas par `Column`, mais
 * pose elle-même `data-brand="halfred"`, qui active ses jetons.
 */
export type Lang = "fr" | "en";

export function HalfredBody({ lang }: { lang: Lang }) {
  const t = lang === "en" ? HALFRED_EN : HALFRED;
  return (
    <main id="contenu" data-brand="halfred" className={`hr-root ${display.variable}`}>
      <Nav t={t} />
      <Hero t={t} />
    </main>
  );
}
