import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import SiteKinds, { type Kind } from "@/components/halfred/site-kinds";
import type { HalfredCopy, Offer } from "@/data/content";

/**
 * Service à côté, sans lien avec l'automatisation : sites et applications web
 * (vitrine, site marchand, application : prix des offres `site`, `shop`, `webapp`).
 * Trois formules (`SiteKinds`) : texte et prix « à partir de » à gauche, deux
 * captures de modèles open source à droite (exemples de rendus, crédités).
 * Prix lu dans `OFFERS`.
 */
export default function Site({ t, offers }: { t: HalfredCopy; offers: readonly Offer[] }) {
  const [before, after] = t.site.title[1].split(t.site.accent);
  const kinds: Kind[] = t.site.kinds.flatMap((k) => {
    const offer = offers.find((o) => o.id === k.offer);
    if (!offer) return [];
    const shots = k.shots.flatMap(([file, label]) => {
      const src = halfredImage(`site-${file}.webp`);
      return src ? [{ src, label }] : [];
    });
    return [{ offer, body: k.body, shots }];
  });
  return (
    <section id="site" className="hr-section hr-site">
      <div className="hr-wrap hr-about--wide">
        <BlurFade inView>
          <p className="hr-local__eyebrow">{t.site.eyebrow}</p>
          <h2 className="hr-display hr-h2 mt-5">
            <span className="hr-about__line">{t.site.title[0]}</span>{" "}
            <span className="hr-about__line">{before}<span className="hr-red">{t.site.accent}</span>{after}</span>
          </h2>
          <p className="hr-about__sub mt-4">{t.site.body}</p>
        </BlurFade>
        <SiteKinds kinds={kinds} />
        <p className="hr-site__credit">{t.site.credit}</p>
      </div>
    </section>
  );
}
