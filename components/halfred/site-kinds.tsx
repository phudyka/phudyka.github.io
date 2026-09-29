"use client";

import { useEffect, useRef, useState } from "react";
import type { Offer } from "@/data/content";

export type Kind = { offer: Offer; body: string; shots: readonly { src: string; label: string }[] };

const STEP_MS = 8000;

/**
 * Trois formules (vitrine, marchand, application) qui tournent seules : le
 * texte, le prix et les deux captures changent ensemble. Un clic choisit une
 * formule ; le survol met la rotation en pause.
 */
export default function SiteKinds({ kinds }: { kinds: readonly Kind[] }) {
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
    const id = setTimeout(() => setActive((a) => (a + 1) % kinds.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, hold, visible, kinds.length]);

  const kind = kinds[active];
  return (
    <div
      ref={root}
      className="hr-kinds"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
    >
      <div className="hr-kinds__text">
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
        <div key={active} className="hr-kinds__detail" role="tabpanel">
          <p className="hr-kinds__body">{kind.body}</p>
          <div className="hr-local__price">
            <p className="num hr-display">{kind.offer.price}</p>
            {kind.offer.note ? <p className="text-sm text-muted-foreground">{kind.offer.note}</p> : null}
          </div>
        </div>
      </div>
      <div className="hr-kinds__shots" aria-hidden>
        {[0, 1].map((slot) => (
          <figure key={slot} className="hr-shot">
            <div className="hr-shot__bar"><span /><span /><span /></div>
            <div className="hr-shot__view">
              {kinds.map((k, i) => {
                const shot = k.shots[slot];
                return shot
                  ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={k.offer.id} src={shot.src} alt="" decoding="async" data-on={i === active || undefined} />
                  )
                  : null;
              })}
            </div>
            <figcaption>{kind.shots[slot]?.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
