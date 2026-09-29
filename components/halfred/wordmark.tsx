"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

const LETTERS = [..."Half"].map((c) => ({ c, side: "w" })).concat([..."red"].map((c) => ({ c, side: "r" })));
// Distance à la coupure « Half|red » : la vague part du milieu vers les bords.
const CUT = 4;
const dist = (i: number) => (i < CUT ? CUT - 1 - i : i - CUT);
const LOOP_MS = 6000;
const STEP_MS = 75;
const ROLL_MS = 1000;

// Un tour de volet : la lettre bascule jusqu'à la tranche, change de couleur
// à cet instant (transition CSS retardée d'une demi-durée), puis revient de
// l'autre côté. La tranche s'allume au passage.
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
 * lettre visée seule. Sans mouvement : le mot, immobile.
 */
export default function Wordmark() {
  const root = useRef<HTMLParagraphElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const [on, setOn] = useState<boolean[]>(() => LETTERS.map(() => false));
  const [quick, setQuick] = useState(-1);

  const roll = (i: number, delay: number) =>
    spans.current[i]?.animate(ROLL, { duration: ROLL_MS, delay, easing: "cubic-bezier(0.65, 0, 0.35, 1)" });

  useEffect(() => {
    const node = root.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let seen = false;
    // On observe le pied de page, pas le mot : une boîte stable.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === seen) return;
      seen = e.isIntersecting;
      clearTimeout(timer);
      clearInterval(timer);
      if (!seen) return;
      const wave = () => {
        setQuick(-1);
        setOn((s) => { const next = !s[0]; return s.map(() => next); });
        LETTERS.forEach((_, i) => roll(i, dist(i) * STEP_MS));
      };
      timer = window.setTimeout(() => { wave(); timer = window.setInterval(wave, LOOP_MS); }, 500);
    }, { threshold: 0.3 });
    io.observe(node.parentElement ?? node);
    return () => { io.disconnect(); clearTimeout(timer); clearInterval(timer); };
  }, []);

  const hover = (i: number) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (spans.current[i]?.getAnimations().length) return;
    setQuick(i);
    setOn((s) => s.map((v, j) => (j === i ? !v : v)));
    roll(i, 0);
  };

  return (
    <p ref={root} aria-label="Halfred" className="hr-display hr-wordmark">
      {LETTERS.map(({ c, side }, i) => (
        <span
          key={i}
          ref={(el) => { spans.current[i] = el; }}
          aria-hidden="true"
          className="hr-wm"
          data-side={side}
          data-on={on[i] || undefined}
          style={{ "--d": i === quick ? 0 : dist(i) } as CSSProperties}
          onPointerEnter={() => hover(i)}
        >
          {c}
        </span>
      ))}
    </p>
  );
}
