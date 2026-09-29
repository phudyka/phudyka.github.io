import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Steps from "@/components/halfred/steps";
import type { HalfredCopy, Offer } from "@/data/content";

type Terms = ReadonlyArray<readonly [string, string]>;

/** Passe en rouge les mots `accents` d'un titre (mots simples, sans caractère spécial). */
export function accented(text: string, accents: readonly string[]) {
  if (!accents.length) return text;
  const re = new RegExp(`(${accents.join("|")})`);
  return text.split(re).map((part, i) => (accents.includes(part) ? <span key={i} className="hr-red">{part}</span> : part));
}

/**
 * Parcours en cinq étapes : chacune dit ce qu'elle fait, pour qui, et son prix
 * (lu dans `OFFERS`, jamais recopié). L'offre 100 % local a sa propre section ;
 * les autres offres hors parcours passent « à côté ».
 */
export default function Pricing(
  { t, offers, terms }: { t: HalfredCopy; offers: readonly Offer[]; terms: Terms },
) {
  const byId = new Map(offers.map((o) => [o.id, o]));
  const onPath = new Set([...t.pricing.steps.flatMap((s) => s.offers), "local"]);
  const aside = offers.filter((o) => !onPath.has(o.id));
  return (
    <section id="tarifs" className="hr-section">
      <div className="hr-wrap hr-about--wide">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 hr-pricing__title">{accented(t.pricing.title, t.pricing.accents)}</h2>
          <p className="hr-about__sub mt-3">{t.pricing.lead}</p>
        </BlurFade>
        <div className="mt-8">
          <Steps
            stop={t.pricing.stop}
            aside={
              <div className="mt-8">
                {aside.map((offer) => (
                  <p key={offer.id} className="num text-sm">
                    <span className="font-medium text-[var(--hr-glow)]">{t.pricing.aside}</span>
                    {t.pricing.colon}{offer.name}, {offer.price}.
                  </p>
                ))}
                <p className="num mt-2 text-xs leading-relaxed text-muted-foreground">
                  {terms.map(([label, value]) => `${label}${t.pricing.colon}${value}`).join(" · ")}
                </p>
              </div>
            }
            steps={t.pricing.steps.map((step) => ({
              title: step.title,
              body: step.body,
              who: step.who,
              offers: step.offers.flatMap((id) => byId.get(id) ?? []),
              image: halfredImage(`step-${step.image}.webp`),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
