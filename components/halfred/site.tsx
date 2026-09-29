import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy, Offer } from "@/data/content";

/**
 * Service à côté, sans lien avec l'automatisation : sites et applications web
 * (vitrine au prix de l'offre `site`, le reste sur devis).
 * Miroir de la section « 100 % local » (texte à gauche, image à droite).
 * Prix lu dans `OFFERS`. Sans `site.webp`, la section tient sans image.
 */
export default function Site({ t, offer }: { t: HalfredCopy; offer: Offer | undefined }) {
  const art = halfredImage("site.webp");
  const [before, after] = t.site.title[1].split(t.site.accent);
  return (
    <section id="site" className="hr-section hr-site">
      <div className={`hr-wrap hr-about--wide grid items-center gap-12 ${art ? "md:grid-cols-[1fr_1.3fr]" : ""} md:gap-16`}>
        <BlurFade inView>
          <p className="hr-local__eyebrow">{t.site.eyebrow}</p>
          <h2 className="hr-display hr-h2 mt-5">
            <span className="hr-about__line">{t.site.title[0]}</span>{" "}
            <span className="hr-about__line">{before}<span className="hr-red">{t.site.accent}</span>{after}</span>
          </h2>
          <p className="hr-about__sub mt-5 max-w-[46ch] !whitespace-normal">{t.site.body}</p>
          <div className="hr-site__prices">
            {offer
              ? (
                <div className="hr-local__price">
                  <p className="num hr-display">{offer.price}</p>
                  <p className="text-sm text-muted-foreground">{offer.name}</p>
                </div>
              )
              : null}
            <div className="hr-local__price">
              <p className="num hr-display">{t.site.more[0]}</p>
              <p className="text-sm text-muted-foreground">{t.site.more[1]}</p>
            </div>
          </div>
        </BlurFade>
        {art
          ? <Image src={art} alt={t.site.alt} width={1600} height={1200} className="hr-local__art" />
          : null}
      </div>
    </section>
  );
}
