"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Price } from "@/components/halfred/steps";
import type { Offer } from "@/data/content";

export type Kind = { offer: Offer; body: string; points: readonly string[]; shot: { src: string; label: string } };

// Chaque formule reste le temps que la barre rouge de l’onglet se remplisse (9 s).
const SHOT_MS = 9000;

/**
 * Trois formules (vitrine, marchand, application) qui tournent seules : le
 * texte, le prix et la capture changent ensemble. Un clic choisit une
 * formule ; le survol met la rotation en pause.
 */
export default function SiteKinds(
  { intro, kinds, vat, credit }: { intro: ReactNode; kinds: readonly Kind[]; vat: string; credit: string },
) {
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (hold || !visible || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((active + 1) % kinds.length), SHOT_MS);
    return () => clearTimeout(id);
  }, [active, hold, visible, kinds]);

  const kind = kinds[active];
  return (
    <div
      ref={root}
      className="hr-kinds"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
    >
      <div className="hr-kinds__text">
        {intro}
        <div key={active} className="hr-kinds__detail" role="tabpanel">
          <p className="hr-kinds__body">{kind.body}</p>
          <ul className="hr-kinds__points">
            {kind.points.map((point, i) => (
              <li key={point}><span className="num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>{point}</li>
            ))}
          </ul>
        </div>
        <div key={`price-${active}`} className="hr-local__price hr-kinds__price">
          <Price value={kind.offer.price} />
          {kind.offer.note ? <p className="text-sm text-muted-foreground">{kind.offer.note}</p> : null}
          <p className="hr-steps__vat mt-1">{vat}</p>
        </div>
      </div>
      <div className="hr-kinds__stage">
        <figure className="hr-shot hr-kinds__shots">
          {/* Barre de navigateur : les trois formules sont ses onglets. */}
          <div className="hr-shot__bar">
            <span className="hr-shot__dots" aria-hidden><span /><span /><span /></span>
          <div className="hr-kinds__tabs" role="tablist">
            {kinds.map((k, i) => (
              <button
                key={k.offer.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                className="hr-kinds__tab"
                data-on={i === active || undefined}
                data-run={i === active && visible && !hold ? "" : undefined}
                onClick={() => setActive(i)}
              >
                {k.offer.name}
              </button>
            ))}
          </div>
          </div>
          <div className="hr-shot__view" aria-hidden>
            {kinds.map((k, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={k.shot.src}
                src={k.shot.src}
                alt=""
                loading="lazy"
                decoding="async"
                data-on={i === active || undefined}
              />
            ))}
          </div>
          <figcaption>
            <span>{kind.shot.label}</span>
            <span className="hr-kinds__credit">{credit}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
