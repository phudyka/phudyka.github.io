"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import BlurFade from "@/components/blur-fade";
import { BRANDS, type Brand } from "@/components/halfred/brands";
import type { HalfredCopy } from "@/data/content";

const INPUTS: readonly Brand[] = ["gmail", "whatsapp", "googleforms"];
const OUTPUTS: readonly Brand[] = ["googlesheets", "googlecalendar", "googledocs"];
const STEP_MS = 7000;
// Rythme d'arrivée des notifications par entrée (ms), avant automatisation.
const RATE = [160, 260, 420];
// Étape 0 : les entrées en vrac. Place dans le rang, penché, décalage vertical.
const MESS = { slot: [2, 0, 1], rot: [7, -6, 4], dy: [10, -14, 4] };

/** Centre d'un élément dans `root`, lu dans la mise en page : un `translate` ne le fausse pas. */
const at = (root: HTMLElement, el: HTMLElement) => {
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2;
  for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) { x += e.offsetLeft; y += e.offsetTop; }
  return { x, y };
};

/**
 * Le principe d'une automatisation, raconté en trois étapes au fil de la
 * molette. 0 : les trois entrées en vrac, leurs notifications s'empilent.
 * 1 : Halfred (le majordome du logo, en calques tête et buste) entre par la
 * droite, range les entrées une à une et les branche. 2 : il sort les trois
 * sorties de derrière lui et les pose comme des assiettes, les branche, lève
 * le pouce ; les paquets circulent et les compteurs se vident.
 * Les faisceaux (d'après Magic UI « Animated Beam ») sont des courbes SVG
 * recalculées à chaque redimensionnement ; sous `prefers-reduced-motion`, le
 * schéma passe d'un état à l'autre sans mouvement.
 */
