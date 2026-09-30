"use client";

import { useEffect, useRef } from "react";
import { BOW, FACE, HEAD, JACKET, SHIRT } from "@/components/halfred/butler-art";

// Bras : épaule → coude → main. Au repos, mains croisées dans le dos ; au survol, pouce levé.
const BACK = { l: "M54 181 L26 246 L104 228", r: "M186 181 L214 246 L136 228" };
const UP = "M186 181 L222 250 L258 196";

/**
 * Halfred en buste, en vectoriel (mêmes tracés que le schéma « Comment ») :
 * il suit le pointeur de la tête (visage tourné du côté du pointeur, tête
 * inclinée vers lui), respire, et lève le pouce quand on le survole. Aucune
 * bibliothèque 3D : un SVG et une boucle qui ne tourne que s'il est à l'écran.
 */
export default function Bust() {
  const box = useRef<HTMLDivElement>(null);
  const head = useRef<SVGGElement>(null);
  const torso = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = box.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0, flip: 1 };
    let raf = 0, visible = false;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      // Position du pointeur par rapport à la tête (placée vers le haut du buste), bornée.
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.6)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.28)) / (r.height * 0.6)));
    };
    const frame = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      cur.flip += ((target.x < -0.08 ? -1 : 1) - cur.flip) * 0.18;
      const flip = Math.abs(cur.flip) < 0.15 ? Math.sign(cur.flip || 1) * 0.15 : cur.flip;
      head.current?.style.setProperty("transform", `translate(${(cur.x * 7).toFixed(2)}px, ${(cur.y * 5).toFixed(2)}px) rotate(${(cur.x * 6 + cur.y * 7 * Math.sign(flip)).toFixed(2)}deg) scale(${flip.toFixed(3)}, 1)`);
      torso.current?.style.setProperty("transform", `rotate(${(cur.x * 1.6).toFixed(2)}deg)`);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(root);
    addEventListener("pointermove", onMove, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <div ref={box} className="hr-bust" aria-hidden>
      <svg viewBox="-40 -10 360 340" className="hr-bust__svg">
        <g className="hr-bust__body">
          <path d={BACK.l} className="hr-bust__arm" />
          <path d={BACK.r} className="hr-bust__arm hr-bust__arm--back" />
          <g className="hr-bust__up">
            <path d={UP} className="hr-bust__arm" />
            {/* Poignet de l'image (manchette comprise) posé au bout de l'avant-bras. */}
            <image href="/brand/hand-thumb.webp" x="249.7" y="153.5" width="64" height="59" transform="rotate(-15 258 196)" />
          </g>
          <g ref={torso} className="hr-bust__torso">
            <path d={JACKET} className="hr-butler__jacket" />
            <path d={SHIRT} className="hr-butler__shirt" />
            <path d={BOW} className="hr-butler__bow" />
            <circle cx="120" cy="240" r="3.4" className="hr-butler__bow" />
            <circle cx="120" cy="258" r="3.4" className="hr-butler__bow" />
          </g>
          <g ref={head} className="hr-bust__head">
            <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} className="hr-butler__hair" />
            <path d={FACE} className="hr-butler__face" />
          </g>
        </g>
      </svg>
    </div>
  );
}
