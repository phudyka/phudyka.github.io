import BlurFade from "@/components/blur-fade";
import { HalfBadge, HalfButton, LightButton } from "@/components/halfred/half";
import type { HalfredCopy } from "@/data/content";

/**
 * Premier écran : l'horizon d'éclipse s'allume, puis le texte arrive avec la
 * grammaire `BlurFade`. C'est la seule chorégraphie du monde Halfred.
 */
export default function Hero({ t }: { t: HalfredCopy }) {
  return (
    <section className="hr-hero" aria-labelledby="hr-title">
      <div aria-hidden className="hr-eclipse hr-ignite" />
      <div className="relative flex max-w-4xl flex-col items-center gap-7">
        <BlurFade delay={0.5}>
          <HalfBadge tag={t.badge[0]}>{t.badge[1]}</HalfBadge>
        </BlurFade>
        <BlurFade delay={0.6} duration={0.8} blur="14px" yOffset={12}>
          <h1 id="hr-title" className="hr-display hr-h1 hr-half-text text-balance">
            {t.title}
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
