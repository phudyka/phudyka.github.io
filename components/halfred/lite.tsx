"use client";

import { useEffect } from "react";

/**
 * Mode allégé pour les machines modestes : pose `data-lite` sur <html> quand
 * l'appareil a peu de cœurs ou de mémoire, demande à économiser les données,
 * ou n'arrive pas à tenir ~45 images/s au repos. Le CSS coupe alors les flous
 * et les boucles décoratives ; les scènes 3D baissent leur résolution.
 */
export default function Lite() {
  useEffect(() => {
    const html = document.documentElement;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const set = () => { html.dataset.lite = ""; window.dispatchEvent(new Event("hr-lite")); };
    if ((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || nav.connection?.saveData) { set(); return; }
    // Mesure : 60 images après une seconde de calme ; médiane au-dessus de 22 ms = trop lent.
    let raf = 0, last = 0;
    const gaps: number[] = [];
    const tick = (now: number) => {
      if (last) gaps.push(now - last);
      last = now;
      if (gaps.length < 60) { raf = requestAnimationFrame(tick); return; }
      gaps.sort((a, b) => a - b);
      if (gaps[30] > 22) set();
    };
    const id = window.setTimeout(() => { raf = requestAnimationFrame(tick); }, 1000);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
