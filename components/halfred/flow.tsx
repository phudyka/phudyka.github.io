"use client";

import { useEffect, useRef, useState } from "react";
import BlurFade from "@/components/blur-fade";
import { BRANDS, type Brand } from "@/components/halfred/brands";
import type { HalfredCopy } from "@/data/content";

const INPUTS: readonly Brand[] = ["gmail", "whatsapp", "googleforms"];
const OUTPUTS: readonly Brand[] = ["googlesheets", "googlecalendar", "googledocs"];

/**
 * Le principe d'une automatisation : ce qui arrive (e-mail, message,
 * formulaire) passe par Halfred et ressort rangé dans les outils du client.
 * Les faisceaux (d'après Magic UI « Animated Beam ») sont des courbes SVG
 * recalculées à chaque redimensionnement ; le trait lumineux qui les parcourt
 * est un pointillé animé en CSS, figé sous `prefers-reduced-motion`.
 */
export default function Flow({ t }: { t: HalfredCopy }) {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const root = box.current;
    const center = hub.current;
    if (!root || !center) return;
    const draw = () => {
      const r = root.getBoundingClientRect();
      const c = center.getBoundingClientRect();
      const cx = c.left + c.width / 2 - r.left;
      const cy = c.top + c.height / 2 - r.top;
      setSize({ w: r.width, h: r.height });
      setPaths(nodes.current.map((node, i) => {
        if (!node) return "";
        const n = node.getBoundingClientRect();
        const x = n.left + n.width / 2 - r.left;
        const y = n.top + n.height / 2 - r.top;
        const mid = (x + cx) / 2;
        // Entrées vers le centre, sorties depuis le centre : le trait va toujours dans le sens du travail.
        return i < INPUTS.length
          ? `M ${x},${y} C ${mid},${y} ${mid},${cy} ${cx},${cy}`
          : `M ${cx},${cy} C ${mid},${cy} ${mid},${y} ${x},${y}`;
      }));
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const node = (brand: Brand, i: number) => (
    <div key={brand} ref={(el) => { nodes.current[i] = el; }} className="hr-flow__node">
      <svg viewBox="0 0 24 24" aria-hidden><path d={BRANDS[brand]} /></svg>
    </div>
  );

  return (
    <section id="principe" className="hr-section">
      <div className="hr-wrap hr-about grid items-center gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <BlurFade inView>
          <h2 className="hr-display hr-h2">
            <span className="hr-about__line">{t.flow.title[0]}</span>{" "}
            <span className="hr-about__line">
              {(() => {
                const [before, after] = t.flow.title[1].split(t.flow.accent);
                return <>{before}<span className="hr-red">{t.flow.accent}</span>{after}</>;
              })()}
            </span>
          </h2>
          <ol className="hr-flow__points">
            {t.flow.points.map((point) => <li key={point} className="hr-lead">{point}</li>)}
          </ol>
        </BlurFade>

        <div ref={box} className="hr-flow" role="img" aria-label={t.flow.diagram}>
          <svg className="hr-flow__beams" width={size.w} height={size.h} aria-hidden>
            {paths.map((d, i) => (
              <g key={i}>
                <path d={d} className="hr-flow__track" />
                <path d={d} pathLength={1} className="hr-flow__beam" style={{ animationDelay: `${i * -0.45}s` }} />
              </g>
            ))}
          </svg>
          <div className="hr-flow__col">{INPUTS.map((b, i) => node(b, i))}</div>
          <div ref={hub} className="hr-flow__hub">
            <span className="hr-display hr-half-text">H</span>
          </div>
          <div className="hr-flow__col">{OUTPUTS.map((b, i) => node(b, INPUTS.length + i))}</div>
        </div>
      </div>
    </section>
  );
}
