import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import { HalfBadge, HalfButton, LightButton } from "@/components/halfred/half";
import type { HalfredCopy } from "@/data/content";

/**
 * Premier écran : l'éclipse (rendu de Paul, lueur CSS à défaut) s'allume, puis le texte arrive avec la
 * grammaire `BlurFade`. C'est la seule chorégraphie du monde Halfred.
 */
const WORD = { w: "", r: "hr-red", half: "hr-half-text" } as const;

export default function Hero({ t }: { t: HalfredCopy }) {
  const hero = halfredImage("hero.webp");
  return (
    <section className="hr-hero" aria-labelledby="hr-title">
      {hero
        ? <Image src={hero} alt="" width={3200} height={1350} priority className="hr-hero__art hr-ignite" />
        : <div aria-hidden className="hr-eclipse hr-ignite" />}
      <div className="relative flex max-w-4xl flex-col items-center gap-7">
        <BlurFade delay={0.5}>
          <HalfBadge tag={t.badge[0]}>{t.badge[1]}</HalfBadge>
        </BlurFade>
        <BlurFade delay={0.6} duration={0.8} blur="14px" yOffset={12}>
          <h1 id="hr-title" className="hr-display hr-h1 text-balance">
            {t.title.map(([word, tone], i) => (
              <span key={word} className={WORD[tone]}>{i > 0 ? " " : ""}{word}</span>
            ))}
          </h1>
        </BlurFade>
        <BlurFade delay={0.72}>
          <p className="hr-lead mx-auto max-w-[52ch]">{t.lead}</p>
        </BlurFade>
        <BlurFade delay={0.8}>
          <div className="flex flex-wrap justify-center gap-3">
            <HalfButton href="#contact">{t.ctaContact}</HalfButton>
            <LightButton href="#tarifs">{t.ctaPricing}</LightButton>
          </div>
        </BlurFade>
        <BlurFade delay={0.9}>
          <p className="text-sm text-muted-foreground">{t.place}</p>
        </BlurFade>
      </div>
    </section>
  );
}
