import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy, Offer } from "@/data/content";

type Terms = ReadonlyArray<readonly [string, string]>;

/**
 * Parcours au scroll : une ligne rouge se remplit le long des étapes, du
 * premier échange à l'agent local. Chaque étape affiche le prix de ses offres
 * (lu dans `OFFERS`, jamais recopié). Les offres hors parcours passent « à côté ».
 */
export default function Pricing(
  { t, offers, terms }: { t: HalfredCopy; offers: readonly Offer[]; terms: Terms },
) {
  const spheres = halfredImage("spheres.webp");
  const byId = new Map(offers.map((o) => [o.id, o]));
  const onPath = new Set(t.pricing.steps.flatMap((s) => s.offers));
  const aside = offers.filter((o) => !onPath.has(o.id));
  return (
    <>
    {spheres
      ? <Image src={spheres} alt="" width={3200} height={1350} className="hr-band" />
      : null}
    <section id="tarifs" className="hr-section">
      <div className="hr-wrap">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 max-w-[18ch]">{t.pricing.title}</h2>
          <p className="hr-lead mt-4 max-w-[60ch]">{t.pricing.lead}</p>
        </BlurFade>
        <ol className="hr-path mt-16">
          {t.pricing.steps.map((step, i) => (
            <li key={step.title} className={step.detail ? "hr-step hr-step--focus" : "hr-step"}>
              <span className="hr-step__node num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div className="hr-step__text">
                <BlurFade inView>
                  <h3 className="hr-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{step.title}</h3>
                  <p className="hr-lead mt-3 max-w-[52ch]">{step.body}</p>
                  {step.detail
                    ? (
                      <ul className="hr-step__list">
                        {step.offers.flatMap((id) => byId.get(id)?.included ?? []).map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )
                    : null}
                </BlurFade>
              </div>
              <div className="hr-step__prices">
                <BlurFade inView delay={0.08}>
                  {step.offers.map((id) => {
                    const offer = byId.get(id);
                    return offer
                      ? (
                        <div key={id} className="hr-price">
                          <p className="text-sm text-muted-foreground">{offer.name}</p>
                          <p className="num hr-display mt-1 text-2xl font-semibold tracking-tight">{offer.price}</p>
                          {offer.note ? <p className="num mt-1 text-xs text-foreground/70">{offer.note}</p> : null}
                        </div>
                      )
                      : null;
                  })}
                </BlurFade>
              </div>
            </li>
          ))}
        </ol>
        {aside.map((offer) => (
          <p key={offer.id} className="num mt-12 text-base">
            <span className="hr-red font-medium">{t.pricing.aside}</span>
            {t.pricing.colon}{offer.name}, {offer.price}. <span className="text-muted-foreground">{offer.who}</span>
          </p>
        ))}
        <p className="num mt-4 text-sm leading-relaxed text-muted-foreground">
          {terms.map(([label, value]) => `${label}${t.pricing.colon}${value}`).join(" · ")}
        </p>
      </div>
    </section>
    </>
  );
}
