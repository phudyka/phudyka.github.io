"use client";

import { useEffect } from "react";

const SECTIONS = ".hr-hero, .hr-root .hr-section, .hr-footer";
const DURATION = 1100;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Défilement section par section, avec une courbe douce (le `scroll-snap` CSS
 * ne se règle pas). Chaque cran de molette mène à la section suivante ; une
 * section plus haute que l'écran (tarifs, contact) se parcourt normalement
 * jusqu'à son bord. Grand écran et souris seulement : rien sous
 * `prefers-reduced-motion`, ni au clavier ou au tactile, qui gardent le
 * défilement natif.
 */
export default function Snap() {
  useEffect(() => {
    const wide = matchMedia("(min-width: 768px)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let busy = false;

    // Points d'arrêt : le haut de chaque section, et son bas si elle dépasse l'écran.
    const stops = () => {
      const vh = innerHeight;
      return [...document.querySelectorAll<HTMLElement>(SECTIONS)].map((el) => {
        const top = el.getBoundingClientRect().top + scrollY;
        return { top, end: top + Math.max(0, el.offsetHeight - vh) };
      });
    };

    const glide = (to: number) => {
      busy = true;
      const from = scrollY;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        window.scrollTo({ top: from + (to - from) * ease(t), behavior: "instant" });
        // Léger délai après l'arrivée : l'inertie du pavé tactile ne relance pas un saut.
        if (t < 1) requestAnimationFrame(step);
        else setTimeout(() => { busy = false; }, 250);
      };
      requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (!wide.matches || still.matches || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (busy) { e.preventDefault(); return; }
      const y = scrollY;
      const list = stops();
      const down = e.deltaY > 0;
      // À l'intérieur d'une section haute, loin de son bord : défilement natif.
      if (list.some((s) => (down ? y >= s.top - 2 && y < s.end - 2 : y > s.top + 2 && y <= s.end + 2))) return;
      const points = list.flatMap((s) => (s.end > s.top ? [s.top, s.end] : [s.top]));
      const target = down
        ? points.find((p) => p > y + 2)
        : [...points].reverse().find((p) => p < y - 2);
      if (target === undefined) return;
      e.preventDefault();
      glide(target);
    };

    addEventListener("wheel", onWheel, { passive: false });
    return () => removeEventListener("wheel", onWheel);
  }, []);

  return null;
}
