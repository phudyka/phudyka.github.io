import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Gains from "@/components/halfred/gains";
import type { HalfredCopy } from "@/data/content";

/**
 * Les lames rouges en bannière sur toute la largeur ; par-dessus, centrés : à
 * quoi sert l'automatisation (trois cartes à mini-démo), les garde-fous en
 * une ligne, puis Paul.
 */
export default function About({ t }: { t: HalfredCopy }) {
  const fins = halfredImage("fins.webp");
  return (
    <section id="halfred" className="hr-section hr-banner">
      {fins
        ? <Image src={fins} alt="" width={2800} height={1576} className="hr-banner__art" />
        : null}
      <div className="hr-wrap hr-about hr-guards">
        <BlurFade inView>
          <h2 className="hr-display hr-h2">
            <span className="hr-about__line">{t.about.title[0]}</span>{" "}
            <span className="hr-about__line">
              {(() => {
                const [before, after] = t.about.title[1].split(t.about.accent);
                return <>{before}<span className="hr-red">{t.about.accent}</span>{after}</>;
              })()}
            </span>
          </h2>
          <p className="hr-about__sub mt-4">{t.about.halfred}</p>
          <ul className="hr-safe" aria-label={t.about.safeguardsTitle}>
            {t.about.safeguards.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <Gains items={t.about.gains} />
        </BlurFade>
        <BlurFade inView delay={0.16}>
          <Link href={t.hub.href} className="hr-paul">
            <span className="hr-portrait">
              <Image src="/paul-hudyka.webp" alt="" width={176} height={176} />
            </span>
            <span className="flex flex-col text-left">
              <span className="font-medium">{t.about.paul[0]}</span>
              <span className="text-sm text-muted-foreground [text-wrap:balance]">{t.about.paul[1]}</span>
            </span>
            <ArrowUpRight className="hr-paul__icon size-4" aria-hidden />
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
