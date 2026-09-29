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
 * Parcours (grand écran) : les étapes à gauche, à droite l'image de l'étape
 * active en grand, calée à droite du cadre, et son détail posé à gauche de
 * l'image, sur le noir, sans chevaucher l'illustration. Sur
 * mobile, le détail s'ouvre sous l'étape (accordéon) et la colonne disparaît. La barre rouge de l'étape active se remplit en CSS ; sa fin
 * (`animationend`) passe à la suivante. Lecture auto seulement quand la
 * section est visible et sur grand écran, en pause au survol ou au focus, arrêtée dès que le
 * visiteur choisit une étape. Sous
 * `prefers-reduced-motion`, la barre ne s'anime pas : rien n'avance tout seul.
 */
// Un peu de couleur sur le mot qui distingue deux offres d'une même étape.
// Un mot-clé en rouge par offre : ce qui la distingue des autres.
const ACCENT = /(cadrage|scoping|audit|express|pack|agent IA|AI agent|100\s?%\s?local|fully local)/i;
const accentName = (name: string) =>
  name.split(ACCENT).map((part, i) => (ACCENT.test(part) ? <span key={i} className="hr-red">{part}</span> : part));

/**
 * Montant en grand, le reste en petit : « à partir de » au-dessus, « jusqu’à »
 * décalé en dessous, « / mois » à la suite. Sinon, tel quel.
 */
export function Price({ value }: { value: string }) {
  const from = value.match(/^(à partir de|from) (.+)$/);
  if (from) {
    return (
      <p className="num hr-display hr-steps__range">
        <span className="hr-steps__pre">{from[1]}</span>
        <span>{from[2]}</span>
      </p>
    );
  }
  const range = value.match(/^(.+?) (à|to) (.+)$/);
  if (range) {
    return (
      <p className="num hr-display hr-steps__range">
        <span>{range[2] === "à" ? `${range[1]}€` : range[1]}</span>
        <span className="hr-steps__to">{range[2] === "à" ? "jusqu’à " : "up to "}{range[3]}</span>
      </p>
    );
  }
  const per = value.match(/^(.+?) (\/ .+)$/);
  if (per) return <p className="num hr-display">{per[1]} <span className="hr-steps__per">{per[2]}</span></p>;
  return <p className="num hr-display">{value}</p>;
}

export default function Steps(
  { steps, vat, art }: { steps: readonly Step[]; vat?: string; art?: ReactNode },
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

  // La molette (via `Snap`) fait d'abord défiler les étapes : l'évènement est
  // annulé tant qu'il reste une étape dans ce sens, sinon la page glisse.
  const current = useRef(0);
  current.current = active;
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const onStep = (e: Event) => {
      const next = current.current + (e as CustomEvent<number>).detail;
      if (next < 0 || next >= steps.length) return;
      e.preventDefault();
      setActive(next);
    };
    node.addEventListener("hr-step", onStep);
    return () => node.removeEventListener("hr-step", onStep);
  }, [steps.length]);

  // Curseur rouge qui glisse d'une étape à l'autre (position mesurée sur l'étape active).
  const list = useRef<HTMLOListElement>(null);
  const [cursor, setCursor] = useState({ top: 0, height: 0 });
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const place = () => {
      const li = ol.querySelectorAll<HTMLElement>(".hr-tab")[active];
      if (li) setCursor({ top: li.offsetTop, height: li.offsetHeight });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(ol);
    return () => ro.disconnect();
  }, [active]);

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
            <p className="text-sm text-muted-foreground">{accentName(offer.name)}</p>
            <Price value={offer.price} />
            {offer.note ? <p className="num text-xs text-muted-foreground">{offer.note}</p> : null}
          </div>
        ))}
        {vat ? <p className="hr-steps__vat">{vat}</p> : null}
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
      <ol ref={list} className="hr-steps__list">
        <span
          aria-hidden="true"
          className="hr-steps__cursor"
          style={{ transform: `translateY(${cursor.top}px)`, height: cursor.height }}
        >
          {/* Progression de l'étape, portée par le curseur qui glisse (le remplissage
              propre à chaque étape reste invisible : il ne sert qu'à cadencer). */}
          <span
            key={`${active}-${auto}`}
            className="hr-tab__fill"
            data-mode={auto ? (running ? "run" : "hold") : "full"}
          />
        </span>
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

      <div className="hr-steps__frame" data-art={art ? "" : undefined}>
        {art ?? steps.map((step, i) => (
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
        <div className="hr-steps__detail">
          <div key={active} className="hr-steps__detail-in">{detail(steps[active])}</div>
        </div>
      </div>
    </div>
  );
}
