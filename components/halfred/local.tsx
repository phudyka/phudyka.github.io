import type { CSSProperties } from "react";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import VaultStage from "@/components/halfred/vault-stage";
import type { HalfredCopy, Offer } from "@/data/content";

/**
 * L'offre 100 % local, à part : le bloc noir découpé, posé sur un sol de
 * marbre, avec des anneaux de lumière derrière lui (`VaultStage`). Direction épurée, façon
 * science-fiction des années 70 : capitales très espacées, filets fins, beaucoup
 * de noir. Prix lu dans `OFFERS`.
 */
export default function Local({ t, offer }: { t: HalfredCopy; offer: Offer | undefined }) {
  const vault = halfredImage("vault.webp");
  const vaultLit = halfredImage("vault-lit.webp");
  return (
    <section id="local" className="hr-section hr-local">
      <div className="hr-wrap hr-about--wide hr-local__grid grid items-center gap-12 md:grid-cols-[1.7fr_1fr] md:gap-10">
        {vault && vaultLit
          ? <VaultStage src={vault} lit={vaultLit} alt={t.local.alt} />
          : null}
        <BlurFade inView>
          <h2 className="hr-display hr-h2">
            <span className="hr-about__line">{t.local.title[0]}</span>{" "}
            <span className="hr-about__line">
              {t.local.title[1]}{" "}
              {/* Le mot rouge se révèle lettre à lettre après la première onde (`data-lit` posé par VaultStage). */}
              <span className="hr-red hr-local__never">
                <span className="sr-only">{t.local.accent}</span>
                {[...t.local.accent].map((c, i) => (
                  <span key={i} aria-hidden style={{ "--i": i } as CSSProperties}>{c}</span>
                ))}
              </span>
            </span>
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
