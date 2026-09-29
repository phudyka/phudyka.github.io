import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy, Offer } from "@/data/content";

/**
 * L'offre 100 % local, à part : le bloc noir en grand à gauche, dont la fente
 * rouge se prolonge en trait jusque sous le texte. Direction épurée, façon
 * science-fiction des années 70 : capitales très espacées, filets fins, beaucoup
 * de noir. Prix lu dans `OFFERS`.
 */
export default function Local({ t, offer }: { t: HalfredCopy; offer: Offer | undefined }) {
  const vault = halfredImage("step-5.webp");
  const [before, after] = t.local.title[1].split(t.local.accent);
  return (
    <section id="local" className="hr-section hr-local">
      <div className="hr-wrap hr-about--wide grid items-center gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
        {vault
          ? <Image src={vault} alt={t.local.alt} width={1600} height={1200} className="hr-local__art" />
          : null}
        <BlurFade inView>
          <p className="hr-local__eyebrow">{t.local.eyebrow}</p>
          <h2 className="hr-display hr-h2 mt-5">
            <span className="hr-about__line">{t.local.title[0]}</span>{" "}
            <span className="hr-about__line">{before}<span className="hr-red">{t.local.accent}</span>{after}</span>
          </h2>
          <ol className="hr-local__points">
            {t.local.points.map((point, i) => (
              <li key={point}>
                <span className="num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
          {offer
            ? (
              <div className="hr-local__price">
                <p className="num hr-display">{offer.price}</p>
                <p className="text-sm text-muted-foreground">{offer.name}{offer.note ? ` · ${offer.note}` : ""}</p>
              </div>
            )
            : null}
        </BlurFade>
      </div>
    </section>
  );
}
