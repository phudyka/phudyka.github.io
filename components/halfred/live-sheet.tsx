"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EVERY_MS = 1300;
// Valeurs de départ d'illustration, fixes pour que le rendu serveur et le
// premier rendu client coïncident.
const START = [42, 17, 9, 6, 23];

/**
 * Tableur « en direct » : chaque ligne est un compteur qui monte tout seul,
 * façon cotation — la case s'allume au changement, l'écart du jour suit.
 * Données fictives d'illustration. Arrêté hors écran ; sous
 * `prefers-reduced-motion`, les chiffres restent fixes.
 */
export default function LiveSheet({ rows }: { rows: ReadonlyArray<readonly string[]> }) {
  const [[app, live], head, ...metrics] = rows;
  const box = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState(() => metrics.map((_, i) => START[i % START.length]));
  const [gain, setGain] = useState(() => metrics.map(() => 0));
  const [hit, setHit] = useState<{ row: number; tick: number }>({ row: -1, tick: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let tick = 0;
    const step = () => {
      const row = Math.floor(Math.random() * metrics.length);
      const add = 1 + Math.floor(Math.random() * 3);
      setValues((v) => v.map((x, i) => (i === row ? x + add : x)));
      setGain((g) => g.map((x, i) => (i === row ? x + add : x)));
      setHit({ row, tick: ++tick });
    };
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(step, EVERY_MS);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [metrics.length]);

  return (
    <div ref={box} className="hr-sheet">
      <div className="hr-sheet__bar">
        <span>{app}</span>
        <span className="hr-sheet__live">{live}</span>
      </div>
      <table>
        <thead>
          <tr><th>#</th>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {metrics.map(([name], i) => (
            <tr key={name}>
              <td>{i + 1}</td>
              <td>{name}</td>
              <td className="num">
                <span key={hit.row === i ? hit.tick : 0} className={hit.row === i ? "hr-sheet__flash" : undefined}>{values[i]}</span>
              </td>
              <td className="num hr-sheet__gain">{gain[i] ? <><ArrowUp className="size-3" strokeWidth={2.5} aria-hidden />+{gain[i]}</> : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
