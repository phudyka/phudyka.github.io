import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Steps from "@/components/halfred/steps";
import type { HalfredCopy, Offer } from "@/data/content";

/** Passe en rouge les mots `accents` d'un titre (mots simples, sans caractère spécial). */
export function accented(text: string, accents: readonly string[]) {
  if (!accents.length) return text;
  const re = new RegExp(`(${accents.join("|")})`);
  return text.split(re).map((part, i) => (accents.includes(part) ? <span key={i} className="hr-red">{part}</span> : part));
}

/**
 * Parcours en cinq étapes : chacune dit ce qu'elle fait, pour qui, et son prix
 * (lu dans `OFFERS`, jamais recopié). Le 100 % local et le site
 * vitrine ont leur propre section.
 */
export default function Pricing(
  { t, offers }: { t: HalfredCopy; offers: readonly Offer[] },
) {
  const byId = new Map(offers.map((o) => [o.id, o]));
    return (
    <section id="tarifs" className="hr-section">
      <div className="hr-wrap hr-about--wide">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 hr-pricing__title">
            {t.pricing.title.split("\n").map((line) => (
              <span key={line} className="hr-about__line">{accented(line, t.pricing.accents)}</span>
            ))}
          </h2>
          <p className="hr-lead mt-4 max-w-[60ch]">{t.pricing.size}</p>
        </BlurFade>
        <div className="mt-10">
          <Steps
            vat={t.pricing.vat}
            steps={t.pricing.steps.map((step) => ({
              title: step.title,
              body: step.body,
              who: step.who,
              offers: step.offers.flatMap((id) => byId.get(id) ?? []),
              images: [step.image].flat().map((n) => halfredImage(`step-${n}.webp`)),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
