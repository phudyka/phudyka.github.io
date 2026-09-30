import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Gains from "@/components/halfred/gains";
import type { HalfredCopy } from "@/data/content";

/**
 * Les lames rouges en bannière sur toute la largeur ; par-dessus, centrés : à
 * quoi ressemble le travail sans automatisation : trois cartes à mini-démo
 * (tâches qui reviennent, oublis, ressaisies). La solution suit (Principe).
 */
export default function About({ t }: { t: HalfredCopy }) {
  const fins = halfredImage("fins.webp");
  return (
    <section id="halfred" className="hr-section hr-banner">
      {fins
        ? <Image src={fins} alt="" width={3200} height={1352} className="hr-banner__art" />
        : null}
      <div className="hr-wrap hr-about hr-guards">
        <BlurFade inView duration={0.9} yOffset={16} blur="12px">
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
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <Gains items={t.about.gains} />
        </BlurFade>
      </div>
    </section>
  );
}
