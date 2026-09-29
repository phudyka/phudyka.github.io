import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Steps from "@/components/halfred/steps";
import type { HalfredCopy, Offer } from "@/data/content";

type Terms = ReadonlyArray<readonly [string, string]>;

/**
 * Parcours en six étapes (onglets verticaux, image par étape `step-N.webp`),
 * du premier échange à l'agent local. Chaque étape affiche le prix de ses
 * offres (lu dans `OFFERS`, jamais recopié). Les offres hors parcours passent
 * « à côté ».
 */
export default function Pricing(
  { t, offers, terms }: { t: HalfredCopy; offers: readonly Offer[]; terms: Terms },
) {
  const byId = new Map(offers.map((o) => [o.id, o]));
  const onPath = new Set(t.pricing.steps.flatMap((s) => s.offers));
  const aside = offers.filter((o) => !onPath.has(o.id));
  return (
    <>
    <section id="tarifs" className="hr-section">
      <div className="hr-wrap">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 hr-pricing__title">{t.pricing.title}</h2>
          <p className="hr-about__sub mt-3">{t.pricing.lead}</p>
        </BlurFade>
        <div className="mt-8">
          <Steps
            prev={t.pricing.prev}
            next={t.pricing.next}
            stop={t.pricing.stop}
            aside={
              <div className="mt-5">
                {aside.map((offer) => (
                  <p key={offer.id} className="num text-sm">
                    <span className="font-medium text-[var(--hr-glow)]">{t.pricing.aside}</span>
                    {t.pricing.colon}{offer.name}, {offer.price}. <span className="text-muted-foreground">{offer.who}</span>
                  </p>
                ))}
                <p className="num mt-2 text-xs leading-relaxed text-muted-foreground">
                  {terms.map(([label, value]) => `${label}${t.pricing.colon}${value}`).join(" · ")}
                </p>
              </div>
            }
            steps={t.pricing.steps.map((step, i) => ({
              title: step.title,
              body: step.body,
              detail: step.detail,
              offers: step.offers.flatMap((id) => byId.get(id) ?? []),
              image: halfredImage(`step-${i + 1}.webp`),
            }))}
          />
        </div>
      </div>
    </section>
    </>
  );
}
