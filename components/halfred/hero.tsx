import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import WordRotate from "@/components/magicui/word-rotate";
import { halfredImage } from "@/components/halfred/asset";
import EclipseStart from "@/components/halfred/eclipse-start";
import type { HalfredCopy } from "@/data/content";

/**
 * Premier écran : l'éclipse (rendu de Paul, lueur CSS à défaut) s'allume, puis le texte arrive avec la
 * grammaire `BlurFade`. Le titre se lit comme une soustraction posée : l'entreprise, puis, décalé en
 * dessous, « moins » en rouge et ce qu'on retire. Bloc aligné à gauche, sur la moitié sombre. Le qualificatif tourne (`WordRotate`) ; le
 * premier, en texte masqué, est celui que lisent les lecteurs d'écran.
 */
export default function Hero({ t }: { t: HalfredCopy }) {
  const hero = halfredImage("hero.jpg");
  const { top, minus, before, loop, after } = t.title;
  return (
    <section className="hr-hero" aria-labelledby="hr-title">
      {hero ? (
        <div className="hr-hero__stage">
          <div className="hr-hero__frame">
            <Image src={hero} alt="" width={3840} height={1620} priority className="hr-hero__art" />
          </div>
          <EclipseStart />
          <noscript><style>{".hr-hero *, .hr-hero *::after { animation-play-state: running !important; }"}</style></noscript>
        </div>
      ) : <div aria-hidden className="hr-eclipse hr-ignite" />}
      <div className="hr-wrap relative flex flex-col items-start gap-8">
        <BlurFade delay={0.5} duration={1.1} yOffset={18}>
          <h1 id="hr-title" className="hr-display hr-h1 hr-title">
            <span className="hr-title__top">{top}</span>
            <span className="hr-title__rest">
              <span className="hr-red">{minus}</span>{" "}
              {before}
              <span className="sr-only">{`${loop[0]}${after}`}</span>
              <WordRotate words={loop} suffix={after} className="hr-red" />
            </span>
            {/* Lumière de l'anneau : une copie du titre, par-dessus, qui ne garde
                que l'éclairage et s'éteint avec la distance à la source (masque
                radial centré sur l'anneau). Décorative. Sans le mot qui tourne :
                deux copies animées se décalaient et laissaient une bande ; ce
                mot, le plus proche de l'anneau, porte sa lumière lui-même. */}
            <span className="hr-title__light" aria-hidden>
              <span className="hr-title__top">{top}</span>
              <span className="hr-title__rest">
                <span className="hr-red">{minus}</span>{" "}
                {before}
              </span>
            </span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.7} duration={0.9} yOffset={12}>
          <p className="hr-lead">{t.lead}</p>
        </BlurFade>
        <BlurFade delay={0.85} duration={0.9} yOffset={12}>
          <div className="flex flex-wrap gap-3">
            <a href="#contact" className="hr-cta">
              {t.ctaContact}
              <ArrowRight className="hr-cta__icon size-4" aria-hidden />
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
