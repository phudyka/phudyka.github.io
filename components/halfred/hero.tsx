import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import WordRotate from "@/components/magicui/word-rotate";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy } from "@/data/content";

/**
 * Premier écran : l'éclipse (rendu de Paul, lueur CSS à défaut) s'allume, puis le texte arrive avec la
 * grammaire `BlurFade`. Le titre se lit comme une soustraction posée : l'entreprise, puis, décalé en
 * dessous, un signe moins dessiné et ce qu'on retire. Le qualificatif tourne (`WordRotate`) ; le
 * premier, en texte masqué, est celui que lisent les lecteurs d'écran.
 */
export default function Hero({ t }: { t: HalfredCopy }) {
  const hero = halfredImage("hero.webp");
  const { top, minus, before, loop, after } = t.title;
  return (
    <section className="hr-hero" aria-labelledby="hr-title">
      {hero
        ? <Image src={hero} alt="" width={3200} height={1350} priority className="hr-hero__art hr-ignite" />
        : <div aria-hidden className="hr-eclipse hr-ignite" />}
      <div className="relative flex max-w-4xl flex-col items-center gap-8">
        <BlurFade delay={0.5} duration={0.8} blur="14px" yOffset={12}>
          <h1 id="hr-title" className="hr-display hr-h1 hr-title">
            <span className="hr-title__top">{top}</span>
            <span className="hr-title__rest">
              <span className="hr-minus" aria-hidden="true" />
              <span className="sr-only">{` ${minus} `}</span>
              {before}
              <span className="sr-only">{`${loop[0]}${after}`}</span>
              <WordRotate words={loop} suffix={after} className="hr-red" />
            </span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.65}>
          <p className="hr-lead mx-auto">
            {t.lead.map((line) => <span key={line} className="block">{line}</span>)}
          </p>
        </BlurFade>
        <BlurFade delay={0.75}>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#contact" className="hr-cta">
              {t.ctaContact}
              <span className="hr-cta__knob" aria-hidden="true"><ArrowRight className="size-4" /></span>
            </a>
            <a href="#tarifs" className="hr-ghost">
              {t.ctaPricing}
              <ArrowDown className="hr-ghost__icon size-4" aria-hidden />
            </a>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
