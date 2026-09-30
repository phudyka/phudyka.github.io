"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import BlurFade from "@/components/blur-fade";
import { BRANDS, type Brand } from "@/components/halfred/brands";
import type { HalfredCopy } from "@/data/content";

const INPUTS: readonly Brand[] = ["gmail", "whatsapp", "googleforms"];
const OUTPUTS: readonly Brand[] = ["googlesheets", "googlecalendar", "googledocs"];
// Deux outils dont on peut se passer (fax, disquette) : Halfred les jette.
const JUNK = [
  "M6 2h8l4 4v3H6V2zm-2 8h16a2 2 0 0 1 2 2v6h-3v4H5v-4H2v-6a2 2 0 0 1 2-2zm3 7v3h10v-3H7zm10-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  "M3 3h14l4 4v14H3V3zm4 0v5h8V3H7zm-1 10v8h12v-8H6z",
];
const REAL = INPUTS.length + OUTPUTS.length;
const STEP_MS = 7500;
// Rythme d'arrivée des notifications par entrée (ms), avant automatisation.
const RATE = [160, 260, 420];
// Étape 0 : tout en vrac autour du PC. Position (fraction de la demi-largeur / demi-hauteur) et inclinaison,
// dans l'ordre : 3 entrées, 3 sorties, 2 outils inutiles.
const MESS: readonly (readonly [number, number, number])[] = [
  [-0.62, -0.5, -12], [0.56, 0.44, 9], [-0.36, 0.66, -6],
  [0.66, -0.4, 14], [-0.72, 0.18, 7], [0.16, -0.72, -9],
  [0.74, 0.02, -16], [0.12, 0.74, 11],
];
// Nœuds des câbles emmêlés : amplitude du détour, par tuile.
const KNOT = [70, -85, 55, -75, 95, -60, 80, -65];

/** Centre d'un élément dans `root`, lu dans la mise en page : un `translate` ne le fausse pas. */
const at = (root: HTMLElement, el: HTMLElement) => {
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2;
  for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) { x += e.offsetLeft; y += e.offsetTop; }
  return { x, y };
};

