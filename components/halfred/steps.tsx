"use client";

import { ArrowLeft, ArrowRight, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Offer } from "@/data/content";

export type Step = {
  title: string;
  body: string;
  detail?: boolean;
  offers: readonly Offer[];
  image: string | null;
};

/**
 * Parcours en onglets verticaux : à gauche les étapes, à droite l'image de
 * l'étape active. La barre rouge de l'étape active se remplit en CSS ; sa fin
 * (`animationend`) passe à la suivante. Lecture auto seulement quand la
 * section est visible et sur grand écran, en pause au survol ou au focus, arrêtée dès que le
 * visiteur choisit une étape ou appuie sur « arrêter » (WCAG 2.2.2). Sous
 * `prefers-reduced-motion`, la barre ne s'anime pas : rien n'avance tout seul.
 */
export default function Steps(
  { steps, prev, next, stop }: { steps: readonly Step[]; prev: string; next: string; stop: string },
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
                <div>
                  <p className="hr-lead max-w-[48ch]">{step.body}</p>
                  {step.detail
                    ? (
                      <ul className="hr-step__list">
                        {step.offers.flatMap((o) => o.included).map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )
                    : null}
                  <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
                    {step.offers.map((offer) => (
                      <div key={offer.id} className="hr-price">
                        <p className="text-sm text-muted-foreground">{offer.name}</p>
                        <p className="num hr-display mt-1 text-2xl font-semibold tracking-tight">{offer.price}</p>
                        {offer.note ? <p className="num mt-1 text-xs text-foreground/70">{offer.note}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
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
        <div className="hr-steps__nav">
          {auto
            ? (
              <button type="button" className="hr-steps__stop" aria-label={stop} title={stop} onClick={() => setAuto(false)}>
                <Pause className="size-4" aria-hidden />
              </button>
            )
            : null}
          <button type="button" aria-label={prev} onClick={() => go(active - 1)}>
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button type="button" aria-label={next} onClick={() => go(active + 1)}>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