export default function Flow({ t, spheres }: { t: HalfredCopy; spheres: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const torso = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<string[]>([]);
  const uid = useId().replace(/:/g, "");
  const tracks = useRef<(SVGPathElement | null)[]>([]);
  const draws = useRef<(SVGPathElement | null)[]>([]);
  const plugs = useRef<(SVGGElement | null)[]>([]);
  const packets = useRef<(SVGGElement | null)[]>([]);
  const arms = useRef<(SVGGElement | null)[]>([]);
  const section = useRef<HTMLElement>(null);
  const badges = useRef<(HTMLSpanElement | null)[]>([]);
  const [step, setStep] = useState(0);
  // Étape lue par les boucles sans les relancer.
  const phase = useRef(0);
  phase.current = step;
  // Notifications en attente par entrée ; `drain` est posé quand les paquets circulent.
  const notif = useRef([0, 0, 0]);
  const drain = useRef(false);

  // La molette passe les trois étapes (voir snap.tsx).
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const n = t.flow.points.length;
    const onStep = (e: Event) => {
      const next = phase.current + (e as CustomEvent<number>).detail;
      if (next < 0 || next >= n) return;
      e.preventDefault();
      setStep(next);
    };
    node.addEventListener("hr-step", onStep);
    // Au doigt, pas de crans : les étapes tournent seules tant que le schéma est à l'écran.
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting && matchMedia("(pointer: coarse)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches)
        timer = window.setInterval(() => setStep((i) => (i + 1) % n), STEP_MS);
    }, { threshold: 0.5 });
    if (box.current) io.observe(box.current);
    return () => { node.removeEventListener("hr-step", onStep); io.disconnect(); clearInterval(timer); };
  }, [t.flow.points.length]);

  // Compteurs : sans automatisation (étapes 0 et 1) les notifications
  // s'empilent jusqu'à « 99+ » et le badge pulse encore ; une fois les paquets
  // lancés, elles se vident vite puis plafonnent à quelques-unes.
  useEffect(() => {
    const show = (k: number, bump = true) => {
      const el = badges.current[k];
      if (!el) return;
      const n = notif.current[k];
      el.textContent = n > 99 ? "99+" : String(n);
      if (n > 0) el.dataset.on = "";
      else delete el.dataset.on;
      if (bump) el.animate([{ scale: 1.3 }, { scale: 1 }], { duration: 320, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      notif.current = step === 2 ? [2, 1, 1] : [120, 64, 38];
      INPUTS.forEach((_, k) => show(k, false));
      return;
    }
    const timers: number[] = [];
    if (step === 0) notif.current = [0, 0, 0];
    INPUTS.forEach((_, k) => {
      if (step === 0) show(k, false);
      const tick = () => {
        const n = notif.current[k];
        if (!drain.current) notif.current[k] = Math.min(120, n + 1 + Math.floor(Math.random() * 3));
        // Vidange : un cinquième du reste à chaque coup, jusqu'au plancher.
        else if (n > 3) notif.current[k] = Math.max(3, n - Math.max(1, Math.round((n - 3) * 0.2)));
        else notif.current[k] = n < 2 || Math.random() < 0.5 ? n + 1 : n - 1;
        show(k);
        const calm = drain.current && notif.current[k] <= 4;
        timers[k] = window.setTimeout(tick, calm ? 1400 + Math.random() * 1600 : drain.current ? 220 : RATE[k] * (0.5 + Math.random()));
      };
      timers[k] = window.setTimeout(tick, step === 0 ? 500 + k * 250 : 200);
    });
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // Mise en scène : Halfred, ses bras, les tuiles qu'il déplace, les câbles
  // qu'il branche, puis les paquets entrée k → Halfred → sortie k.
  useEffect(() => {
    const root = box.current;
    const center = hub.current;
    if (!root || !center || !paths.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    const easeIn = bezier(0.25, 0.5, 0.45, 1);
    const easeOut = bezier(0.62, 0, 0.12, 1);
    const smooth = bezier(0.65, 0, 0.35, 1);
    const snappy = bezier(0.2, 0.9, 0.3, 1);
    const settle = bezier(0.34, 1.45, 0.64, 1);
    const between = (min: number, max: number) => min + Math.random() * (max - min);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const pop = (el: Element | null | undefined) =>
      el?.querySelector(".hr-flow__pop")?.animate(
        [{ opacity: 0.9, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.55)" }],
        { duration: 650, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
    const back = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
    const SIZE = 0.7;

    // Géométrie, lue une fois (l'effet est relancé au redimensionnement).
    const c = at(root, center);
    const hw = center.offsetWidth, hh = center.offsetHeight;
    const W = root.clientWidth;
    const nodeEls = nodes.current.filter(Boolean) as HTMLDivElement[];
    const nw = nodeEls[0]?.offsetWidth ?? 76;
    const slots = nodeEls.map((el) => at(root, el));
    const EDGE = { node: nw / 2 + 8, hand: nw / 2 + 14, hub: hw * 0.42 };
    // Hors champ à droite : du bord du schéma jusqu'au bord de la fenêtre.
    const offstage = window.innerWidth - root.getBoundingClientRect().left - c.x + hw;

    // Chaque courbe est échantillonnée une fois (un point par pixel).
    type Table = { len: number; xs: Float32Array; ys: Float32Array };
    const tables = new Map<SVGPathElement, Table>();
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
    const tangent = (path: SVGPathElement, d: number) => {
      const a = point(path, d - 1), b = point(path, d + 1);
      return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    };
    const seg = (path: SVGPathElement, from: number, to: number, n = 8, off = 0) => {
      let d = "";
      for (let i = 0; i <= n; i++) {
        const x = from + ((to - from) * i) / n;
        const p = point(path, x);
        let px = p.x, py = p.y;
        if (off) {
          const a = point(path, x - 1), b = point(path, x + 1);
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
      const half = 12 * SIZE * scale * stretch;
      const [glow, trail, shadow, edge, body, nose, core, shine] = [...g.children] as SVGElement[];
      const tail = Math.max(0, at - half - Math.min(64, 10 + m.speed * 42));
      const trailD = seg(path, tail, at - half + 2, 10);
      trail.setAttribute("d", trailD);
      glow.setAttribute("d", trailD);
      const tp = point(path, tail), hp = point(path, at - half);
      const grad = g.ownerSVGElement?.querySelector(`#${CSS.escape(trail.getAttribute("stroke")!.slice(5, -1))}`);
      grad?.setAttribute("x1", `${tp.x}`); grad?.setAttribute("y1", `${tp.y}`);
      grad?.setAttribute("x2", `${hp.x}`); grad?.setAttribute("y2", `${hp.y}`);
      const shape = seg(path, at - half, at + half, 8);
      const w = (el: SVGElement, px: number) => { el.style.strokeWidth = `${px * SIZE * scale}`; };
      shadow.setAttribute("d", seg(path, at - half, at + half, 8, 2.2)); w(shadow, 12);
      edge.setAttribute("d", shape); w(edge, 12);
      body.setAttribute("d", shape); w(body, 10);
      nose.setAttribute("d", seg(path, at + half * 0.5, at + half, 3)); w(nose, 10);
      core.setAttribute("d", seg(path, at - half * 0.55, at + half * 0.3, 6)); w(core, 2.5);
      shine.setAttribute("d", seg(path, at - half * 0.6, at + half * 0.75, 6, -2.6)); w(shine, 1.6);
    };

    // --- Corps : entrée par la droite, balancement, buste qui se penche, tête qui suit la main.
    const body = { x: offstage, y: 0, o: 0, lean: 0, rot: 0, flip: 1, walk: 0 };
    let focus = -1; // main que la tête suit (-1 : aucune)

    // --- Tuiles : décalage par rapport à leur place, échelle, inclinaison, opacité.
    type Tile = { x: number; y: number; s: number; r: number; o: number; z: number };
    const tiles: Tile[] = slots.map(() => ({ x: 0, y: 0, s: 1, r: 0, o: 1, z: 1 }));
    const bigS = Math.min(1.7, (W - 24) / (nw * 3 * 1.3));
    const rowGap = Math.min(nw * bigS * 1.35, (W - nw * bigS - 24) / 2);
    const liftY = Math.max(nw * bigS * 0.4 + 8, c.y - hh / 2 - nw * bigS * 0.4 - 10);
    const messy = (k: number, lifted: boolean): Tile => {
      const s = lifted ? bigS * 0.8 : bigS;
      return {
        x: c.x + (MESS.slot[k] - 1) * rowGap * (lifted ? 0.85 : 1) - slots[k].x,
        y: (lifted ? liftY : c.y) + MESS.dy[k] - slots[k].y,
        s, r: MESS.rot[k], o: 1, z: 3,
      };
    };
    // Sorties rangées derrière Halfred, invisibles, tant qu'il ne les a pas posées.
    const tucked = (i: number): Tile => ({ x: c.x - slots[i].x, y: c.y + hh * 0.2 - slots[i].y, s: 0.5, r: 0, o: 0, z: 1 });
    const home = (z = 3): Tile => ({ x: 0, y: 0, s: 1, r: 0, o: 1, z });
    const drawTiles = () => tiles.forEach((tl, i) => {
      const el = nodeEls[i];
      el.style.translate = `${tl.x.toFixed(1)}px ${tl.y.toFixed(1)}px`;
      el.style.scale = tl.s.toFixed(3);
      el.style.rotate = `${tl.r.toFixed(2)}deg`;
      el.style.opacity = tl.o.toFixed(3);
      el.style.zIndex = String(tl.z);
    });

    // --- Bras en tuyau souple, gants blancs ; le pouce se lève sur commande.
    const shoulderBase = [-1, 1].map((s) => ({ x: c.x + s * hw * 0.45, y: c.y - hh / 2 + hh * 0.8 }));
    const restBase = [-1, 1].map((s, i) => ({ x: shoulderBase[i].x - s * hw * 0.18, y: c.y - hh / 2 + hh * 0.86 }));
    const shoulder = (i: number) => ({ x: shoulderBase[i].x + body.x, y: shoulderBase[i].y + body.y });
    const rest = (i: number) => ({ x: restBase[i].x + body.x, y: restBase[i].y + body.y });
    type Hand = { x: number; y: number; grip: number; thumb: number; free: boolean };
    const hands: Hand[] = [0, 1].map((i) => ({ ...rest(i), grip: 1, thumb: 0, free: true }));
    const drawArm = (i: number) => {
      const g = arms.current[i];
      if (!g) return;
      const h = hands[i];
      if (h.free) { const r = rest(i); h.x = r.x; h.y = r.y; }
      const s = shoulder(i), side = i ? 1 : -1;
      const dx = h.x - s.x, dy = h.y - s.y, dist = Math.hypot(dx, dy);
      const sag = 6 + dist * 0.16;
      const c1x = s.x + side * Math.min(30, 10 + dist * 0.25), c1y = s.y + sag * 0.6;
      const c2x = h.x - dx * 0.28, c2y = h.y - dy * 0.28 + sag * 0.5;
      const d = `M${s.x.toFixed(1)},${s.y.toFixed(1)} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${h.x.toFixed(1)},${h.y.toFixed(1)}`;
      const [outline, sleeve, glove] = [...g.children] as SVGElement[];
      outline.setAttribute("d", d);
      sleeve.setAttribute("d", d);
      const angle = lerp((Math.atan2(h.y - c2y, h.x - c2x) * 180) / Math.PI, 0, h.thumb);
      glove.setAttribute("transform", `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${(h.grip * 1.45).toFixed(3)})`);
      const thumb = glove.lastElementChild as SVGRectElement;
      thumb.setAttribute("y", (-9.5 - 8 * h.thumb).toFixed(2));
      thumb.setAttribute("height", (6 + 8 * h.thumb).toFixed(2));
    };

    // --- Câbles : tracé 0..1 et une prise à chaque bout, qui s'allume au branchement.
    const drawn = paths.map(() => 0);
    const setDraw = (i: number, v: number) => {
      drawn[i] = v;
      const el = draws.current[i];
      if (el) el.style.strokeDashoffset = `${1 - v}`;
    };
    const edges = (i: number) => (i < INPUTS.length ? [EDGE.node, EDGE.hub] : [EDGE.hub, EDGE.node]);
    const glow = (i: number, end: 0 | 1) =>
      plugs.current[i * 2 + end]?.querySelector(".hr-plug__glow")?.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 800, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
    const drawPlugs = () => paths.forEach((_, i) => {
      const path = tracks.current[i];
      const a = plugs.current[i * 2], b = plugs.current[i * 2 + 1];
      if (!path || !a || !b) return;
      const { len } = table(path);
      const [e0, e1] = edges(i);
      const on = drawn[i] > 0.001;
      a.style.opacity = b.style.opacity = on ? "1" : "0";
      if (!on) return;
      const p = point(path, e0);
      a.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(tangent(path, e0) + 180).toFixed(1)})`);
      const d = Math.min(drawn[i] * len, len - e1);
      const q = point(path, d);
      b.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${tangent(path, d).toFixed(1)})`);
    });

    // --- Ligne de temps : chaque tween reçoit sa progression 0..1.
    type Tween = { t0: number; dur: number; run: (p: number) => void; begin?: () => void; begun?: boolean };
    let tl: Tween[] = [];
    const add = (t0: number, dur: number, run: (p: number) => void, begin?: () => void) => { tl.push({ t0, dur, run, begin }); };
    const once = (t0: number, fn: () => void) => add(t0, 1, () => {}, fn);
    const move = (i: number, t0: number, dur: number, to: () => { x: number; y: number }, lift = 0, ease = smooth) => {
      let from = { x: 0, y: 0 };
      add(t0, dur, (p) => {
        const e = ease(p), dst = to();
        hands[i].x = lerp(from.x, dst.x, e);
        hands[i].y = lerp(from.y, dst.y, e) - Math.sin(Math.PI * Math.min(1, e)) * lift;
      }, () => { hands[i].free = false; focus = i; from = { x: hands[i].x, y: hands[i].y }; });
    };
    const home2rest = (i: number, t0: number, dur: number) => {
      move(i, t0, dur, () => rest(i));
      once(t0 + dur, () => { hands[i].free = true; if (focus === i) focus = -1; });
    };
    const grip = (i: number, t0: number, dur: number, to: number) => {
      let from = 1;
      add(t0, dur, (p) => { hands[i].grip = lerp(from, to, snappy(p)); }, () => { from = hands[i].grip; });
    };
    const tile = (i: number, t0: number, dur: number, to: () => Tile, ease = smooth, carry = -1) => {
      let from = { ...tiles[i] };
      add(t0, dur, (p) => {
        const e = ease(p), dst = to(), t = tiles[i];
        t.x = lerp(from.x, dst.x, e); t.y = lerp(from.y, dst.y, e);
        t.s = lerp(from.s, dst.s, e); t.r = lerp(from.r, dst.r, e); t.o = lerp(from.o, dst.o, Math.min(1, e * 3));
        // Une main porte la tuile par en dessous, comme un plateau.
        if (carry >= 0) { hands[carry].x = slots[i].x + t.x; hands[carry].y = slots[i].y + t.y + (nw * t.s) / 2 + 4; }
      }, () => { from = { ...tiles[i] }; tiles[i].z = to().z; });
    };
    // Dessous d'une tuile là où elle est : c'est là que la main vient la prendre.
    const under = (i: number) => ({ x: slots[i].x + tiles[i].x, y: slots[i].y + tiles[i].y + (nw * tiles[i].s) / 2 + 4 });

    // Entrée k : la main la prend dans le rang et la pose à sa place.
    const sort = (k: number, t0: number) => {
      move(0, t0, 200, () => under(k), 14, snappy);
      grip(0, t0 + 180, 70, 0.85);
      tile(k, t0 + 230, 340, () => home(3), smooth, 0);
      grip(0, t0 + 560, 90, 1);
      return t0 + 470;
    };
    // Câble d'une entrée : la main le saisit au bord de la tuile et le ramène à Halfred.
    const plugIn = (k: number, t0: number) => {
      const path = tracks.current[k];
      if (!path) return t0;
      const { len } = table(path);
      move(0, t0, 180, () => point(path, EDGE.hand), 10, snappy);
      grip(0, t0 + 160, 60, 0.8);
      once(t0 + 170, () => { pop(nodeEls[k]); glow(k, 0); setDraw(k, 0.002); });
      add(t0 + 220, 300, (p) => {
        const d = lerp(EDGE.hand, len - EDGE.hub, smooth(p));
        const q = point(path, d);
        hands[0].x = q.x; hands[0].y = q.y;
        setDraw(k, d / len);
      });
      once(t0 + 520, () => { setDraw(k, 1); glow(k, 1); });
      grip(0, t0 + 520, 90, 1);
      return t0 + 440;
    };
    // Sortie : il la tire de derrière lui et la pose d'un geste, comme une assiette.
    const serve = (k: number, t0: number) => {
      const i = INPUTS.length + k;
      move(1, t0, 110, () => rest(1), 0, snappy);
      once(t0 + 110, () => { tiles[i] = { ...tucked(i), o: 1, s: 0.6 }; });
      tile(i, t0 + 120, 280, () => ({ x: 0, y: -10, s: 1.12, r: -4, o: 1, z: 1 }), snappy, 1);
      tile(i, t0 + 400, 220, () => home(1), settle);
      once(t0 + 400, () => { hands[1].grip = 1; pop(nodeEls[i]); });
      return t0 + 360;
    };
    // Câble d'une sortie : pris au flanc de Halfred, porté jusqu'à la tuile.
    const plugOut = (k: number, t0: number) => {
      const i = INPUTS.length + k;
      const path = tracks.current[i];
      if (!path) return t0;
      const { len } = table(path);
      move(1, t0, 150, () => point(path, EDGE.hub), 0, snappy);
      grip(1, t0 + 130, 60, 0.8);
      once(t0 + 150, () => { setDraw(i, EDGE.hub / len); glow(i, 0); });
      add(t0 + 190, 300, (p) => {
        const d = lerp(EDGE.hub, len - EDGE.hand, smooth(p));
        const q = point(path, d);
        hands[1].x = q.x; hands[1].y = q.y;
        setDraw(i, d / len);
      });
      once(t0 + 490, () => { setDraw(i, 1); glow(i, 1); });
      grip(1, t0 + 490, 90, 1);
      return t0 + 400;
    };
    const unplug = (from: number, to: number, t0: number) => {
      for (let i = from; i < to; i++) {
        let v = 0;
        add(t0, 300, (p) => setDraw(i, v * (1 - smooth(p))), () => { v = drawn[i]; });
      }
    };
    const walk = (t0: number, dur: number, to: number, ease = snappy) => {
      let from = 0;
      add(t0, dur, (p) => { body.x = lerp(from, to, ease(p)); body.walk = Math.sin(Math.PI * p); }, () => { from = body.x; body.o = 1; });
    };

    // --- Paquets.
    type Leg = "in" | "out" | "rest";
    type State = { leg: Leg; start: number; dur: number; seen: boolean; hit: boolean; born: number };
    const leg = (name: Leg, start: number): State => ({
      leg: name,
      start,
      dur: name === "in" ? between(1300, 2100) : name === "out" ? between(900, 1500) : between(300, 1100),
      seen: false,
      hit: false,
      born: 0,
    });
    let states: State[] = [];
    let flowing = false;
    const stopFlow = () => {
      flowing = false;
      drain.current = false;
      packets.current.forEach((g) => { g?.setAttribute("opacity", "0"); if (g) delete g.dataset.out; });
    };
    const startFlow = (now: number) => {
      flowing = true;
      drain.current = true;
      states = [leg("in", now), leg("in", now + 500), leg("in", now + 1100)];
    };

    // --- Étapes : on rattrape l'état attendu, puis on joue la suite.
    let shown = -1;
    const settleTo = (to: number) => {
      tiles.forEach((_, i) => { tiles[i] = i < INPUTS.length ? (to >= 1 ? home(3) : messy(i, false)) : to >= 2 ? home(1) : tucked(i); });
      paths.forEach((_, i) => setDraw(i, (i < INPUTS.length ? to >= 1 : to >= 2) ? 1 : 0));
      body.x = to >= 1 ? 0 : offstage;
      body.o = to >= 1 ? 1 : 0;
      hands.forEach((h) => { h.free = true; h.grip = 1; h.thumb = 0; });
      focus = -1;
    };
    const enter = (to: number, now: number) => {
      const from = shown;
      shown = to;
      tl = [];
      if (to < 2) stopFlow();
      if (from === -1) {
        settleTo(to);
        if (to === 2) startFlow(now);
        return;
      }
      hands.forEach((h) => { h.thumb = 0; });
      if (to < from) {
        [0, 1].forEach((i) => home2rest(i, now, 260));
        if (to < 2) {
          unplug(INPUTS.length, paths.length, now);
          OUTPUTS.forEach((_, k) => tile(INPUTS.length + k, now + k * 40, 260, () => tucked(INPUTS.length + k)));
        }
        if (to < 1) {
          unplug(0, INPUTS.length, now);
          INPUTS.forEach((_, k) => tile(k, now + 80 + k * 40, 380, () => messy(k, false)));
          walk(now + 120, 420, offstage, smooth);
        }
        return;
      }
      if (to === 1) {
        // Il entre par la droite pendant que les entrées se soulèvent,
        // les range une à une, puis les branche.
        INPUTS.forEach((_, k) => tile(k, now + k * 40, 300, () => messy(k, true)));
        walk(now + 60, 620, 0);
        let t = now + 560;
        INPUTS.forEach((_, k) => { t = sort(k, t); });
        t += 120;
        INPUTS.forEach((_, k) => { t = plugIn(k, t); });
        home2rest(0, t + 120, 260);
        return;
      }
      // Étape 2 : les sorties sortent de derrière lui, il les branche, lève le pouce.
      INPUTS.forEach((_, k) => { tiles[k] = home(3); setDraw(k, 1); });
      home2rest(0, now, 200);
      let t = now + 60;
      OUTPUTS.forEach((_, k) => { t = serve(k, t); });
      t += 160;
      OUTPUTS.forEach((_, k) => { t = plugOut(k, t); });
      const up = () => ({ x: shoulder(1).x + hw * 0.32, y: c.y - hh * 0.28 + body.y });
      move(1, t + 80, 220, up, 0, snappy);
      add(t + 160, 220, (p) => { hands[1].thumb = snappy(p); });
      once(t + 200, () => {
        focus = -1;
        head.current?.animate(
          [{ rotate: "0deg" }, { rotate: "-10deg", offset: 0.4 }, { rotate: "3deg", offset: 0.75 }, { rotate: "0deg" }],
          { duration: 560, easing: "cubic-bezier(0.45, 0, 0.55, 1)", composite: "add" },
        );
      });
      add(t + 760, 160, (p) => { hands[1].thumb = 1 - p; });
      home2rest(1, t + 760, 240);
      once(t + 700, () => startFlow(performance.now()));
    };

    // --- Rendu du corps : balancement, penché vers la main active, tête qui la regarde.
    const headC = () => ({ x: c.x + body.x, y: c.y - hh * 0.2 + body.y });
    const drawBody = (now: number) => {
      body.y = Math.sin(now / 520) * 1.6 - body.walk * Math.abs(Math.sin(now / 90)) * 5;
      const f = focus >= 0 ? hands[focus] : null;
      const hc = headC();
      const faceRight = f ? f.x > hc.x + 6 : false;
      const lookDown = f ? clamp((Math.atan2(f.y - hc.y, Math.abs(f.x - hc.x) + 30) * 180) / Math.PI, -25, 35) : 0;
      body.flip = lerp(body.flip, faceRight ? -1 : 1, 0.22);
      const turn = Math.abs(body.flip) < 0.15 ? Math.sign(body.flip || 1) * 0.15 : body.flip;
      body.rot = lerp(body.rot, (faceRight ? 1 : -1) * lookDown * 0.6 - body.walk * 6, 0.18);
      body.lean = lerp(body.lean, f ? clamp((f.x - hc.x) / hw, -1, 1) * 6 : 0, 0.15);
      center.style.translate = `${body.x.toFixed(1)}px ${body.y.toFixed(1)}px`;
      center.style.opacity = String(body.o);
      if (head.current) { head.current.style.scale = `${turn.toFixed(3)} 1`; head.current.style.rotate = `${body.rot.toFixed(2)}deg`; }
      if (torso.current) torso.current.style.rotate = `${(body.lean * 0.6).toFixed(2)}deg`;
    };

    let raf = 0, visible = false;
    const frame = (now: number) => {
      if (phase.current !== shown) enter(phase.current, now);
      tl = tl.filter((tw) => {
        if (now < tw.t0) return true;
        if (!tw.begun) { tw.begun = true; tw.begin?.(); }
        const p = Math.min(1, (now - tw.t0) / tw.dur);
        tw.run(p);
        return p < 1;
      });
      drawBody(now);
      drawTiles();
      drawArm(0);
      drawArm(1);
      drawPlugs();

      if (flowing) INPUTS.forEach((_, k) => {
        const g = packets.current[k];
        const inPath = tracks.current[k];
        const outPath = tracks.current[INPUTS.length + k];
        const st = states[k];
        if (!g || !inPath || !outPath || !st || now < st.start) return;
        let t = (now - st.start) / st.dur;
        if (t >= 1) {
          const next: Leg = st.leg === "in" ? "out" : st.leg === "out" ? "rest" : "in";
          states[k] = leg(next, st.start + st.dur);
          last[k] = { at: 0, time: 0, speed: 0 };
          g.setAttribute("opacity", next === "rest" ? "0" : "1");
          if (next === "out") g.dataset.out = "";
          else delete g.dataset.out;
          return;
        }
        if (st.leg === "rest") return;
        if (g.getAttribute("opacity") !== "1") g.setAttribute("opacity", "1");
        const path = st.leg === "in" ? inPath : outPath;
        const { len } = table(path);
        const d = st.leg === "in" ? EDGE.node + (len - EDGE.node) * easeIn(t) : len * easeOut(t);
        // Chaque passage de prise l'allume : départ, entrée chez Halfred, arrivée.
        if (st.leg === "in") {
          if (!st.seen && d >= EDGE.node) { st.seen = true; st.born = now; pop(nodeEls[k]); glow(k, 0); }
          if (!st.hit && d >= len - EDGE.hub) { st.hit = true; glow(k, 1); }
        } else if (!st.hit && d >= len - EDGE.node) {
          st.hit = true;
          glow(INPUTS.length + k, 1);
        }
        t = st.seen && st.leg === "in" ? Math.min(1, (now - st.born) / 320) : 1;
        place(k, g, path, d, st.leg === "in" && st.seen ? Math.max(0.5, back(t)) : 1, now);
      });
      raf = requestAnimationFrame(frame);
    };

    // Hors écran, la boucle s'arrête ; au retour, l'étape reprend à son état final.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === visible) return;
      visible = e.isIntersecting;
      if (visible) {
        shown = -1;
        raf = requestAnimationFrame(frame);
      } else cancelAnimationFrame(raf);
    });
    io.observe(root);
    // Premier rendu tout de suite, pour ne pas montrer la mise en page brute.
    settleTo(phase.current);
    drawBody(performance.now());
    drawTiles();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      drain.current = false;
      nodeEls.forEach((el) => { el.style.translate = el.style.scale = el.style.rotate = el.style.opacity = el.style.zIndex = ""; });
      center.style.translate = center.style.opacity = "";
    };
  }, [paths]);

  useEffect(() => {
    const root = box.current;
    const center = hub.current;
    if (!root || !center) return;
    const draw = () => {
      const { x: cx, y: cy } = at(root, center);
      setSize({ w: root.clientWidth, h: root.clientHeight });
      setPaths(nodes.current.map((node, i) => {
        if (!node) return "";
        const { x, y } = at(root, node);
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
    <div key={brand} ref={(el) => { nodes.current[i] = el; }} className="hr-flow__node" style={{ "--i": i } as CSSProperties}>
      <span className="hr-flow__flash" aria-hidden />
      {i < INPUTS.length ? <span className="hr-flow__pop" aria-hidden /> : null}
      {i < INPUTS.length ? <span ref={(el) => { badges.current[i] = el; }} className="hr-flow__count num" aria-hidden /> : null}
      <svg viewBox="0 0 24 24" aria-hidden><path d={BRANDS[brand]} /></svg>
    </div>
  );

  return (
    <section ref={section} id="principe" className="hr-section hr-flow-sec" data-wheel="">
      {/* Les sphères en bande sur toute la largeur, à la hauteur de l'ancien cadre. */}
      {spheres
        ? <div className="hr-flow-band" aria-hidden><Image src={spheres} alt="" width={3200} height={1350} className="hr-flow-band__art" /></div>
        : null}
      <div className="hr-wrap hr-about hr-about--wide grid items-center gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
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
            <dl className="hr-flow__points">
              {t.flow.points.map(([term, text], i) => (
                <div key={term} data-on={i === step || undefined}>
                  <dt className="hr-display">{term}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </BlurFade>

        <div ref={box} className="hr-flow" data-phase={step} role="img" aria-label={t.flow.diagram}>
          <svg className="hr-flow__beams" width={size.w} height={size.h} aria-hidden>
            <defs>
              {INPUTS.map((_, k) => (
                <linearGradient key={k} id={`${uid}-trail${k}`} gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
                </linearGradient>
              ))}
            </defs>
            {paths.map((d, i) => <path key={i} ref={(el) => { tracks.current[i] = el; }} d={d} className="hr-flow__track" data-in={i < INPUTS.length || undefined} />)}
            {/* Câbles branchés par Halfred (entrées à l'étape 1, sorties à l'étape 2). */}
            {paths.map((d, i) => <path key={i} ref={(el) => { draws.current[i] = el; }} d={d} pathLength={1} className="hr-flow__draw" data-in={i < INPUTS.length || undefined} />)}
            {/* Une prise à chaque bout de câble : corps, broches, lueur au branchement. */}
            {paths.flatMap((_, i) => [0, 1].map((end) => (
              <g key={`${i}-${end}`} ref={(el) => { plugs.current[i * 2 + end] = el; }} className="hr-plug" style={{ opacity: 0 }}>
                <circle className="hr-plug__glow" r="11" />
                <rect className="hr-plug__body" x="-9" y="-4.5" width="10" height="9" rx="2.2" />
                <path className="hr-plug__pins" d="M1 -2.4h4M1 2.4h4" />
              </g>
            )))}
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
            {/* Bras de Halfred, passés sous le buste : manche, liseré, gant (pouce en dernier). */}
            {[0, 1].map((i) => (
              <g key={i} ref={(el) => { arms.current[i] = el; }} className="hr-arm">
                <path className="hr-arm__outline" />
                <path className="hr-arm__sleeve" />
                <g className="hr-arm__glove">
                  <rect x="-10.5" y="-6.5" width="4.5" height="13" rx="1.8" />
                  <circle cx="1.5" cy="0" r="8.5" />
                  <rect x="-2.6" y="-9.5" width="5.2" height="6" rx="2.6" />
                </g>
              </g>
            ))}
          </svg>
          <div className="hr-flow__col">{INPUTS.map((b, i) => node(b, i))}</div>
          <div ref={hub} className="hr-flow__hub">
            <div className="hr-butler">
              <div ref={torso} className="hr-butler__torso">
                <Image src="/brand/butler-torso.webp" alt="" width={495} height={214} />
              </div>
              <div ref={head} className="hr-butler__head">
                <Image src="/brand/butler-head.webp" alt="" width={407} height={407} />
              </div>
            </div>
          </div>
          <div className="hr-flow__col">{OUTPUTS.map((b, i) => node(b, INPUTS.length + i))}</div>
        </div>
      </div>
    </section>
  );
}
