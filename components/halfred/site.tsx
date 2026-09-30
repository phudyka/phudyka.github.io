import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import RefText from "@/components/halfred/ref-text";
import SiteKinds, { type Kind } from "@/components/halfred/site-kinds";
import type { HalfredCopy, Offer } from "@/data/content";

/**
 * Service à côté, sans lien avec l'automatisation : sites et applications web
 * (vitrine, site marchand, application : prix des offres `site`, `shop`, `webapp`).
 * Trois formules (`SiteKinds`) : texte et prix « à partir de » à gauche, la
 * réalisation correspondante sur un iMac à droite, les réalisations citées dessous.
 * Prix lu dans `OFFERS`.
 */
// Favicon de chaque réalisation, dans son onglet ; à défaut, son initiale.
const ICONS: Record<string, string> = { halfred: "/brand/halfred-32.png", nikki: "/brand/nikki.svg", poolcenter: "/brand/poolcenter.webp" };

export default function Site({ t, offers }: { t: HalfredCopy; offers: readonly Offer[] }) {
  const [before, after] = t.site.title[1].split(t.site.accent);
  const kinds: Kind[] = t.site.kinds.flatMap((k) => {
    const offer = offers.find((o) => o.id === k.offer);
    if (!offer) return [];
    const src = halfredImage(`site-${k.shot[0]}.webp`);
    if (!src) return [];
    return [{ offer, body: k.body, points: k.points, shot: { src, label: k.shot[1], icon: ICONS[k.shot[0]] ?? null } }];
  });
  return (
    <section id="site" className="hr-section hr-site">
      <div className="hr-wrap hr-about--wide">
        <SiteKinds
          intro={(
            <BlurFade inView>
              <p className="hr-local__eyebrow">{t.site.eyebrow}</p>
              <h2 className="hr-display hr-h2 mt-5">
                <span className="hr-about__line">{t.site.title[0]}</span>{" "}
                <span className="hr-about__line">{before}<span className="hr-red">{t.site.accent}</span>{after}</span>
              </h2>
              <p className="hr-about__sub mt-4">{t.site.body}</p>
            </BlurFade>
          )}
          refs={<RefText parts={t.site.refs} className="hr-refs--mock" />}
          kinds={kinds}
          vat={t.pricing.vat}
        />
      </div>
    </section>
  );
}
