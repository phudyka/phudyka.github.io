"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Offer } from "@/data/content";

export type Step = {
  title: string;
  body: string;
  who: string;
  offers: readonly Offer[];
  image: string | null;
};

/**
 * Parcours en trois colonnes (grand écran) : les étapes en grand à gauche,
 * le détail court et le prix de l'étape active au centre, son image à droite. Sur
 * mobile, le détail s'ouvre sous l'étape (accordéon) et la colonne disparaît. La barre rouge de l'étape active se remplit en CSS ; sa fin
 * (`animationend`) passe à la suivante. Lecture auto seulement quand la
 * section est visible et sur grand écran, en pause au survol ou au focus, arrêtée dès que le
 * visiteur choisit une étape. Sous
 * `prefers-reduced-motion`, la barre ne s'anime pas : rien n'avance tout seul.
 */
export default function Steps(
  { steps, aside }: { steps: readonly Step[]; aside?: ReactNode },
) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hold, setHold] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    // Sur mobile, le panneau qui s'ouvre tout seul ferait sauter la page.
    if (!matchMedia("(min-width: 1024px)").matches) setAuto(false);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const go = (i: number) => {
    setAuto(false);
    setActive((i + steps.length) % steps.length);
  };
  const running = auto && visible && !hold;

  const detail = (step: Step) => (
    <>
      <p className="hr-steps__body">{step.body}</p>
      <p className="hr-steps__who">{step.who}</p>
      <div className="hr-steps__prices">
        {step.offers.map((offer) => (
          <div key={offer.id} className="hr-steps__price">
            <p className="text-sm text-muted-foreground">{offer.name}</p>
            <p className="num hr-display">{offer.price}</p>
            {offer.note ? <p className="num text-xs text-muted-foreground">{offer.note}</p> : null}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div
      ref={root}
      className="hr-steps"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <ol className="hr-steps__list">
        {steps.map((step, i) => {
          const on = i === active;
          return (
            <li key={step.title} className="hr-tab" data-on={on || undefined}>
              <span className="hr-tab__bar" aria-hidden="true">
                {on
                  ? (
                    <span
                      key={`${active}-${auto}`}
                      className="hr-tab__fill"
                      data-mode={auto ? (running ? "run" : "hold") : "full"}
                      onAnimationEnd={() => setActive((a) => (a + 1) % steps.length)}
                    />
                  )
                  : null}
              </span>
              <button type="button" className="hr-tab__head" aria-expanded={on} onClick={() => go(i)}>
                <span className="num hr-tab__num">/{String(i + 1).padStart(2, "0")}</span>
                <span className="hr-display hr-tab__title">{step.title}</span>
              </button>
              <div className="hr-tab__panel">
                <div>{detail(step)}</div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hr-steps__frame">
        {steps.map((step, i) => (
          <div key={step.title} className="hr-steps__slide" data-on={i === active || undefined} aria-hidden="true">
            {step.image
              ? <img src={step.image} alt="" loading="lazy" decoding="async" />
              : (
                <span className="hr-steps__ghost hr-display num">
                  <span className="hr-half-text">{String(i + 1).padStart(2, "0")}</span>
                </span>
              )}
          </div>
        ))}
      </div>

      <div className="hr-steps__detail">
        <div key={active} className="hr-steps__detail-in">{detail(steps[active])}</div>
      </div>
      {aside ? <div className="hr-steps__foot">{aside}</div> : null}
    </div>
  );
}
