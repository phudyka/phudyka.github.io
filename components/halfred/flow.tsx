"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import BlurFade from "@/components/blur-fade";
import { BRANDS, type Brand } from "@/components/halfred/brands";
import type { HalfredCopy } from "@/data/content";

const INPUTS: readonly Brand[] = ["gmail", "whatsapp", "googleforms"];
const OUTPUTS: readonly Brand[] = ["googlesheets", "googlecalendar", "googledocs"];
const STEP_MS = 3500;

/**
 * Le principe d'une automatisation : ce qui arrive (e-mail, message,
 * formulaire) passe par Halfred et ressort rangé dans les outils du client.
 * Les faisceaux (d'après Magic UI « Animated Beam ») sont des courbes SVG
 * recalculées à chaque redimensionnement ; le trait lumineux qui les parcourt
 * est un pointillé animé en CSS, figé sous `prefers-reduced-motion`.
 */
export default function Flow({ t, spheres }: { t: HalfredCopy; spheres: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<string[]>([]);
  const uid = useId().replace(/:/g, "");
  const tracks = useRef<(SVGPathElement | null)[]>([]);
  const packets = useRef<(SVGGElement | null)[]>([]);
  const list = useRef<HTMLDListElement>(null);
  const [step, setStep] = useState(0);

  // Les trois lignes s'allument tour à tour, tant que la section est à l'écran.
  useEffect(() => {
    const el = list.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(() => setStep((i) => (i + 1) % t.flow.points.length), STEP_MS);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [t.flow.points.length]);

  // Chaque paquet fait entrée k → Halfred → sortie k, à sa propre vitesse (tirée
  // à chaque trajet). Il naît caché sous sa tuile d'entrée, qui émet un anneau
  // au moment où il en sort ; le logo s'illumine quand il y entre. En sortie, il
  // accélère puis perd son élan, et la tuile d'arrivée s'allume au contact.
  useEffect(() => {
    const root = box.current;
    if (!root || !paths.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
      const f = (t: number, a: number, b: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
      let t = x;
      for (let i = 0; i < 6; i++) {
        const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
        if (Math.abs(d) < 1e-6) break;
        t -= (f(t, x1, x2) - x) / d;
      }
      return f(Math.min(1, Math.max(0, t)), y1, y2);
    };
    const easeIn = bezier(0.4, 0, 0.6, 1);
    const easeOut = bezier(0.62, 0, 0.12, 1);
    const between = (min: number, max: number) => min + Math.random() * (max - min);
    const flash = (el: Element | null | undefined, strength: number) =>
      el?.querySelector(".hr-flow__flash")?.animate(
        [{ opacity: strength }, { opacity: 0 }],
        { duration: 900, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
    const pop = (el: Element | null | undefined) =>
      el?.querySelector(".hr-flow__pop")?.animate(
        [{ opacity: 0.9, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.55)" }],
        { duration: 650, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
    const back = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
    // Distance au centre où le paquet sort d'une tuile / y entre (demi-tuile + nez du paquet).
    const EDGE = { node: 36, hub: 50 };

    type Leg = "in" | "out" | "rest";
    type State = { leg: Leg; start: number; dur: number; seen: boolean; hit: boolean; born: number };
    const leg = (name: Leg, start: number): State => ({
      leg: name,
      start,
      dur: name === "in" ? between(1400, 2300) : name === "out" ? between(1000, 1700) : between(300, 1300),
      seen: false,
      hit: false,
      born: 0,
    });
    let states: State[] = [];
    let raf = 0, visible = false;

    const place = (g: SVGGElement, path: SVGPathElement, at: number, scale: number) => {
      const len = path.getTotalLength();
      const a = path.getPointAtLength(Math.max(0, at - 1));
      const b = path.getPointAtLength(Math.min(len, at + 1));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      g.setAttribute("transform", `translate(${(a.x + b.x) / 2},${(a.y + b.y) / 2}) rotate(${angle}) scale(${scale})`);
    };

    const frame = (now: number) => {
      INPUTS.forEach((_, k) => {
        const g = packets.current[k];
        const inPath = tracks.current[k];
        const outPath = tracks.current[INPUTS.length + k];
        const st = states[k];
        if (!g || !inPath || !outPath || !st) return;
        let t = (now - st.start) / st.dur;
        if (t >= 1) {
          const next: Leg = st.leg === "in" ? "out" : st.leg === "out" ? "rest" : "in";
          if (st.leg === "out" && !st.hit) flash(nodes.current[INPUTS.length + k], 0.45);
          states[k] = leg(next, st.start + st.dur);
          g.setAttribute("opacity", next === "rest" ? "0" : "1");
          if (next === "out") g.dataset.out = "";
          else delete g.dataset.out;
          return;
        }
        if (st.leg === "rest") return;
        const path = st.leg === "in" ? inPath : outPath;
        const len = path.getTotalLength();
        const at = len * (st.leg === "in" ? easeIn(t) : easeOut(t));
        if (st.leg === "in") {
          if (!st.seen && at >= EDGE.node) { st.seen = true; st.born = now; pop(nodes.current[k]); }
          if (!st.hit && at >= len - EDGE.hub) { st.hit = true; flash(hub.current, 1); }
        } else if (!st.hit && at >= len - EDGE.node) {
          st.hit = true;
          flash(nodes.current[INPUTS.length + k], 0.45);
        }
        t = st.seen && st.leg === "in" ? Math.min(1, (now - st.born) / 320) : 1;
        place(g, path, at, st.leg === "in" && st.seen ? Math.max(0.2, back(t)) : 1);
      });
      raf = requestAnimationFrame(frame);
    };

    // Hors écran, la boucle s'arrête ; au retour, les paquets repartent décalés.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === visible) return;
      visible = e.isIntersecting;
      if (visible) {
        const now = performance.now();
        states = [leg("in", now - 700), leg("out", now - 300), leg("rest", now)];
        packets.current.forEach((g, k) => {
          if (!g) return;
          g.setAttribute("opacity", states[k].leg === "rest" ? "0" : "1");
          if (states[k].leg === "out") g.dataset.out = "";
          else delete g.dataset.out;
        });
        raf = requestAnimationFrame(frame);
      } else cancelAnimationFrame(raf);
    });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [paths]);

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
      <span className="hr-flow__flash" aria-hidden />
      {i < INPUTS.length ? <span className="hr-flow__pop" aria-hidden /> : null}
      <svg viewBox="0 0 24 24" aria-hidden><path d={BRANDS[brand]} /></svg>
    </div>
  );

  return (
    <section id="principe" className="hr-section">
      <div className="hr-wrap hr-about hr-about--wide grid items-center gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16 lg:gap-24">
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
          <dl ref={list} className="hr-flow__points">
            {t.flow.points.map(([term, text], i) => (
              <div key={term} data-on={i === step || undefined}>
                <dt className="hr-display">{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </BlurFade>

        <div ref={box} className="hr-flow hr-principe" role="img" aria-label={t.flow.diagram}>
          {spheres
            ? <Image src={spheres} alt="" width={3200} height={1350} className="hr-principe__art" />
            : null}
          <svg className="hr-flow__beams" width={size.w} height={size.h} aria-hidden>
            <defs>
              <linearGradient id={`${uid}-trail`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {paths.map((d, i) => <path key={i} ref={(el) => { tracks.current[i] = el; }} d={d} className="hr-flow__track" />)}
            {/* Un paquet par liaison entrée → sortie : gris en entrant, rouge une
                fois passé par le H. Positionné en JS (voir la boucle plus haut). */}
            {INPUTS.map((_, k) => (
              <g key={k} ref={(el) => { packets.current[k] = el; }} className="hr-packet" opacity="0">
                <rect x="-38" y="-1" width="30" height="2" rx="1" className="hr-packet__trail" fill={`url(#${uid}-trail)`} />
                <rect x="-10" y="-5.5" width="24" height="11" rx="3.5" className="hr-packet__body" />
                <rect x="8" y="-5.5" width="6" height="11" rx="2.5" className="hr-packet__head" />
                {[-6, -2, 2].map((x) => <rect key={x} x={x} y="-1.75" width="2.5" height="3.5" rx="0.5" className="hr-packet__bit" />)}
              </g>
            ))}
          </svg>
          <div className="hr-flow__col">{INPUTS.map((b, i) => node(b, i))}</div>
          <div ref={hub} className="hr-flow__hub">
            <span className="hr-flow__flash" aria-hidden />
            <Image src="/brand/halfred.webp" alt="" width={96} height={96} className="hr-flow__logo" />
          </div>
          <div className="hr-flow__col">{OUTPUTS.map((b, i) => node(b, INPUTS.length + i))}</div>
        </div>
      </div>
    </section>
  );
}
