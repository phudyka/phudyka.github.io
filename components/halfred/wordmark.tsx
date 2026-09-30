"use client";

import { useEffect, useRef } from "react";

const LETTERS = [..."Half"].map((c) => ({ c, side: "w" })).concat([..."red"].map((c) => ({ c, side: "r" })));
// Distance à la coupure « Half|red » : la vague part du milieu vers les bords.
const CUT = 4;
const dist = (i: number) => (i < CUT ? CUT - 1 - i : i - CUT);
const LOOP_MS = 6000;
const STEP_MS = 75;
const ROLL_MS = 1000;

// Un tour de volet : la lettre bascule jusqu'à la tranche, change de couleur
// à cet instant, puis revient de l'autre côté. La tranche s'allume au passage.
const ROLL: Keyframe[] = [
  { transform: "perspective(1.2em) rotateX(0deg)", filter: "brightness(1)" },
  { transform: "perspective(1.2em) rotateX(90deg)", filter: "brightness(1.8) drop-shadow(0 0 0.06em var(--hr-red))", offset: 0.5 },
  { transform: "perspective(1.2em) rotateX(-90deg)", filter: "brightness(1.8) drop-shadow(0 0 0.06em var(--hr-red))", offset: 0.5 },
  { transform: "perspective(1.2em) rotateX(0deg)", filter: "brightness(1)" },
];

/**
 * Grand mot-marque du pied de page : la bascule du logo de la barre, en volets.
 * Les moitiés blanche et rouge s'échangent en vague depuis la coupure, à
 * l'arrivée dans la section puis toutes les 6 s ; le survol fait basculer la
 * lettre visée seule. La couleur change sur la tranche, posée directement
 * sur la lettre : une lettre déjà dans le bon état ou encore en rotation est
 * sautée par la vague, rien ne tourne pour rien. Sans mouvement : le mot, immobile.
 */
export default function Wordmark() {
  const root = useRef<HTMLParagraphElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const state = LETTERS.map(() => false);
    const timers = new Set<number>();
    let flipped = false;

    const roll = (i: number, delay: number) => {
      const el = spans.current[i];
      if (!el || el.getAnimations().length) return;
      state[i] = !state[i];
      const on = state[i];
      el.animate(ROLL, { duration: ROLL_MS, delay, easing: "cubic-bezier(0.65, 0, 0.35, 1)" });
      const t = window.setTimeout(() => { timers.delete(t); el.toggleAttribute("data-on", on); }, delay + ROLL_MS / 2);
      timers.add(t);
    };
    const wave = () => {
      flipped = !flipped;
      LETTERS.forEach((_, i) => { if (state[i] !== flipped) roll(i, dist(i) * STEP_MS); });
    };
    // Survol réel seulement : quand la page défile sous un pointeur immobile,
    // le navigateur signale aussi un survol, qui ne doit rien faire basculer.
    let last = -1, x = NaN, y = NaN;
    const hover = (e: PointerEvent) => {
      const moved = e.screenX !== x || e.screenY !== y;
      x = e.screenX; y = e.screenY;
      const i = spans.current.indexOf(e.target as HTMLSpanElement);
      if (i !== last && moved && i >= 0 && !still.matches) roll(i, 0);
      last = i;
    };

    let timer = 0;
    let loop = 0;
    let seen = false;
    // On observe le pied de page, pas le mot : une boîte stable.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === seen) return;
      seen = e.isIntersecting;
      clearTimeout(timer);
      clearInterval(loop);
      if (!seen || still.matches) return;
      timer = window.setTimeout(() => { wave(); loop = window.setInterval(wave, LOOP_MS); }, 500);
    }, { threshold: 0.3 });
    io.observe(node.closest("footer") ?? node);
    node.addEventListener("pointermove", hover);
    node.addEventListener("pointerleave", () => { last = -1; });
    return () => {
      io.disconnect();
      clearTimeout(timer);
      clearInterval(loop);
      timers.forEach(clearTimeout);
      node.removeEventListener("pointermove", hover);
    };
  }, []);

  return (
    <p ref={root} aria-label="Halfred" className="hr-display hr-wordmark">
      {LETTERS.map(({ c, side }, i) => (
        <span
          key={i}
          ref={(el) => { spans.current[i] = el; }}
          aria-hidden="true"
          className="hr-wm"
          data-side={side}
        >
          {c}
        </span>
      ))}
    </p>
  );
}
