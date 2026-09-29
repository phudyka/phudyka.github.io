"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Offer } from "@/data/content";

export type Kind = { offer: Offer; body: string; points: readonly string[]; shots: readonly { src: string; label: string }[] };

// Chaque formule montre ses deux captures l'une après l'autre, puis passe la main.
const SHOT_MS = 4500;

/**
 * Trois formules (vitrine, marchand, application) qui tournent seules : le
 * texte, le prix et les deux captures changent ensemble. Un clic choisit une
 * formule ; le survol met la rotation en pause.
 */
export default function SiteKinds(
  { intro, kinds, vat, credit }: { intro: ReactNode; kinds: readonly Kind[]; vat: string; credit: string },
) {
  const [active, setActive] = useState(0);
  const [sub, setSub] = useState(0);
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
    const id = setTimeout(() => {
      if (sub + 1 < kinds[active].shots.length) setSub(sub + 1);
      else { setSub(0); setActive((active + 1) % kinds.length); }
    }, SHOT_MS);
    return () => clearTimeout(id);
  }, [active, sub, hold, visible, kinds]);

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
                onClick={() => { setActive(i); setSub(0); }}
              >
                {k.offer.name}
              </button>
            ))}
          </div>
          </div>
          <div className="hr-shot__view" aria-hidden>
            {kinds.flatMap((k, i) => k.shots.map((shot, j) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={shot.src}
                src={shot.src}
                alt=""
                loading="lazy"
                decoding="async"
                data-on={(i === active && j === sub) || undefined}
              />
            )))}
          </div>
          <figcaption>
            <span>{kind.shots[sub]?.label}</span>
            <span className="hr-kinds__credit">{credit}</span>
          </figcaption>
        </figure>
        <div key={active} className="hr-local__price hr-kinds__price">
          <p className="num hr-display">{kind.offer.price}</p>
          {kind.offer.note ? <p className="text-sm text-muted-foreground">{kind.offer.note}</p> : null}
          <p className="hr-steps__vat mt-1">{vat}</p>
        </div>
      </div>
    </div>
  );
}
