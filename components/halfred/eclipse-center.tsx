"use client";

import { useEffect } from "react";

// Centre de l'anneau dans l'image `hero.jpg` (3840 × 1620), relevé par
// `halfred-eclipse.py` : l'animation d'ouverture tourne autour de ce point.
const W = 3840;
const H = 1620;
const CX = 3272.2;
const CY = 1789.2;
const R = 1281.7;

/**
 * Place le centre et le rayon de l'anneau en pixels sur l'image du hero (`--ex`, `--ey`, `--er`),
 * en tenant compte de `object-fit: cover` et de `object-position`, pour que le
 * le disque de l'ouverture en éclipse se pose bien sur l'anneau à toute taille.
 */
export default function EclipseCenter() {
  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>(".hr-hero__art");
    if (!img) return;
    const place = () => {
      const { width, height } = img.getBoundingClientRect();
      const s = Math.max(width / W, height / H);
      const [px, py] = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
      // Posés sur la section : l'image et le disque « lune » les lisent.
      const hero = img.parentElement!;
      hero.style.setProperty("--ex", `${(width - W * s) * px + CX * s}px`);
      hero.style.setProperty("--ey", `${(height - H * s) * py + CY * s}px`);
      hero.style.setProperty("--er", `${R * s}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(img);
    return () => ro.disconnect();
  }, []);
  return null;
}
