"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import BlurFade from "@/components/blur-fade";
import { BRANDS, type Brand } from "@/components/halfred/brands";
import type { HalfredCopy } from "@/data/content";

const INPUTS: readonly Brand[] = ["gmail", "whatsapp", "googleforms"];
const OUTPUTS: readonly Brand[] = ["googlesheets", "googlecalendar", "googledocs"];
const STEP_MS = 6500;
// Rythme d'arrivée des notifications par entrée (ms), avant automatisation.
const RATE = [160, 260, 420];

/** Centre d'un élément dans `root`, lu dans la mise en page : un `translate` ne le fausse pas. */
const at = (root: HTMLElement, el: HTMLElement) => {
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2;
  for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) { x += e.offsetLeft; y += e.offsetTop; }
  return { x, y };
};

/**
 * Le principe d'une automatisation, raconté en trois étapes au fil de la
 * molette. 0 : les trois entrées en rang, scannées une à une, leurs
 * notifications s'empilent. 1 : elles prennent leur place, Halfred (le
 * majordome du logo, en calques tête et buste) monte à l'écran et les branche
 * à la main. 2 : il branche les sorties de l'autre main, valide d'un signe de
 * tête, les paquets circulent et les compteurs se vident.
 * Les faisceaux (d'après Magic UI « Animated Beam ») sont des courbes SVG
 * recalculées à chaque redimensionnement ; sous `prefers-reduced-motion`, le
 * schéma passe d'un état à l'autre sans mouvement.
 */
