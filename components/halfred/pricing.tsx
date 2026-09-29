import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy, Offer } from "@/data/content";

type Terms = ReadonlyArray<readonly [string, string]>;

/**
 * Les huit offres, en cartes coupées moitié rouge / moitié noire. Le détail
 * « inclus » est replié (`<details>`) pour garder l'écran léger.
 */
export default function Pricing(
  { t, offers, terms }: { t: HalfredCopy; offers: readonly Offer[]; terms: Terms },
) {
  const spheres = halfredImage("spheres.webp");
  return (
    <section id="tarifs" className="hr-section">
      {spheres
        ? <Image src={spheres} alt="" width={2560} height={1080} className="hr-band" />
        : null}
      <div className="hr-wrap">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 max-w-[18ch]">{t.pricing.title}</h2>
          <p className="hr-lead mt-4 max-w-[60ch]">{t.pricing.lead}</p>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((offer) => (
              <li key={offer.id} className="hr-card">
                <div className="hr-card__top">
                  <h3 className="font-medium leading-snug">{offer.name}</h3>
                  <p className="num hr-display mt-3 text-2xl font-semibold tracking-tight">{offer.price}</p>
                  {offer.note
                    ? <p className="num mt-1 text-xs text-white/75">{offer.note}</p>
                    : null}
                </div>
                <p className="hr-card__who">{offer.who}</p>
                <details className="hr-card__more">
                  <summary>{t.pricing.included}</summary>
                  <ul>
                    {offer.included.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </BlurFade>
        <p className="num mt-8 text-sm leading-relaxed text-muted-foreground">
          {terms.map(([label, value]) => `${label}${t.pricing.colon}${value}`).join(" · ")}
        </p>
      </div>
    </section>
  );
}
