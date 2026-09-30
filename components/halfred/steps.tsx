"use client";

import { type CSSProperties, type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import type { Offer } from "@/data/content";

export type Step = {
  title: string;
  body: string;
  who: string;
  offers: readonly Offer[];
  /** Une illustration par offre ; la dernière sert aux offres qui n'en ont pas. */
  images: readonly (string | null)[];
};

/**
 * Parcours (grand écran) : les étapes à gauche, à droite les offres de l'étape
 * active en cartes (voir `Deck`). Sur mobile, les cartes passent au-dessus et
 * la description s'ouvre sous l'étape (accordéon). La barre rouge de l'étape active se remplit en CSS ; sa fin
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
        <span key={from[2]}>{from[2]}</span>
      </p>
    );
  }
  const range = value.match(/^(.+?) (à|to) (.+)$/);
  if (range) {
    return (
      <p className="num hr-display hr-steps__range">
        <span key={range[1]}>{range[2] === "à" ? `${range[1]}€` : range[1]}</span>
        <span className="hr-steps__to">{range[2] === "à" ? "jusqu’à " : "up to "}{range[3]}</span>
      </p>
    );
  }
  const per = value.match(/^(.+?) (\/ .+)$/);
  if (per) return <p className="num hr-display">{per[1]} <span className="hr-steps__per">{per[2]}</span></p>;
  return <p className="num hr-display">{value}</p>;
}


/**
 * Offre en carte, format carte bancaire un peu élargi : l'illustration prise
 * dans la résine (liseré dépoli, reflet qui suit le pointeur), le nom en bas à
 * gauche, le prix en bas à droite. La carte s'incline vers le pointeur ; les
 * variables CSS sont posées directement, sans rendu React à chaque mouvement.
 */
function Card({ offer, image, front, onPick }: { offer: Offer; image: string | null; front: boolean; onPick: () => void }) {
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (!front || e.pointerType !== "mouse") return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${x - 0.5}`);
    el.style.setProperty("--py", `${y - 0.5}`);
    el.dataset.tilt = "";
  };
  const rest = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.removeProperty("--px");
    el.style.removeProperty("--py");
    delete el.dataset.tilt;
  };
  return (
    <div className="hr-card" data-front={front || undefined} onPointerMove={tilt} onPointerLeave={rest} onClick={front ? undefined : onPick}>
      <div className="hr-card__art">{image ? <img src={image} alt="" loading="lazy" decoding="async" /> : null}</div>
      <span className="hr-card__rim" aria-hidden />
      <span className="hr-card__glare" aria-hidden />
      <div className="hr-card__body">
        <div className="hr-card__name">
          <p className="text-sm">{accentName(offer.name)}</p>
          {offer.note ? <p className="num hr-card__note">{offer.note}</p> : null}
        </div>
        <div className="hr-card__price"><Price value={offer.price} /></div>
      </div>
    </div>
  );
}

/** Les offres d'une étape en pile : celle de devant se lit, les autres dépassent derrière et passent devant au clic. */
function Deck({ step, on }: { step: Step; on: boolean }) {
  const [front, setFront] = useState(0);
  const n = step.offers.length;
  return (
    <div className="hr-deck" data-on={on || undefined} aria-hidden={!on}>
      {step.offers.map((offer, i) => (
        // `--depth` : rang dans la pile, 0 devant.
        <div key={offer.id} className="hr-deck__slot" style={{ "--depth": (i - front + n) % n } as CSSProperties}>
          <Card
            offer={offer}
            image={step.images[i] ?? step.images.at(-1) ?? null}
            front={i === front}
            onPick={() => setFront(i)}
          />
        </div>
      ))}
      {n > 1 ? (
        <div className="hr-deck__dots">
          {step.offers.map((offer, i) => (
            <button key={offer.id} type="button" aria-label={offer.name} aria-pressed={i === front} tabIndex={on ? 0 : -1} onClick={() => setFront(i)} />
          ))}
        </div>
      ) : null}
    </div>
  );
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
    // Chaque étape est observée, pas seulement la liste : quand l'une se replie
    // pendant que l'autre s'ouvre, la hauteur totale ne bouge presque pas et le
    // curseur garderait sa taille de départ.
    const ro = new ResizeObserver(place);
    ol.querySelectorAll(".hr-tab").forEach((li) => ro.observe(li));
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
          style={{ transform: `translateY(${cursor.top}px) scaleY(${cursor.height / 100})` }}
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
        {art ?? steps.map((step, i) => <Deck key={step.title} step={step} on={i === active} />)}
        {vat && !art ? <p className="hr-steps__vat">{vat}</p> : null}
      </div>
    </div>
  );
}