export default function Flow({ t, spheres }: { t: HalfredCopy; spheres: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<string[]>([]);
  const uid = useId().replace(/:/g, "");
  const tracks = useRef<(SVGPathElement | null)[]>([]);
  const draws = useRef<(SVGPathElement | null)[]>([]);
  const packets = useRef<(SVGGElement | null)[]>([]);
  const arms = useRef<(SVGGElement | null)[]>([]);
  const list = useRef<HTMLDListElement>(null);
  const section = useRef<HTMLElement>(null);
  const check = useRef<SVGPathElement>(null);
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
    // Au doigt, pas de crans : les étapes tournent seules tant que la section est à l'écran.
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting && matchMedia("(pointer: coarse)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches)
        timer = window.setInterval(() => setStep((i) => (i + 1) % n), STEP_MS);
    }, { threshold: 0.5 });
    if (list.current) io.observe(list.current);
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
      // À l'étape 0, le premier coup tombe à la fin du scan de la tuile.
      timers[k] = window.setTimeout(tick, step === 0 ? 1500 + k * 550 : 200);
    });
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // Mise en scène : bras de Halfred, liaisons tracées à la main, validation,
  // puis paquets entrée k → Halfred → sortie k, chacun à sa vitesse.
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
    // Départ lancé : le paquet quitte sa tuile sans temps mort.
    const easeIn = bezier(0.25, 0.5, 0.45, 1);
    const easeOut = bezier(0.62, 0, 0.12, 1);
    const smooth = bezier(0.65, 0, 0.35, 1);
    const settle = bezier(0.22, 1, 0.36, 1);
    const between = (min: number, max: number) => min + Math.random() * (max - min);
    const flash = (el: Element | null | undefined, strength: number) =>
      el?.querySelector(":scope > .hr-flow__flash")?.animate(
        [{ opacity: strength }, { opacity: 0 }],
        { duration: 900, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
    const pop = (el: Element | null | undefined) =>
      el?.querySelector(".hr-flow__pop")?.animate(
        [{ opacity: 0.9, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.55)" }],
        { duration: 650, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
    const back = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
    // Distances au centre : bord d'une tuile pour les paquets, pour la main, et flanc de Halfred.
    const EDGE = { node: 44, hand: 52, hub: center.offsetWidth * 0.42 };
    // Taille des paquets, relative à leur dessin de base.
    const SIZE = 0.7;

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
    // Portion de la courbe entre deux abscisses, décalée de `off` px selon la normale.
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

    // Bras en « tuyau souple » : de l'épaule à la main, une courbe qui part
    // vers l'extérieur et fléchit sous son poids ; gant blanc au bout.
    const c = at(root, center);
    const hw = center.offsetWidth, hh = center.offsetHeight;
    const shoulder = [-1, 1].map((s) => ({ x: c.x + s * hw * 0.45, y: c.y - hh / 2 + hh * 0.8 }));
    // Au repos, les mains sont dans le dos (sous le buste) : les bras n'en sortent que pour travailler.
    const rest = [-1, 1].map((s, i) => ({ x: shoulder[i].x - s * hw * 0.16, y: c.y - hh / 2 + hh * 0.86 }));
    type Hand = { x: number; y: number; grip: number };
    const hands: Hand[] = rest.map((p) => ({ ...p, grip: 1 }));
    const drawArm = (i: number) => {
      const g = arms.current[i];
      if (!g) return;
      const s = shoulder[i], h = hands[i], side = i ? 1 : -1;
      const dx = h.x - s.x, dy = h.y - s.y, dist = Math.hypot(dx, dy);
      const sag = 6 + dist * 0.16;
      const c1x = s.x + side * Math.min(26, 8 + dist * 0.25), c1y = s.y + sag * 0.6;
      const c2x = h.x - dx * 0.28, c2y = h.y - dy * 0.28 + sag * 0.5;
      const d = `M${s.x.toFixed(1)},${s.y.toFixed(1)} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${h.x.toFixed(1)},${h.y.toFixed(1)}`;
      const [outline, sleeve, glove] = [...g.children] as SVGElement[];
      outline.setAttribute("d", d);
      sleeve.setAttribute("d", d);
      const angle = (Math.atan2(h.y - c2y, h.x - c2x) * 180) / Math.PI;
      glove.setAttribute("transform", `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${h.grip.toFixed(3)})`);
    };

    // Liaisons tracées : 0..1 par courbe (0 à 2 entrées, 3 à 5 sorties).
    const drawn = paths.map(() => 0);
    const setDraw = (i: number, v: number) => {
      drawn[i] = v;
      const el = draws.current[i];
      if (el) el.style.strokeDashoffset = `${1 - v}`;
    };

    // Petite ligne de temps : chaque tween reçoit sa progression 0..1.
    type Tween = { t0: number; dur: number; run: (p: number) => void; begin?: () => void; begun?: boolean };
    let tl: Tween[] = [];
    const add = (t0: number, dur: number, run: (p: number) => void, begin?: () => void) => { tl.push({ t0, dur, run, begin }); };
    const move = (i: number, t0: number, dur: number, to: () => { x: number; y: number }, lift = 0) => {
      let from = { x: 0, y: 0 };
      add(t0, dur, (p) => {
        const e = smooth(p), dst = to();
        hands[i].x = from.x + (dst.x - from.x) * e;
        hands[i].y = from.y + (dst.y - from.y) * e - Math.sin(Math.PI * e) * lift;
      }, () => { from = { x: hands[i].x, y: hands[i].y }; });
    };
    const grip = (i: number, t0: number, dur: number, to: number) => {
      let from = 1;
      add(t0, dur, (p) => { hands[i].grip = from + (to - from) * settle(p); }, () => { from = hands[i].grip; });
    };
    const look = (side: "l" | "r") => { if (head.current) head.current.dataset.look = side; };

    // Branchement d'une entrée : la main va chercher le câble au bord de la
    // tuile, le saisit, le ramène jusqu'à Halfred ; le trait suit la main.
    const plugIn = (k: number, t0: number) => {
      const path = tracks.current[k];
      if (!path) return t0;
      const { len } = table(path);
      move(0, t0, 480, () => point(path, EDGE.hand), 18);
      grip(0, t0 + 420, 160, 0.78);
      add(t0 + 440, 1, () => { pop(nodes.current[k]); });
      add(t0 + 600, 640, (p) => {
        const d = EDGE.hand + (len - EDGE.hub - EDGE.hand) * smooth(p);
        const q = point(path, d);
        hands[0].x = q.x; hands[0].y = q.y;
        setDraw(k, d / len);
      });
      add(t0 + 1240, 1, () => { setDraw(k, 1); flash(center, 0.6); });
      grip(0, t0 + 1240, 200, 1);
      return t0 + 1300;
    };
    // Branchement d'une sortie : la main prend le câble au flanc de Halfred
    // et le porte jusqu'à la tuile, qui s'allume au contact.
    const plugOut = (k: number, t0: number) => {
      const i = INPUTS.length + k;
      const path = tracks.current[i];
      if (!path) return t0;
      const { len } = table(path);
      move(1, t0, 340, () => point(path, EDGE.hub));
      grip(1, t0 + 300, 140, 0.78);
      add(t0 + 440, 700, (p) => {
        const d = EDGE.hub + (len - EDGE.hand - EDGE.hub) * smooth(p);
        const q = point(path, d);
        hands[1].x = q.x; hands[1].y = q.y;
        setDraw(i, d / len);
      });
      add(t0 + 1140, 1, () => { setDraw(i, 1); flash(nodes.current[i], 0.6); });
      grip(1, t0 + 1140, 200, 1);
      return t0 + 1220;
    };
    const unplug = (from: number, to: number, t0: number) => {
      for (let i = from; i < to; i++) {
        let v = 0;
        add(t0, 420, (p) => setDraw(i, v * (1 - smooth(p))), () => { v = drawn[i]; });
      }
    };

    // Paquets.
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
    let flowing = false;
    const stopFlow = () => {
      flowing = false;
      drain.current = false;
      packets.current.forEach((g) => { g?.setAttribute("opacity", "0"); if (g) delete g.dataset.out; });
    };
    const startFlow = (now: number) => {
      flowing = true;
      drain.current = true;
      states = [leg("in", now), leg("in", now + 650), leg("in", now + 1350)];
    };

    // Changement d'étape : on rattrape l'état attendu, puis on joue la suite.
    let shown = -1;
    const enter = (to: number, now: number) => {
      const from = shown;
      shown = to;
      tl = [];
      if (to < 2) { stopFlow(); delete root.dataset.ok; }
      look("l");
      if (from === -1) {
        // Premier affichage (ou retour à l'écran) : état final de l'étape, sans mise en scène.
        paths.forEach((_, i) => setDraw(i, (i < INPUTS.length ? to >= 1 : to >= 2) ? 1 : 0));
        hands.forEach((h, i) => { h.x = rest[i].x; h.y = rest[i].y; h.grip = 1; });
        if (to === 2) { root.dataset.ok = ""; startFlow(now); }
        return;
      }
      if (to < from) {
        unplug(to < 1 ? 0 : INPUTS.length, paths.length, now);
        [0, 1].forEach((i) => { move(i, now, 420, () => rest[i]); grip(i, now, 200, 1); });
        return;
      }
      if (to === 1) {
        // Halfred monte à l'écran (CSS), puis branche les entrées une à une.
        let t = now + 1250;
        INPUTS.forEach((_, k) => { t = plugIn(k, t); });
        move(0, t, 520, () => rest[0], -6);
        return;
      }
      // Étape 2 : les entrées sont branchées, il se tourne vers les sorties.
      INPUTS.forEach((_, k) => setDraw(k, 1));
      move(0, now, 360, () => rest[0]);
      add(now + 150, 1, () => look("r"));
      let t = now + 450;
      OUTPUTS.forEach((_, k) => { t = plugOut(k, t); });
      move(1, t, 520, () => rest[1], -6);
      // Il valide d'un signe de tête, la coche se dessine, les paquets partent.
      add(t + 150, 1, () => {
        look("l");
        head.current?.animate(
          [{ rotate: "0deg" }, { rotate: "-9deg", offset: 0.35 }, { rotate: "2deg", offset: 0.7 }, { rotate: "0deg" }],
          { duration: 750, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
        );
        root.dataset.ok = "";
        check.current?.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 1, offset: 0.3 }, { strokeDashoffset: 0 }], { duration: 650, easing: "ease-out" });
        flash(center, 1);
      });
      add(t + 900, 1, () => startFlow(performance.now()));
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
      drawArm(0);
      drawArm(1);

      if (flowing) INPUTS.forEach((_, k) => {
        const g = packets.current[k];
        const inPath = tracks.current[k];
        const outPath = tracks.current[INPUTS.length + k];
        const st = states[k];
        if (!g || !inPath || !outPath || !st || now < st.start) return;
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
        if (g.getAttribute("opacity") !== "1") g.setAttribute("opacity", "1");
        const path = st.leg === "in" ? inPath : outPath;
        const { len } = table(path);
        // À l'aller, le trajet commence au bord de la tuile : rien ne se passe caché dessous.
        const d = st.leg === "in" ? EDGE.node + (len - EDGE.node) * easeIn(t) : len * easeOut(t);
        if (st.leg === "in") {
          if (!st.seen && d >= EDGE.node) { st.seen = true; st.born = now; pop(nodes.current[k]); }
          if (!st.hit && d >= len - EDGE.hub) { st.hit = true; flash(center, 1); }
        } else if (!st.hit && d >= len - EDGE.node) {
          st.hit = true;
          flash(nodes.current[INPUTS.length + k], 0.45);
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
    return () => { io.disconnect(); cancelAnimationFrame(raf); drain.current = false; };
  }, [paths]);

  useEffect(() => {
    const root = box.current;
    const center = hub.current;
    if (!root || !center) return;
    const draw = () => {
      const { x: cx, y: cy } = at(root, center);
      const w = root.clientWidth;
      setSize({ w, h: root.clientHeight });
      setPaths(nodes.current.map((node, i) => {
        if (!node) return "";
        const { x, y } = at(root, node);
        // Étape 0 : les entrées en rang au centre, espacées selon la largeur.
        if (i < INPUTS.length) {
          const gap = Math.min(node.offsetWidth * 1.8, (w - node.offsetWidth - 32) / 2);
          node.style.setProperty("--dx", `${cx + (i - 1) * gap - x}px`);
          node.style.setProperty("--dy", `${cy - y}px`);
        }
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
      {i < INPUTS.length ? <><span className="hr-flow__pop" aria-hidden /><span className="hr-flow__sweep" aria-hidden /></> : null}
      {i < INPUTS.length ? <span ref={(el) => { badges.current[i] = el; }} className="hr-flow__count num" aria-hidden /> : null}
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d={BRANDS[brand]} />
        {i < INPUTS.length ? (
          <>
            <clipPath id={`${uid}-glyph${i}`}><path d={BRANDS[brand]} /></clipPath>
            <rect className="hr-flow__beam" x="-2" y="-5" width="28" height="10" fill={`url(#${uid}-beam)`} clipPath={`url(#${uid}-glyph${i})`} />
          </>
        ) : null}
      </svg>
    </div>
  );

  return (
    <section ref={section} id="principe" className="hr-section hr-flow-sec" data-wheel="">
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

        <div ref={box} className="hr-flow" data-phase={step} role="img" aria-label={t.flow.diagram}>
          <svg className="hr-flow__beams" width={size.w} height={size.h} aria-hidden>
            <defs>
              <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--hr-glow)" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" />
                <stop offset="1" stopColor="var(--hr-glow)" stopOpacity="0" />
              </linearGradient>
              {INPUTS.map((_, k) => (
                <linearGradient key={k} id={`${uid}-trail${k}`} gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
                </linearGradient>
              ))}
            </defs>
            {paths.map((d, i) => <path key={i} ref={(el) => { tracks.current[i] = el; }} d={d} className="hr-flow__track" data-in={i < INPUTS.length || undefined} />)}
            {/* Liaisons tracées par la main de Halfred (entrées à l'étape 1, sorties à l'étape 2). */}
            {paths.map((d, i) => <path key={i} ref={(el) => { draws.current[i] = el; }} d={d} pathLength={1} className="hr-flow__draw" data-in={i < INPUTS.length || undefined} />)}
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
            {/* Bras de Halfred, passés sous le buste : manche, liseré, gant. */}
            {[0, 1].map((i) => (
              <g key={i} ref={(el) => { arms.current[i] = el; }} className="hr-arm">
                <path className="hr-arm__outline" />
                <path className="hr-arm__sleeve" />
                <g className="hr-arm__glove">
                  <rect x="-10.5" y="-6.5" width="4.5" height="13" rx="1.8" />
                  <circle cx="1.5" cy="0" r="8.5" />
                  <circle cx="0" cy="-7.8" r="3" />
                </g>
              </g>
            ))}
          </svg>
          <div className="hr-flow__col">{INPUTS.map((b, i) => node(b, i))}</div>
          <div ref={hub} className="hr-flow__hub">
            <span className="hr-flow__flash" aria-hidden />
            <div className="hr-butler">
              <Image src="/brand/butler-torso.webp" alt="" width={495} height={214} className="hr-butler__torso" />
              <div ref={head} className="hr-butler__head" data-look="l">
                <Image src="/brand/butler-head.webp" alt="" width={407} height={407} />
              </div>
            </div>
            <svg className="hr-flow__ok" viewBox="0 0 100 132" aria-hidden>
              <g className="hr-flow__tick"><circle cx="90" cy="20" r="11" /><path ref={check} d="M84.8 20.2l3.6 3.6 6.4-7.2" pathLength={1} /></g>
            </svg>
          </div>
          <div className="hr-flow__col">{OUTPUTS.map((b, i) => node(b, INPUTS.length + i))}</div>
        </div>
      </div>
    </section>
  );
}
