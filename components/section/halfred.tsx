import { halfredImage } from "@/components/halfred/asset";
import { display } from "@/components/halfred/font";
import About from "@/components/halfred/about";
import Flow from "@/components/halfred/flow";
import Footer from "@/components/halfred/footer";
import Hero from "@/components/halfred/hero";
import Nav from "@/components/halfred/nav";
import Pricing from "@/components/halfred/pricing";
import { HALFRED, OFFERS, TERMS } from "@/data/content";
import { HALFRED_EN, OFFERS_EN, TERMS_EN } from "@/data/content.en";

/**
 * Landing Halfred, rendue une fois pour les deux langues (monde « Half-red »,
 * spec du 2026-09-29). Pleine largeur : elle ne passe pas par `Column`, mais
 * pose elle-même `data-brand="halfred"`, qui active ses jetons.
 */
export type Lang = "fr" | "en";

export function HalfredBody({ lang }: { lang: Lang }) {
  const t = lang === "en" ? HALFRED_EN : HALFRED;
  const offers = lang === "en" ? OFFERS_EN : OFFERS;
  const terms = lang === "en" ? TERMS_EN : TERMS;
  return (
    <main id="contenu" data-brand="halfred" className={`hr-root ${display.variable}`}>
      <Nav t={t} />
      <Hero t={t} />
      <About t={t} />
      <Flow t={t} spheres={halfredImage("spheres.webp")} />
      <Pricing t={t} offers={offers} terms={terms} />
      <Footer t={t} lang={lang} />
    </main>
  );
}
