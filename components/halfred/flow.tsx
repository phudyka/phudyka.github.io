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
  // à chaque trajet). Il naît au bord de sa tuile d'entrée, qui émet un anneau
  // au même instant ; le logo s'illumine quand il y entre. En sortie, il
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
    // Départ lancé : le paquet quitte sa tuile dès l'anneau, sans temps mort.
    const easeIn = bezier(0.25, 0.5, 0.45, 1);
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

    // Chaque courbe est échantillonnée une fois (un point par pixel) : les
    // paquets lisent ensuite leurs positions dans cette table au lieu d'appeler
    // `getPointAtLength` des centaines de fois par image.
    const tables = new Map<SVGPathElement, { len: number; xs: Float32Array; ys: Float32Array }>();
    type Table = { len: number; xs: Float32Array; ys: Float32Array };
    const table = (path: SVGPathElement): Table => {
      let t = tables.get(path);
      if (!t) {
        const len = path.getTotalLength();
        const n = Math.ceil(len) + 1;
        const xs = new Float32Array(n), ys = new Float32Array(n);
        for (let i = 0; i < n; i++) { const p = path.getPointAtLength(Math.min(len, i)); xs[i] = p.x; ys[i] = p.y; }
        t = { len, xs, ys };
        tables.set(path, t);
      }
      return t;
    };
    const point = (path: SVGPathElement, d: number) => {
      const { len, xs, ys } = table(path);
      const x = Math.min(len, Math.max(0, d)), i = Math.min(xs.length - 2, Math.floor(x)), f = x - i;
      return { x: xs[i] + (xs[i + 1] - xs[i]) * f, y: ys[i] + (ys[i + 1] - ys[i]) * f };
    };

    // Portion de la courbe entre deux abscisses, échantillonnée, décalée de
    // `off` px selon la normale (reflet au-dessus, ombre en dessous).
    const seg = (path: SVGPathElement, from: number, to: number, n = 8, off = 0) => {
      const at = (x: number) => point(path, x);
      let d = "";
      for (let i = 0; i <= n; i++) {
        const x = from + ((to - from) * i) / n;
        const p = at(x);
        let px = p.x, py = p.y;
        if (off) {
          const a = at(x - 1), b = at(x + 1);
          const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          px += (-(b.y - a.y) / l) * off;
          py += ((b.x - a.x) / l) * off;
        }
        d += `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`;
      }
      return d;
    };
    const last = INPUTS.map(() => ({ at: 0, time: 0, speed: 0 }));
    const place = (k: number, g: SVGGElement, path: SVGPathElement, at: number, scale: number, now: number) => {
      // Vitesse lissée (px/ms) : la traînée s'allonge et le corps s'étire avec elle.
      const m = last[k];
      const v = m.time && now > m.time ? Math.max(0, (at - m.at) / (now - m.time)) : m.speed;
      m.speed += (v - m.speed) * 0.25;
      m.at = at;
      m.time = now;
      const stretch = 1 + Math.min(0.45, m.speed * 0.35);
      const half = 12 * scale * stretch;
      const [glow, trail, shadow, edge, body, head, core, shine] = [...g.children] as SVGElement[];
      const tail = Math.max(0, at - half - Math.min(90, 14 + m.speed * 60));
      const trailD = seg(path, tail, at - half + 2, 10);
      trail.setAttribute("d", trailD);
      glow.setAttribute("d", trailD);
      const tp = point(path, tail), hp = point(path, at - half);
      const grad = g.ownerSVGElement?.querySelector(`#${CSS.escape(trail.getAttribute("stroke")!.slice(5, -1))}`);
      grad?.setAttribute("x1", `${tp.x}`); grad?.setAttribute("y1", `${tp.y}`);
      grad?.setAttribute("x2", `${hp.x}`); grad?.setAttribute("y2", `${hp.y}`);
      // Capsule en volume : ombre portée, liseré, corps de verre sombre, cœur
      // lumineux, reflet décalé vers le haut, embout de couleur à l'avant.
      const shape = seg(path, at - half, at + half, 8);
      const w = (el: SVGElement, px: number) => { el.style.strokeWidth = `${px * scale}`; };
      shadow.setAttribute("d", seg(path, at - half, at + half, 8, 2.2)); w(shadow, 12);
      edge.setAttribute("d", shape); w(edge, 12);
      body.setAttribute("d", shape); w(body, 10);
      head.setAttribute("d", seg(path, at + half * 0.5, at + half, 3)); w(head, 10);
      core.setAttribute("d", seg(path, at - half * 0.55, at + half * 0.3, 6)); w(core, 2.5);
      shine.setAttribute("d", seg(path, at - half * 0.6, at + half * 0.75, 6, -2.6)); w(shine, 1.6);
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
          last[k] = { at: 0, time: 0, speed: 0 };
          g.setAttribute("opacity", next === "rest" ? "0" : "1");
          if (next === "out") g.dataset.out = "";
          else delete g.dataset.out;
          return;
        }
        if (st.leg === "rest") return;
        const path = st.leg === "in" ? inPath : outPath;
        const { len } = table(path);
        // À l'aller, le trajet commence au bord de la tuile : rien ne se passe
        // caché dessous, l'anneau et le départ tombent sur la même image.
        const at = st.leg === "in" ? EDGE.node + (len - EDGE.node) * easeIn(t) : len * easeOut(t);
        if (st.leg === "in") {
          if (!st.seen && at >= EDGE.node) { st.seen = true; st.born = now; pop(nodes.current[k]); }
          if (!st.hit && at >= len - EDGE.hub) { st.hit = true; flash(hub.current, 1); }
        } else if (!st.hit && at >= len - EDGE.node) {
          st.hit = true;
          flash(nodes.current[INPUTS.length + k], 0.45);
        }
        t = st.seen && st.leg === "in" ? Math.min(1, (now - st.born) / 320) : 1;
        place(k, g, path, at, st.leg === "in" && st.seen ? Math.max(0.5, back(t)) : 1, now);
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
    <section id="principe" className="hr-section hr-flow-sec">
      {/* Les sphères en bande sur toute la largeur, à la hauteur de l'ancien cadre. */}
      {spheres
        ? <div className="hr-flow-band" aria-hidden><Image src={spheres} alt="" width={3200} height={1350} className="hr-flow-band__art" /></div>
        : null}
      <div className="hr-wrap hr-about hr-about--wide grid items-center gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16 lg:gap-24">
        <BlurFade inView>
          <div className="hr-flow__copy">
            <h2 className="hr-display hr-h2">
              <span className="hr-about__line">{t.flow.title[0]}</span>{" "}
              <span className="hr-about__line">
                {(() => {
                  const [before, after] = t.flow.title[1].split(t.flow.accent);
                  return <>{before}<span className="hr-red hr-aurora">{t.flow.accent}</span>{after}</>;
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
          </div>
        </BlurFade>

        <div ref={box} className="hr-flow" role="img" aria-label={t.flow.diagram}>
          <svg className="hr-flow__beams" width={size.w} height={size.h} aria-hidden>
            <defs>
              {INPUTS.map((_, k) => (
                <linearGradient key={k} id={`${uid}-trail${k}`} gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
                </linearGradient>
              ))}
            </defs>
            {paths.map((d, i) => <path key={i} ref={(el) => { tracks.current[i] = el; }} d={d} className="hr-flow__track" />)}
            {/* Un paquet par liaison. Traînée et corps sont des bouts de la courbe
                elle-même : ils épousent les virages, et s'étirent avec la vitesse. */}
            {INPUTS.map((_, k) => (
              <g key={k} ref={(el) => { packets.current[k] = el; }} className="hr-packet" opacity="0">
                <path className="hr-packet__glow" stroke={`url(#${uid}-trail${k})`} />
                <path className="hr-packet__trail" stroke={`url(#${uid}-trail${k})`} />
                <path className="hr-packet__shadow" />
                <path className="hr-packet__edge" />
                <path className="hr-packet__body" />
                <path className="hr-packet__head" />
                <path className="hr-packet__core" />
                <path className="hr-packet__shine" />
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