/**
 * Le principe d'une automatisation, raconté en trois étapes au fil de la
 * molette. 0 : la pagaille, huit outils en vrac branchés n'importe comment sur
 * un PC, les notifications s'empilent. 1 : Halfred (le majordome du logo)
 * entre, jette les deux outils inutiles, plonge dans le tas (nuage de bagarre
 * de dessin animé) ; tout en ressort rangé autour d'un boîtier Halfred, qu'il
 * branche proprement des deux mains. 2 : il allume le boîtier, lève le pouce
 * et sort ; factures, rendez-vous et devis circulent seuls, les compteurs se
 * vident. Sous `prefers-reduced-motion`, chaque étape s'affiche d'un coup.
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
  const tangle = useRef<(SVGPathElement | null)[]>([]);
  const plugs = useRef<(SVGGElement | null)[]>([]);
  const chips = useRef<(SVGGElement | null)[]>([]);
  const arms = useRef<(SVGGElement | null)[]>([]);
  const fx = useRef<SVGSVGElement>(null);
  const section = useRef<HTMLElement>(null);
  const badges = useRef<(HTMLSpanElement | null)[]>([]);
  const [step, setStep] = useState(0);
  // Étape lue par les boucles sans les relancer.
  const phase = useRef(0);
  phase.current = step;
  // Notifications en attente par entrée ; `drain` est posé quand l'automatisation tourne.
  const notif = useRef([0, 0, 0]);
  const drain = useRef(false);
  const labels = useRef(t.flow.chips);
  labels.current = t.flow.chips;

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
    if (box.current?.parentElement) io.observe(box.current.parentElement);
    return () => { node.removeEventListener("hr-step", onStep); io.disconnect(); clearInterval(timer); };
  }, [t.flow.points.length]);

  // Compteurs : sans automatisation les notifications s'empilent jusqu'à
  // « 99+ » et le badge pulse encore ; une fois l'automatisation lancée,
  // elles se vident vite puis plafonnent à quelques-unes.
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

  // Mise en scène complète : tuiles, câbles, Halfred et ses bras, nuage, étiquettes.
  useEffect(() => {
    const center = box.current;
    const root = center?.parentElement;
    const man = hub.current;
    if (!root || !center || !man || !paths.length) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    const easeIn = bezier(0.3, 0.4, 0.4, 1);
    const smooth = bezier(0.65, 0, 0.35, 1);
    const snappy = bezier(0.2, 0.9, 0.3, 1);
    const settle = bezier(0.34, 1.45, 0.64, 1);
    const between = (min: number, max: number) => min + Math.random() * (max - min);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const back = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
    const pop = (el: Element | null | undefined) =>
      el?.querySelector(".hr-flow__pop")?.animate(
        [{ opacity: 0.9, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.55)" }],
        { duration: 650, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );

    // Géométrie, lue une fois (l'effet est relancé au redimensionnement).
    const W = root.clientWidth, H = root.clientHeight;
    const c = at(root, center);
    const bw = center.offsetWidth, bh = center.offsetHeight;
    const hw = man.offsetWidth, hh = man.offsetHeight;
    const els = nodes.current.filter(Boolean) as HTMLDivElement[];
    const nw = els[0]?.offsetWidth ?? 76;
    const slots = els.map((el) => at(root, el));
    const EDGE = { node: nw / 2 + 8, hand: nw / 2 + 14, box: bw / 2 + 6 };
    const offstage = window.innerWidth - root.getBoundingClientRect().left + hw;
    // Place de Halfred une fois l'ordre revenu : à droite du boîtier s'il y a
    // la place, sinon devant lui.
    const gap = slots[INPUTS.length].x - nw / 2 - (c.x + bw / 2);
    const stand = gap > hw * 1.05
      ? { x: c.x + bw / 2 + gap / 2, y: c.y + bh / 2 + 14 - hh / 2 }
      : { x: c.x + bw * 0.32, y: c.y + bh * 0.45 };

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

    // --- Tuiles : décalage par rapport à leur place, échelle, inclinaison, opacité, plan.
    type Tile = { x: number; y: number; s: number; r: number; o: number; z: number };
    const tiles: Tile[] = slots.map(() => ({ x: 0, y: 0, s: 1, r: 0, o: 1, z: 1 }));
    const messy = (i: number): Tile => {
      const [fx, fy, r] = MESS[i];
      return {
        x: c.x + fx * (W / 2 - nw * 0.75) - slots[i].x,
        y: c.y + fy * (H / 2 - nw * 0.75) - slots[i].y,
        s: 1.05, r, o: 1, z: 1,
      };
    };
    const home = (i: number): Tile => (i < REAL ? { x: 0, y: 0, s: 1, r: 0, o: 1, z: 1 } : { ...messy(i), o: 0 });
    const inCloud = (i: number): Tile => ({ x: c.x - slots[i].x, y: c.y - slots[i].y, s: 0.4, r: tiles[i].r + 90, o: 0, z: 1 });
    const drawTiles = () => tiles.forEach((tl, i) => {
      const el = els[i];
      el.style.translate = `${tl.x.toFixed(1)}px ${tl.y.toFixed(1)}px`;
      el.style.scale = tl.s.toFixed(3);
      el.style.rotate = `${tl.r.toFixed(2)}deg`;
      el.style.opacity = tl.o.toFixed(3);
      el.style.zIndex = String(tl.z);
    });

    // --- Halfred : position (centre), échelle, balancement, buste penché, tête
    // tournée vers le côté où il travaille (le rouge est son visage, tourné à droite).
    const body = { x: offstage, y: stand.y, s: 1, o: 0, flip: -1, rot: 0, lean: 0, walk: 0, bob: 0 };
    let focus = -1;
    let face: "l" | "r" = "l";
    type Hand = { x: number; y: number; grip: number; thumb: number; free: boolean };
    const shoulder = (i: number) => ({ x: body.x + (i ? 1 : -1) * hw * 0.45 * body.s, y: body.y + body.bob + hh * 0.3 * body.s });
    const rest = (i: number) => ({ x: body.x + (i ? 1 : -1) * hw * 0.15, y: body.y + body.bob + hh * 0.38 });
    const hands: Hand[] = [0, 1].map((i) => ({ ...rest(i), grip: 1, thumb: 0, free: true }));
    const drawBody = (now: number) => {
      body.bob = Math.sin(now / 520) * 1.6 - body.walk * Math.abs(Math.sin(now / 90)) * 5;
      const f = focus >= 0 ? hands[focus] : null;
      const hc = { x: body.x, y: body.y - hh * 0.2 };
      const right = face === "r";
      const lookDown = f ? clamp((Math.atan2(f.y - hc.y, Math.abs(f.x - hc.x) + 30) * 180) / Math.PI, -25, 35) : 0;
      body.flip = lerp(body.flip, right ? 1 : -1, 0.22);
      const turn = Math.abs(body.flip) < 0.15 ? Math.sign(body.flip || 1) * 0.15 : body.flip;
      body.rot = lerp(body.rot, (right ? 1 : -1) * (lookDown * 0.6 + body.walk * 6), 0.18);
      body.lean = lerp(body.lean, f ? clamp((f.x - hc.x) / hw, -1, 1) * 6 : 0, 0.15);
      man.style.translate = `${(body.x - hw / 2).toFixed(1)}px ${(body.y - hh / 2 + body.bob).toFixed(1)}px`;
      man.style.scale = body.s.toFixed(3);
      man.style.opacity = String(body.o);
      if (head.current) { head.current.style.scale = `${turn.toFixed(3)} 1`; head.current.style.rotate = `${body.rot.toFixed(2)}deg`; }
      if (torso.current) torso.current.style.rotate = `${(body.lean * 0.6).toFixed(2)}deg`;
    };

    // --- Bras en tuyau souple, épais comme son buste ; mains rouges comme son visage.
    const drawArm = (i: number) => {
      const g = arms.current[i];
      if (!g) return;
      const h = hands[i];
      if (h.free) { const r = rest(i); h.x = r.x; h.y = r.y; }
      g.style.opacity = String(body.o);
      const s = shoulder(i), side = i ? 1 : -1;
      const dx = h.x - s.x, dy = h.y - s.y, dist = Math.hypot(dx, dy);
      const sag = 6 + dist * 0.16;
      const c1x = s.x + side * Math.min(30, 10 + dist * 0.25), c1y = s.y + sag * 0.6;
      const c2x = h.x - dx * 0.28, c2y = h.y - dy * 0.28 + sag * 0.5;
      const d = `M${s.x.toFixed(1)},${s.y.toFixed(1)} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${h.x.toFixed(1)},${h.y.toFixed(1)}`;
      const [outline, sleeve, glove] = [...g.children] as SVGElement[];
      outline.setAttribute("d", d);
      sleeve.setAttribute("d", d);
      outline.style.strokeWidth = `${hw * 0.17}`;
      sleeve.style.strokeWidth = `${hw * 0.13}`;
      const angle = lerp((Math.atan2(h.y - c2y, h.x - c2x) * 180) / Math.PI, 0, h.thumb);
      glove.setAttribute("transform", `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${(h.grip * hw * 0.017).toFixed(3)})`);
      const thumb = glove.lastElementChild as SVGRectElement;
      thumb.setAttribute("y", (-9.5 - 5 * h.thumb).toFixed(2));
      thumb.setAttribute("height", (6 + 5 * h.thumb).toFixed(2));
      thumb.setAttribute("x", (-2.6 - 3 * h.thumb).toFixed(2));
      thumb.setAttribute("transform", `rotate(${(-18 * h.thumb).toFixed(1)} 0 -4)`);
    };

    // --- Câbles propres : tracé 0..1, tirés depuis le boîtier ; une prise à
    // chaque bout (0 côté boîtier, 1 côté tuile), qui s'allume au passage.
    const drawn = paths.map(() => 0);
    const rev = (i: number) => i < INPUTS.length;
    const setDraw = (i: number, v: number) => {
      drawn[i] = v;
      const el = draws.current[i];
      if (el) el.style.strokeDashoffset = `${rev(i) ? v - 1 : 1 - v}`;
    };
    const glow = (i: number, end: 0 | 1) =>
      plugs.current[i * 2 + end]?.querySelector(".hr-plug__glow")?.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 800, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
    // Abscisses des deux bouts sur la courbe : côté boîtier, côté tuile.
    const ends = (len: number, i: number) => (rev(i) ? [len - EDGE.box, EDGE.node] : [EDGE.box, len - EDGE.node]);
    const drawPlugs = () => paths.forEach((_, i) => {
      const path = tracks.current[i];
      const a = plugs.current[i * 2], b = plugs.current[i * 2 + 1];
      if (!path || !a || !b) return;
      const { len } = table(path);
      const on = drawn[i] > 0.001;
      a.style.opacity = b.style.opacity = on ? "1" : "0";
      if (!on) return;
      const [fixed, far] = ends(len, i);
      const moving = rev(i) ? Math.max(len - drawn[i] * len, far) : Math.min(drawn[i] * len, far);
      const p = point(path, fixed), q = point(path, moving);
      a.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(tangent(path, fixed) + (rev(i) ? 0 : 180)).toFixed(1)})`);
      b.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${(tangent(path, moving) + (rev(i) ? 180 : 0)).toFixed(1)})`);
    });

    // --- Câbles emmêlés de la pagaille : de chaque tuile au PC, avec un nœud, qui ondulent.
    let tangleO = 1;
    const drawTangle = (now: number) => els.forEach((_, i) => {
      const el = tangle.current[i];
      if (!el) return;
      el.style.opacity = String(tangleO * tiles[i].o);
      if (tangleO <= 0) return;
      const a = { x: slots[i].x + tiles[i].x, y: slots[i].y + tiles[i].y };
      const b = { x: c.x + ((i % 4) - 1.5) * bw * 0.12, y: c.y + bh * 0.3 };
      const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
      const px = -dy / l, py = dx / l, k = KNOT[i] * (1 + 0.08 * Math.sin(now / 400 + i));
      const m = { x: a.x + dx * 0.5 + px * k * 0.5, y: a.y + dy * 0.5 + py * k * 0.5 };
      // Boucle : les poignées se croisent autour du milieu.
      el.setAttribute("d", `M${a.x.toFixed(1)},${a.y.toFixed(1)} C${(a.x + dx * 0.6 + px * k).toFixed(1)},${(a.y + dy * 0.6 + py * k).toFixed(1)} ${(m.x - dx * 0.35 - px * k * 0.6).toFixed(1)},${(m.y - dy * 0.35 - py * k * 0.6).toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)} S${(b.x + px * k * 0.4).toFixed(1)},${(b.y + py * k * 0.4).toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`);
    });

    // --- Nuage de bagarre : bouffées qui bouillonnent, étoiles d'impact, bras qui dépassent.
    const cloud = { t0: -1, dur: 1900 };
    const R = Math.min(W * 0.25, H * 0.34);
    const puffs = Array.from({ length: 17 }, (_, i) => {
      const ring = i < 11, a = (i / 11) * Math.PI * 2 + (ring ? 0 : i * 1.3);
      const d = ring ? 0.66 : 0.28 + (i % 3) * 0.12;
      return { x: Math.cos(a) * R * d, y: Math.sin(a) * R * d * 0.78, r: R * (ring ? 0.34 : 0.4) * (0.85 + ((i * 37) % 10) / 40), ph: i * 1.7 };
    });
    const drawCloud = (now: number) => {
      const svg = fx.current;
      if (!svg) return;
      const p = cloud.t0 < 0 ? -1 : (now - cloud.t0) / cloud.dur;
      if (p < 0 || p > 1) { svg.style.opacity = "0"; return; }
      svg.style.opacity = "1";
      const grow = p < 0.14 ? back(p / 0.14) : p > 0.84 ? 1 - smooth((p - 0.84) / 0.16) : 1;
      const [stars, limbs, puffG] = [...svg.children] as SVGGElement[];
      [...puffG.children].forEach((el, i) => {
        const pf = puffs[i];
        const g = clamp(grow * 1.15 - (i % 5) * 0.03, 0, 1.2);
        const r = pf.r * g * (1 + 0.09 * Math.sin(now / 65 + pf.ph));
        el.setAttribute("cx", (c.x + pf.x + Math.sin(now / 50 + pf.ph) * 3).toFixed(1));
        el.setAttribute("cy", (c.y + pf.y + Math.cos(now / 55 + pf.ph) * 3).toFixed(1));
        el.setAttribute("r", Math.max(0, r).toFixed(1));
      });
      [...stars.children].forEach((el, i) => {
        const a = i * 1.13 + Math.floor(now / 260 + i * 0.37) * 2.1;
        const q = (now / 260 + i * 0.37) % 1;
        const s = Math.sin(Math.PI * q) * grow * 1.25;
        el.setAttribute("transform", `translate(${(c.x + Math.cos(a) * R * 0.95).toFixed(1)} ${(c.y + Math.sin(a) * R * 0.72).toFixed(1)}) rotate(${(q * 40 + i * 20).toFixed(0)}) scale(${(s * R * 0.012).toFixed(3)})`);
      });
      [...limbs.children].forEach((g, i) => {
        const a = i * 1.6 + Math.sin(now / 160 + i * 2) * 0.7;
        const reach = R * (1.3 + 0.2 * Math.sin(now / 90 + i)) * grow;
        const ex = c.x + Math.cos(a) * reach, ey = c.y + Math.sin(a) * reach * 0.8;
        const [o, s, hnd] = [...g.children] as SVGElement[];
        const d = `M${c.x.toFixed(1)},${c.y.toFixed(1)} Q${(c.x + Math.cos(a + 0.5) * reach * 0.6).toFixed(1)},${(c.y + Math.sin(a + 0.5) * reach * 0.5).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
        o.setAttribute("d", d); s.setAttribute("d", d);
        o.style.strokeWidth = `${hw * 0.15}`; s.style.strokeWidth = `${hw * 0.11}`;
        hnd.setAttribute("cx", ex.toFixed(1)); hnd.setAttribute("cy", ey.toFixed(1)); hnd.setAttribute("r", (hw * 0.11).toFixed(1));
      });
    };

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
    const toRest = (i: number, t0: number, dur: number) => {
      move(i, t0, dur, () => rest(i));
      once(t0 + dur, () => { hands[i].free = true; if (focus === i) focus = -1; });
    };
    const grip = (i: number, t0: number, dur: number, to: number) => {
      let from = 1;
      add(t0, dur, (p) => { hands[i].grip = lerp(from, to, snappy(p)); }, () => { from = hands[i].grip; });
    };
    const tile = (i: number, t0: number, dur: number, to: () => Tile, ease = smooth, arc = 0, spin = 0) => {
      let from = { ...tiles[i] };
      add(t0, dur, (p) => {
        const e = ease(p), dst = to(), t = tiles[i];
        t.x = lerp(from.x, dst.x, e); t.y = lerp(from.y, dst.y, e) - Math.sin(Math.PI * Math.min(1, p)) * arc;
        t.s = lerp(from.s, dst.s, e); t.r = lerp(from.r + spin, dst.r, e); t.o = lerp(from.o, dst.o, Math.min(1, p * 3));
      }, () => { from = { ...tiles[i] }; tiles[i].z = to().z; });
    };
    const walk = (t0: number, dur: number, to: { x: number; y: number }, ease = snappy) => {
      let from = { x: 0, y: 0 };
      add(t0, dur, (p) => {
        const e = ease(p);
        body.x = lerp(from.x, to.x, e); body.y = lerp(from.y, to.y, e); body.walk = Math.sin(Math.PI * p);
      }, () => { from = { x: body.x, y: body.y }; body.o = 1; body.s = 1; });
    };
    const under = (i: number) => ({ x: slots[i].x + tiles[i].x, y: slots[i].y + tiles[i].y + (nw * tiles[i].s) / 2 + 4 });

    // Il attrape un outil inutile et le jette hors du cadre en tournoyant.
    const toss = (hand: number, j: number, t0: number) => {
      move(hand, t0, 200, () => under(j), 12, snappy);
      grip(hand, t0 + 180, 60, 0.8);
      const away = Math.sign(slots[j].x + tiles[j].x - c.x) || 1;
      tile(j, t0 + 230, 560, () => ({ x: messy(j).x + away * W * 0.9, y: messy(j).y + H * 0.35, s: 0.8, r: 0, o: 0, z: 5 }), (p) => p, H * 0.45, away * 620);
      grip(hand, t0 + 370, 80, 1);
      toRest(hand, t0 + 370, 220);
      return t0 + 420;
    };
    // Câble propre : pris au flanc du boîtier, porté jusqu'à la tuile, branché.
    const plug = (hand: number, i: number, t0: number) => {
      const path = tracks.current[i];
      if (!path) return;
      const { len } = table(path);
      const [d0, far] = ends(len, i);
      const d1 = rev(i) ? EDGE.hand : len - EDGE.hand;
      const v = (d: number) => (rev(i) ? (len - d) / len : d / len);
      void far;
      move(hand, t0, 150, () => point(path, d0), 0, snappy);
      grip(hand, t0 + 130, 60, 0.8);
      once(t0 + 150, () => { setDraw(i, v(d0)); glow(i, 0); });
      add(t0 + 190, 280, (p) => {
        const d = lerp(d0, d1, smooth(p));
        const q = point(path, d);
        hands[hand].x = q.x; hands[hand].y = q.y;
        setDraw(i, v(d));
      });
      once(t0 + 470, () => { setDraw(i, 1); glow(i, 1); pop(els[i]); });
      grip(hand, t0 + 470, 90, 1);
    };

    // --- Étiquettes qui circulent : entrée k → boîtier → sortie k.
    type Leg = "in" | "out" | "rest";
    type State = { leg: Leg; start: number; dur: number; n: number; hit: boolean };
    const leg = (name: Leg, start: number, n: number): State => ({
      leg: name, start, n, hit: false,
      dur: name === "in" ? between(1300, 1900) : name === "out" ? between(1000, 1500) : between(300, 1100),
    });
    let states: State[] = [];
    let flowing = false;
    const label = (k: number, n: number) => {
      const g = chips.current[k];
      if (!g) return;
      const list = labels.current[k];
      const text = g.querySelector("text")!;
      text.textContent = list[n % list.length];
      const w = text.getComputedTextLength() + 18;
      const rect = g.querySelector("rect")!;
      rect.setAttribute("x", `${-w / 2}`);
      rect.setAttribute("width", `${w}`);
    };
    const stopFlow = () => {
      flowing = false;
      drain.current = false;
      chips.current.forEach((g) => { if (g) { g.style.opacity = "0"; delete g.dataset.out; } });
    };
    const startFlow = (now: number) => {
      if (still) return;
      flowing = true;
      drain.current = true;
      states = INPUTS.map((_, k) => leg("in", now + k * 550, k));
      INPUTS.forEach((_, k) => label(k, k));
    };
    const drawChips = (now: number) => INPUTS.forEach((_, k) => {
      const g = chips.current[k];
      const st = states[k];
      if (!g || !st || now < st.start) return;
      const t = (now - st.start) / st.dur;
      if (t >= 1) {
        const next: Leg = st.leg === "in" ? "out" : st.leg === "out" ? "rest" : "in";
        states[k] = leg(next, st.start + st.dur, st.n + (next === "in" ? 1 : 0));
        if (next === "out") g.dataset.out = "";
        else delete g.dataset.out;
        if (next === "in") label(k, states[k].n);
        if (next === "rest") g.style.opacity = "0";
        return;
      }
      if (st.leg === "rest") return;
      const i = st.leg === "in" ? k : INPUTS.length + k;
      const path = tracks.current[i];
      if (!path) return;
      const { len } = table(path);
      const [boxEnd, tileEnd] = ends(len, i);
      const d = st.leg === "in" ? lerp(tileEnd, boxEnd, easeIn(t)) : lerp(boxEnd, tileEnd, easeIn(t));
      const p = point(path, d);
      const s = Math.min(1, back(Math.min(1, t * 5)));
      g.style.opacity = String(Math.min(1, t * 8, (1 - t) * 8));
      g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${s.toFixed(3)})`);
      if (!st.hit && t > 0.92) {
        st.hit = true;
        if (st.leg === "in") {
          glow(i, 0);
          center.animate([{ scale: 1.05 }, { scale: 1 }], { duration: 300, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
        } else glow(i, 1);
      }
    });

    // --- États finaux de chaque étape.
    let shown = -1;
    const settleTo = (to: number) => {
      tiles.forEach((_, i) => { tiles[i] = to === 0 ? messy(i) : home(i); });
      paths.forEach((_, i) => setDraw(i, to >= 1 ? 1 : 0));
      tangleO = to === 0 ? 1 : 0;
      center.dataset.face = to === 0 ? "pc" : "vps";
      if (to === 2) center.dataset.on = "";
      else delete center.dataset.on;
      Object.assign(body, to === 1 ? { x: stand.x, y: stand.y, o: 1 } : { x: offstage, y: stand.y, o: 0 }, { s: 1, walk: 0 });
      face = to === 2 ? "r" : "l";
      hands.forEach((h) => { h.free = true; h.grip = 1; h.thumb = 0; });
      focus = -1;
      cloud.t0 = -1;
    };
    const enter = (to: number, now: number) => {
      const from = shown;
      shown = to;
      tl = [];
      if (to < 2) stopFlow();
      if (from === -1 || still) {
        settleTo(to);
        if (to === 2) startFlow(now);
        return;
      }
      hands.forEach((h) => { h.thumb = 0; });
      cloud.t0 = -1;
      if (to < from) {
        [0, 1].forEach((i) => toRest(i, now, 240));
        if (to === 1) {
          // Retour avant le démarrage : il revient à sa place, boîtier éteint.
          delete center.dataset.on;
          face = "l";
          walk(now, 520, stand);
        } else {
          // Retour à la pagaille.
          face = "r";
          walk(now, 420, { x: offstage, y: stand.y }, smooth);
          once(now + 420, () => { body.o = 0; });
          tiles.forEach((_, i) => tile(i, now + (i % 4) * 40, 420, () => messy(i)));
          paths.forEach((_, i) => { let v = 0; add(now, 300, (p) => setDraw(i, v * (1 - p)), () => { v = drawn[i]; }); });
          add(now + 150, 300, (p) => { tangleO = p; });
          once(now + 100, () => { center.dataset.face = "pc"; delete center.dataset.on; });
        }
        return;
      }
      if (to === 1) {
        face = "l";
        // Il entre par la droite, jette les deux outils inutiles…
        Object.assign(body, { x: offstage, y: stand.y, o: 1, s: 1 });
        walk(now, 560, { x: c.x + bw * 0.9, y: stand.y });
        let t = now + 520;
        t = toss(1, REAL, t);
        t = toss(0, REAL + 1, t);
        // …plonge dans le tas : tout est aspiré dans le nuage…
        add(t, 220, (p) => {
          body.s = lerp(1, 0.6, p);
          body.x = lerp(c.x + bw * 0.9, c.x, smooth(p));
          body.y = lerp(stand.y, c.y, smooth(p));
          body.walk = Math.sin(Math.PI * p);
        });
        once(t + 60, () => { cloud.t0 = performance.now(); });
        once(t + 220, () => { body.o = 0; });
        for (let i = 0; i < REAL; i++) tile(i, t + 60 + (i % 3) * 30, 220, () => inCloud(i), snappy);
        add(t + 60, 220, (p) => { tangleO = 1 - p; });
        // …et tout en ressort rangé, une tuile après l'autre, en vol plané jusqu'à sa place.
        once(t + 700, () => { center.dataset.face = "vps"; });
        for (let i = 0; i < REAL; i++) {
          const t1 = t + 700 + i * 110;
          once(t1, () => { tiles[i] = { ...inCloud(i), o: 1, s: 0.5, r: 360 }; });
          tile(i, t1, 380, () => home(i), settle, 70);
        }
        // Le nuage retombe : il est à sa place, à côté du boîtier.
        once(t + 1500, () => { Object.assign(body, { x: stand.x, y: stand.y, s: 1, o: 1, walk: 0 }); });
        t += 60 + cloud.dur + 80;
        // Il branche tout, des deux mains à la fois : entrées à gauche, sorties à droite.
        for (let k = 0; k < INPUTS.length; k++) {
          plug(0, k, t + k * 380);
          plug(1, INPUTS.length + k, t + k * 380);
        }
        t += INPUTS.length * 380 + 160;
        toRest(0, t, 240);
        toRest(1, t, 240);
        return;
      }
      // Étape 2 : il allume le boîtier, lève le pouce, sort ; l'automatisation tourne.
      face = "r";
      move(1, now, 220, () => ({ x: c.x + bw * 0.25, y: c.y - bh * 0.15 }), 10, snappy);
      grip(1, now + 200, 80, 0.8);
      once(now + 240, () => {
        center.dataset.on = "";
        center.animate([{ scale: 1 }, { scale: 1.08 }, { scale: 1 }], { duration: 380, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
      });
      grip(1, now + 300, 80, 1);
      const up = () => ({ x: shoulder(1).x + hw * 0.32, y: body.y - hh * 0.3 + body.bob });
      move(1, now + 380, 220, up, 0, snappy);
      add(now + 460, 200, (p) => { hands[1].thumb = snappy(p); });
      once(now + 500, () => {
        head.current?.animate(
          [{ rotate: "0deg" }, { rotate: "10deg", offset: 0.4 }, { rotate: "-3deg", offset: 0.75 }, { rotate: "0deg" }],
          { duration: 520, easing: "cubic-bezier(0.45, 0, 0.55, 1)", composite: "add" },
        );
      });
      add(now + 1000, 140, (p) => { hands[1].thumb = 1 - p; });
      toRest(1, now + 1000, 200);
      walk(now + 1100, 700, { x: offstage, y: stand.y }, bezier(0.5, 0, 0.75, 0.4));
      once(now + 1800, () => { body.o = 0; });
      once(now + 1300, () => startFlow(performance.now()));
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
      drawBody(still ? 0 : now);
      drawTiles();
      drawTangle(still ? 0 : now);
      drawArm(0);
      drawArm(1);
      drawPlugs();
      drawCloud(now);
      if (flowing) drawChips(now);
      if (!still && visible) raf = requestAnimationFrame(frame);
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
    // Sans mouvement, un seul rendu à chaque changement d'étape.
    const obs = new MutationObserver(() => { if (still) requestAnimationFrame(frame); });
    obs.observe(root, { attributes: true, attributeFilter: ["data-phase"] });
    settleTo(phase.current);
    shown = phase.current;
    frame(performance.now());
    return () => {
      io.disconnect();
      obs.disconnect();
      cancelAnimationFrame(raf);
      drain.current = false;
      els.forEach((el) => { el.style.translate = el.style.scale = el.style.rotate = el.style.opacity = el.style.zIndex = ""; });
    };
  }, [paths]);

  useEffect(() => {
    const center = box.current;
    const root = center?.parentElement;
    if (!root || !center) return;
    const draw = () => {
      const { x: cx, y: cy } = at(root, center);
      setSize({ w: root.clientWidth, h: root.clientHeight });
      setPaths(nodes.current.slice(0, REAL).map((node, i) => {
        if (!node) return "";
        const { x, y } = at(root, node);
        const mid = (x + cx) / 2;
        // Entrées vers le boîtier, sorties depuis le boîtier : le trait va dans le sens du travail.
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

  const node = (glyph: string, i: number, junk = false) => (
    <div key={i} ref={(el) => { nodes.current[i] = el; }} className="hr-flow__node" data-junk={junk || undefined}>
      <span className="hr-flow__flash" aria-hidden />
      {i < INPUTS.length ? <span className="hr-flow__pop" aria-hidden /> : null}
      {i < INPUTS.length ? <span ref={(el) => { badges.current[i] = el; }} className="hr-flow__count num" aria-hidden /> : null}
      <svg viewBox="0 0 24 24" aria-hidden><path d={glyph} fillRule="evenodd" /></svg>
    </div>
  );
  // Étoile d'impact à neuf branches, rayon 50.
  const star = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2, r = i % 2 ? 22 : 50;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");

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

        <div className="hr-flow" data-phase={step} role="img" aria-label={t.flow.diagram}>
          <svg className="hr-flow__beams" width={size.w} height={size.h} aria-hidden>
            <defs>
              <filter id={`${uid}-ink`} x="-5%" y="-5%" width="110%" height="110%"><feMorphology operator="dilate" radius="0" /></filter>
            </defs>
            {paths.map((d, i) => <path key={i} ref={(el) => { tracks.current[i] = el; }} d={d} className="hr-flow__track" />)}
            {/* La pagaille : un câble emmêlé par outil, jusqu'au PC. */}
            {Array.from({ length: REAL + JUNK.length }, (_, i) => (
              <path key={i} ref={(el) => { tangle.current[i] = el; }} className="hr-tangle" />
            ))}
            {/* Câbles propres, branchés par Halfred. */}
            {paths.map((d, i) => <path key={i} ref={(el) => { draws.current[i] = el; }} d={d} pathLength={1} className="hr-flow__draw" />)}
            {/* Une prise à chaque bout de câble : corps, broches, lueur au branchement. */}
            {paths.flatMap((_, i) => [0, 1].map((end) => (
              <g key={`${i}-${end}`} ref={(el) => { plugs.current[i * 2 + end] = el; }} className="hr-plug" style={{ opacity: 0 }}>
                <circle className="hr-plug__glow" r="11" />
                <rect className="hr-plug__body" x="-9" y="-4.5" width="10" height="9" rx="2.2" />
                <path className="hr-plug__pins" d="M1 -2.4h4M1 2.4h4" />
              </g>
            )))}
            {/* Ce qui circule une fois automatisé : factures, rendez-vous, devis. */}
            {INPUTS.map((_, k) => (
              <g key={k} ref={(el) => { chips.current[k] = el; }} className="hr-chip" style={{ opacity: 0 }}>
                <rect y="-11" height="22" rx="11" />
                <text y="4" textAnchor="middle" />
              </g>
            ))}
          </svg>
          <div className="hr-flow__col">{INPUTS.map((b, i) => node(BRANDS[b], i))}</div>
          <div ref={box} className="hr-flow__box" data-face="pc">
            {/* Avant : un vieux PC où tout est branché en vrac. */}
            <div className="hr-box__pc" aria-hidden>
              <svg viewBox="0 0 100 80">
                <rect x="8" y="4" width="84" height="54" rx="7" className="hr-box__shell" />
                <rect x="14" y="10" width="72" height="42" rx="3" className="hr-box__screen" />
                <path d="M50 18l12 22H38z" className="hr-box__warn" />
                <path d="M50 26v7M50 36v1" className="hr-box__bang" />
                <rect x="43" y="58" width="14" height="10" className="hr-box__shell" />
                <rect x="28" y="68" width="44" height="7" rx="3" className="hr-box__shell" />
              </svg>
            </div>
            {/* Après : le boîtier Halfred, logo gravé comme sur l'iMac, voyant qui s'allume. */}
            <div className="hr-box__vps" aria-hidden>
              <span className="hr-box__vents"><i /><i /><i /></span>
              <Image src="/brand/halfred-mark.png" alt="" width={256} height={339} className="hr-box__logo" />
              <span className="hr-box__led" />
            </div>
          </div>
          <div className="hr-flow__col">{OUTPUTS.map((b, i) => node(BRANDS[b], INPUTS.length + i))}</div>
          {JUNK.map((g, j) => node(g, REAL + j, true))}
          {/* Bras de Halfred, sous son buste : manche, liseré, main (pouce en dernier). */}
          <svg className="hr-flow__arms" width={size.w} height={size.h} aria-hidden>
            {[0, 1].map((i) => (
              <g key={i} ref={(el) => { arms.current[i] = el; }} className="hr-arm">
                <path className="hr-arm__outline" />
                <path className="hr-arm__sleeve" />
                <g className="hr-arm__glove">
                  <rect x="-10.5" y="-6.5" width="4.5" height="13" rx="1.8" />
                  <circle cx="1.5" cy="0" r="8.5" />
                  <rect x="-2.6" y="-9.5" width="6" height="6" rx="3" />
                </g>
              </g>
            ))}
          </svg>
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
          {/* Nuage de bagarre : étoiles d'impact, bras qui dépassent, bouffées par-dessus. */}
          <svg ref={fx} className="hr-flow__fx" width={size.w} height={size.h} aria-hidden style={{ opacity: 0 }}>
            <g>{Array.from({ length: 6 }, (_, i) => <polygon key={i} points={star} className="hr-fx__star" data-alt={i % 2 || undefined} />)}</g>
            <g>{Array.from({ length: 4 }, (_, i) => <g key={i}><path className="hr-arm__outline" /><path className="hr-arm__sleeve" /><circle className="hr-fx__hand" /></g>)}</g>
            <g>{Array.from({ length: 17 }, (_, i) => <circle key={i} className="hr-fx__puff" />)}</g>
          </svg>
        </div>
      </div>
    </section>
  );
}
