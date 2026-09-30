"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import BlurFade from "@/components/blur-fade";
import { BRANDS, type Brand } from "@/components/halfred/brands";
import { BOW, FACE, HEAD, JACKET, SHIRT } from "@/components/halfred/butler-art";
import type { HalfredCopy } from "@/data/content";

const INPUTS: readonly Brand[] = ["gmail", "whatsapp", "googleforms"];
const OUTPUTS: readonly Brand[] = ["googlesheets", "googlecalendar", "googledocs"];
// Deux outils dont on peut se passer (fax, disquette) : Halfred les jette.
const JUNK = [
  "M6 2h8l4 4v3H6V2zm-2 8h16a2 2 0 0 1 2 2v6h-3v4H5v-4H2v-6a2 2 0 0 1 2-2zm3 7v3h10v-3H7zm10-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  "M3 3h14l4 4v14H3V3zm4 0v5h8V3H7zm-1 10v8h12v-8H6z",
];
const REAL = INPUTS.length + OUTPUTS.length;
const STEP_MS = 11000;
// Rythme d'arrivée des notifications par entrée (ms), avant automatisation.
const RATE = [160, 260, 420];
// Étape 0 : tout en vrac autour du PC. Position (fraction de la demi-largeur / demi-hauteur) et inclinaison,
// dans l'ordre : 3 entrées, 3 sorties, 2 outils inutiles.
const MESS: readonly (readonly [number, number, number])[] = [
  [-0.62, -0.5, -12], [0.56, 0.44, 9], [-0.36, 0.66, -6],
  [0.66, -0.4, 14], [-0.72, 0.18, 7], [0.16, -0.72, -9],
  [0.74, 0.02, -16], [0.12, 0.74, 11],
];
// Mains de Halfred (images détourées) : pose, taille, point d'attache au poignet (fraction).
const HANDS: readonly (readonly [string, number, number, number, number])[] = [
  ["rest", 456, 158, 0.1, 0.48], ["thumb", 316, 292, 0.13, 0.72], ["palm", 421, 190, 0.13, 0.59],
  ["fist", 406, 195, 0.1, 0.57], ["point", 409, 200, 0.1, 0.6],
];
// Nœuds des câbles emmêlés : amplitude du détour, par tuile.
const KNOT = [70, -85, 55, -75, 95, -60, 80, -65];
// Câbles coupés à mi-chemin (fil qui crépite, prise qui pend), par tuile.
const CUT = [1, 4, 6];
// Bulles d'erreur : sur quelle tuile chacune est accrochée (tableur, documents, agenda, fax).
const ERR_ON = [3, 5, 4, 6];

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
  const head = useRef<SVGGElement>(null);
  const torso = useRef<SVGGElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<string[]>([]);
  const uid = useId().replace(/:/g, "");
  const tracks = useRef<(SVGPathElement | null)[]>([]);
  const draws = useRef<(SVGPathElement | null)[]>([]);
  const tangle = useRef<(SVGPathElement | null)[]>([]);
  const plugs = useRef<(SVGGElement | null)[]>([]);
  const chips = useRef<(SVGGElement | null)[]>([]);
  const cuts = useRef<(SVGGElement | null)[]>([]);
  const errs = useRef<(SVGGElement | null)[]>([]);
  const mess = useRef<(SVGGElement | null)[]>([]);
  const arms = useRef<(SVGGElement | null)[]>([]);
  const fx = useRef<SVGSVGElement>(null);
  const coil = useRef<SVGGElement>(null);
  const handled = useRef<HTMLElement>(null);
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
    // Le boîtier seul bouge au passage des paquets ; l'écran de monitoring reste immobile.
    const vps = center.querySelector<HTMLElement>(".hr-box__vps");
    const sec = section.current;
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
    // Prises enfoncées : le corps reste dehors, les broches passent sous la tuile (ou le boîtier).
    const EDGE = { node: nw / 2 + 2, hand: nw / 2 + 12, box: bw / 2 + 2 };
    const offstage = window.innerWidth - root.getBoundingClientRect().left + hw;
    // Place de Halfred une fois l'ordre revenu : juste au-dessus du boîtier, qu'il
    // domine ; sa main gauche travaille à gauche, sa main droite à droite.
    // Au-dessus du boîtier, à droite de l'écran de monitoring.
    const stand = { x: c.x + hw * 0.4, y: Math.max(hh / 2 + 2, c.y - bh / 2 - hh / 2 - 18) };

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
    // Après le nuage : pile d'icônes dans la main gauche (la prochaine à poser
    // dessus), rouleau de câbles dans la droite (une prise par câble à brancher).
    const stacked = els.map(() => false);
    let coilO = 0;
    const drawStack = () => {
      const rem = stacked.flatMap((on, i) => (on ? [i] : []));
      // Centre de la paume / du poing : un peu au-delà du poignet, dans l'axe épaule → main.
      const grab = (i: number) => {
        const h = hands[i], s = shoulder(i), l = Math.hypot(h.x - s.x, h.y - s.y) || 1;
        return { x: h.x + ((h.x - s.x) / l) * hw * 0.2, y: h.y + ((h.y - s.y) / l) * hw * 0.06 };
      };
      const palm = grab(0);
      rem.forEach((i, k) => {
        const rank = rem.length - 1 - k, h = palm;
        tiles[i] = { x: h.x - slots[i].x + (rank % 2 ? 2 : -2), y: h.y - nw * 0.34 - rank * nw * 0.12 - slots[i].y, s: 0.55, r: rank % 2 ? 4 : -3, o: body.o, z: 6 };
      });
      const g = coil.current;
      if (!g) return;
      g.style.opacity = String(coilO * body.o);
      const fist = grab(1);
      g.setAttribute("transform", `translate(${fist.x.toFixed(1)} ${fist.y.toFixed(1)}) scale(${(nw / 76).toFixed(3)})`);
      [...g.querySelectorAll<SVGGElement>(".hr-plug")].forEach((pl, i) => { pl.style.opacity = drawn[i] > 0 ? "0" : "1"; });
    };
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
    // `crouch` : élan avant le départ ; `dash` : sortie en trombe, buste devant, tête qui traîne.
    const body = { x: offstage, y: stand.y, s: 1, o: 0, flip: -1, rot: 0, lean: 0, walk: 0, bob: 0, crouch: 0, dash: 0, dir: 1 };
    let focus = -1;
    let face: "l" | "r" = "l";
    // Ce qu'il regarde quand ce n'est pas sa main (le voyant qui s'allume).
    let gaze: (() => { x: number; y: number }) | null = null;
    type Pose = "rest" | "palm" | "fist" | "thumb" | "point";
    type Hand = { x: number; y: number; grip: number; thumb: number; free: boolean; pose: Pose };
    // Décalage du haut du buste dû à l'élan : les épaules et la tête le suivent.
    let neck = 0;
    // Épaule au bout du dôme de la veste.
    const shoulder = (i: number) => ({ x: body.x + neck * 0.85 + (i ? 1 : -1) * hw * 0.275 * body.s, y: body.y + body.bob + hh * 0.065 * body.s });
    // Main libre : croisée dans le dos, derrière le buste (le calque des bras passe sous Halfred).
    const rest = (i: number) => ({ x: body.x + neck * 0.7 + (i ? 1 : -1) * hw * 0.06, y: body.y + body.bob + hh * 0.2 });
    const hands: Hand[] = [0, 1].map((i) => ({ ...rest(i), grip: 1, thumb: 0, free: true, pose: "rest" as Pose }));
    const drawBody = (now: number) => {
      body.bob = Math.sin(now / 520) * 1.6 - body.walk * Math.abs(Math.sin(now / 90)) * 5;
      const f = gaze ? gaze() : focus >= 0 ? hands[focus] : null;
      const hc = { x: body.x, y: body.y - hh * 0.275 };
      // Il regarde ce qu'il fait : le côté de sa cible s'il en a une, sinon le côté de l'étape.
      const right = f ? f.x > body.x + 8 : face === "r";
      const lookDown = f ? clamp((Math.atan2(f.y - hc.y, Math.abs(f.x - hc.x) + 30) * 180) / Math.PI, -25, 35) : 0;
      body.flip = lerp(body.flip, right ? 1 : -1, 0.22);
      const turn = Math.abs(body.flip) < 0.15 ? Math.sign(body.flip || 1) * 0.15 : body.flip;
      body.rot = lerp(body.rot, (right ? 1 : -1) * (lookDown * 0.6 + body.walk * 6), 0.18);
      body.lean = lerp(body.lean, f ? clamp((f.x - hc.x) / hw, -1, 1) * 6 : 0, 0.15);
      man.style.translate = `${(body.x - hw / 2).toFixed(1)}px ${(body.y - hh / 2 + body.bob).toFixed(1)}px`;
      man.style.scale = `${(body.s * (1 + body.crouch * 0.06 + body.dash * 0.14)).toFixed(3)} ${(body.s * (1 - body.crouch * 0.08 - body.dash * 0.05)).toFixed(3)}`;
      man.style.opacity = String(body.o);
      // Élan : le buste s'incline vers la course (skew depuis la taille) ; la tête
      // reste posée sur le col et traîne à peine : rien ne se détache.
      const skew = body.dir * (-body.dash * 14 + body.crouch * 5);
      neck = -Math.tan((skew * Math.PI) / 180) * 165 * (hw / 240);
      if (head.current) {
        head.current.style.scale = `${turn.toFixed(3)} 1`;
        head.current.style.rotate = `${(body.rot - body.dir * body.dash * 12 + body.dir * body.crouch * 6).toFixed(2)}deg`;
        head.current.style.translate = `${(neck - body.dir * body.dash * hw * 0.04).toFixed(1)}px ${(body.crouch * hh * 0.04).toFixed(1)}px`;
      }
      if (torso.current) {
        torso.current.style.rotate = `${(body.lean * 0.6).toFixed(2)}deg`;
        torso.current.style.transform = `skewX(${skew.toFixed(1)}deg)`;
      }
    };

    // --- Bras en tuyau souple, épais comme son buste ; mains rouges comme son visage.
    const drawArm = (i: number) => {
      const g = arms.current[i];
      if (!g) return;
      const h = hands[i];
      if (h.free) { const r = rest(i); h.x = r.x; h.y = r.y; }
      g.style.opacity = String(body.o);
      // Bras articulé : épaule, coude, poignet. Deux segments de longueur fixe ;
      // au-delà de leur portée, le bras s'allonge d'un bloc (sans mollir).
      const s = shoulder(i), side = i ? 1 : -1;
      const dx = h.x - s.x, dy = h.y - s.y, dist = Math.hypot(dx, dy) || 1;
      const seg = hw * 0.42;
      const reach = Math.min(dist, seg * 2);
      const stretch = dist > seg * 2 ? dist / (seg * 2) : 1;
      // Coude : fléchi vers le bas et vers l'extérieur, à la bonne distance des deux bouts.
      const bend = Math.sqrt(Math.max(0, seg * seg - (reach / 2) ** 2)) * stretch;
      let nx = -dy / dist, ny = dx / dist;
      if (ny < 0 || (Math.abs(ny) < 0.2 && nx * side < 0)) { nx = -nx; ny = -ny; }
      const ex = s.x + dx / 2 + nx * bend, ey = s.y + dy / 2 + ny * bend;
      const c2x = ex, c2y = ey;
      const d = `M${s.x.toFixed(1)},${s.y.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)} L${h.x.toFixed(1)},${h.y.toFixed(1)}`;
      const [outline, sleeve, glove] = [...g.children] as SVGElement[];
      outline.setAttribute("d", d);
      sleeve.setAttribute("d", d);
      outline.style.strokeWidth = "0";
      sleeve.style.strokeWidth = `${hw * 0.12}`;
      // Main dessinée (poignet à gauche, doigts à droite), orientée dans l'axe
      // de l'avant-bras ; retournée quand elle part vers la gauche, pour que le
      // pouce reste en haut. La pose suit le geste : poing sur un câble, pouce levé…
      const pose: Pose = h.thumb > 0.5 ? "thumb" : h.pose === "point" ? "point" : h.grip < 0.9 ? "fist" : h.pose;
      const raw = (Math.atan2(h.y - c2y, h.x - c2x) * 180) / Math.PI;
      // Pouce levé : main droite, poing de profil. Index : pointé droit vers le bas.
      // Au repos, la main pend doigts vers le bas, légèrement écartée du corps.
      const hang = pose === "rest" && h.free;
      // Pouce levé : la main suit un peu l'avant-bras, sans casser le poignet.
      const back = Math.abs(raw) > 90;
      // Paume : à plat, tournée vers le haut, pour porter la pile.
      const angle = pose === "palm" ? (back ? 180 : 0) : pose === "thumb" ? clamp(raw, -40, 15) : pose === "point" ? 90 : hang ? 90 - side * 10 : raw;
      const flipY = pose === "palm" ? (back ? -1 : 1) : pose === "thumb" || pose === "point" ? 1 : hang ? -side : Math.abs(raw) > 90 ? -1 : 1;
      const k = ((hw * 0.44) / 420) * (pose === "thumb" ? 1.1 : 1);
      glove.setAttribute("transform", `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${k.toFixed(4)} ${(k * flipY).toFixed(4)})`);
      [...glove.children].forEach((el) => { (el as SVGElement).style.display = !hang && (el as SVGElement).dataset.pose === pose ? "" : "none"; });
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
    // Le PC est plus gros que le boîtier qui le remplace ; des paquets y
    // circulent dans tous les sens, s'arrêtent, repartent en arrière.
    let tangleO = 1;
    // Câble d'un outil jeté : il part avec lui, rien ne reste tendu à l'écran.
    const wired = els.map(() => 1);
    let pcS = 1;
    const PC_S = 1.5;
    const junk = (now: number) => els.forEach((_, i) => {
      const el = tangle.current[i], dot = mess.current[i];
      if (!el || !dot) return;
      dot.style.opacity = String(tangleO * tiles[i].o * wired[i]);
      if (tangleO <= 0) return;
      const len = el.getTotalLength();
      const u = 0.5 + 0.5 * Math.sin(now / (380 + i * 70) + i * 1.9) * Math.cos(now / (900 + i * 130) + i);
      const q = el.getPointAtLength(u * len);
      dot.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
      if (Math.sin(now / 150 + i * 2.3) > 0.3) dot.dataset.hot = "";
      else delete dot.dataset.hot;
    });
    const drawTangle = (now: number) => els.forEach((_, i) => {
      const el = tangle.current[i];
      if (!el) return;
      el.style.opacity = String(tangleO * tiles[i].o * wired[i]);
      const dead = cuts.current[i];
      if (dead) dead.style.opacity = String(tangleO * tiles[i].o * wired[i]);
      if (tangleO <= 0) return;
      const a = { x: slots[i].x + tiles[i].x, y: slots[i].y + tiles[i].y };
      const b = { x: c.x + ((i % 4) - 1.5) * bw * 0.12 * pcS, y: c.y + bh * 0.3 * pcS };
      const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
      const px = -dy / l, py = dx / l, k = KNOT[i] * (1 + 0.08 * Math.sin(now / 400 + i));
      const m = { x: a.x + dx * 0.5 + px * k * 0.5, y: a.y + dy * 0.5 + py * k * 0.5 };
      // Boucle : les poignées se croisent autour du milieu. Un câble coupé s'arrête là.
      const c1 = `C${(a.x + dx * 0.6 + px * k).toFixed(1)},${(a.y + dy * 0.6 + py * k).toFixed(1)} ${(m.x - dx * 0.35 - px * k * 0.6).toFixed(1)},${(m.y - dy * 0.35 - py * k * 0.6).toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)}`;
      const cut = cuts.current[i];
      if (cut) {
        // Un câble coupé pend sous l'outil : la prise se balance au bout, broches vers le bas.
        const sway = Math.sin(now / 520 + i * 1.7) * 9;
        const m2 = { x: a.x + Math.sign(dx) * 18 + sway, y: a.y + nw * 1.05 };
        el.setAttribute("d", `M${a.x.toFixed(1)},${a.y.toFixed(1)} C${(a.x + Math.sign(dx) * 30).toFixed(1)},${(a.y + nw * 0.2).toFixed(1)} ${m2.x.toFixed(1)},${(m2.y - nw * 0.45).toFixed(1)} ${m2.x.toFixed(1)},${m2.y.toFixed(1)}`);
        cut.style.opacity = String(tangleO * tiles[i].o);
        const m = m2, ang = 90 - sway * 1.5;
        const [plugG, spark] = [...cut.children] as SVGElement[];
        plugG.setAttribute("transform", `translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
        // Étincelles : un éclat qui saute au bout du fil, par à-coups.
        const f = Math.floor(now / 70 + i * 3);
        const on = (f * 7919 + i) % 5 < 2;
        spark.setAttribute("transform", `translate(${(m.x + Math.cos(ang * Math.PI / 180) * 10).toFixed(1)} ${(m.y + Math.sin(ang * Math.PI / 180) * 10).toFixed(1)}) rotate(${(f * 37) % 90}) scale(${on ? 0.6 + ((f * 13) % 7) / 10 : 0})`);
      } else {
        el.setAttribute("d", `M${a.x.toFixed(1)},${a.y.toFixed(1)} ${c1} S${(b.x + px * k * 0.4).toFixed(1)},${(b.y + py * k * 0.4).toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`);
      }
    });
    const drawErrs = (now: number) => errs.current.forEach((g, i) => {
      if (!g) return;
      g.style.opacity = String(tangleO);
      if (tangleO <= 0) return;
      const on = ERR_ON[i % ERR_ON.length];
      const text = g.querySelector("text")!;
      const w = text.getComputedTextLength() + 16;
      g.querySelectorAll("rect").forEach((rc) => rc.setAttribute("width", `${w}`));
      // Chaque bulle surgit, reste un moment, disparaît, à son propre rythme.
      const q = ((now / 2600 + i * 0.29) % 1);
      const s = q < 0.08 ? back(q / 0.08) : q > 0.82 ? Math.max(0, 1 - (q - 0.82) / 0.1) : 1;
      g.style.opacity = String(tangleO * tiles[on].o * wired[on]);
      // Pastille accrochée au coin haut gauche de la tuile (comme le compteur à droite) : elle tourne et bouge avec elle.
      const tl = tiles[on], half = (nw / 2) * tl.s;
      const cx = slots[on].x + tl.x, cy = slots[on].y + tl.y;
      g.setAttribute("transform", `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${tl.r.toFixed(1)}) translate(${(-half - w * 0.3).toFixed(1)} ${(-half - 8).toFixed(1)}) scale(${s.toFixed(3)})`);
    });

    // --- Nuage de bagarre, façon dessin animé : rayons derrière, bouffées
    // ombrées en deux couches qui bouillonnent, bras et jambes qui dépassent,
    // onomatopées, étoiles qui tournent, et tout ce qui en est éjecté (une
    // mamie à tête de Halfred, un chat, un pigeon, une chaussure, des bouffées).
    const cloud = { t0: -1, dur: 2300 };
    const R = Math.min(W * 0.25, H * 0.34);
    const ring = (n: number, d: number, r: number, seed: number) => Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + seed;
      return { x: Math.cos(a) * R * d, y: Math.sin(a) * R * d * 0.8, r: R * r * (0.85 + ((i * 37 + seed * 10) % 10) / 40), ph: i * 1.7 + seed };
    });
    const puffsBack = [...ring(11, 0.7, 0.34, 0.3), ...ring(5, 0.35, 0.38, 1.1)];
    const puffsFront = [...ring(9, 0.45, 0.3, 0.8), ...ring(4, 0.12, 0.3, 2)];
    // Trajectoires réparties autour du nuage pour ne jamais croiser une onomatopée.
    const EJECT = [
      { t: 0.3, d: 0.5, a: -0.35, dist: W * 0.95, spin: 620, lift: R * 0.9, s: 1.15 },
      { t: 0.18, d: 0.42, a: 3.35, dist: R * 2.6, spin: -480, lift: R * 0.5, s: 1 },
      { t: 0.46, d: 0.46, a: -1.9, dist: R * 3, spin: 30, lift: 0, s: 1 },
      { t: 0.6, d: 0.34, a: 1.85, dist: R * 2.2, spin: 760, lift: R * 0.4, s: 0.9 },
      { t: 0.24, d: 0.3, a: 0.7, dist: R * 1.7, spin: 0, lift: 0, s: 0.8 },
      { t: 0.42, d: 0.3, a: 4.1, dist: R * 1.7, spin: 0, lift: 0, s: 0.7 },
      { t: 0.66, d: 0.28, a: 2.6, dist: R * 1.6, spin: 0, lift: 0, s: 0.75 },
    ];
    const WORDS = [{ t: 0.12, x: -1.05, y: -0.62, r: -12 }, { t: 0.4, x: 1.08, y: 0.42, r: 9 }, { t: 0.63, x: 0.1, y: -1.05, r: -5 }];
    const drawCloud = (now: number) => {
      const svg = fx.current;
      if (!svg) return;
      const p = cloud.t0 < 0 ? -1 : (now - cloud.t0) / cloud.dur;
      if (p < 0 || p > 1) { svg.style.opacity = "0"; root.style.translate = ""; return; }
      svg.style.opacity = "1";
      // La scène tremble pendant la bagarre.
      root.style.translate = p > 0.08 && p < 0.84 ? `${((Math.random() - 0.5) * 5).toFixed(1)}px ${((Math.random() - 0.5) * 5).toFixed(1)}px` : "";
      // Entrée : le nuage éclate d'un coup (léger dépassement). Sortie : il se
      // dissipe en gonflant, au lieu de se défaire en bulles éparses.
      const grow = p < 0.12 ? back(p / 0.12) : 1;
      const fade = p > 0.82 ? smooth((p - 0.82) / 0.18) : 0;
      // Le premier enfant est <defs>.
      const [rays, stars, limbs, back2, front, ejects, words, dizzy] = [...svg.children].slice(1) as SVGGElement[];
      // Le nuage se dissipe ; ce qu'il a éjecté, non : ça file jusqu'hors de l'écran.
      [rays, stars, limbs, back2, front, words, dizzy].forEach((g) => { g.style.opacity = String(1 - fade); });
      rays.setAttribute("transform", `translate(${c.x} ${c.y}) rotate(${(now / 60) % 360}) scale(${(grow * R * 1.9 / 200).toFixed(3)})`);
      const boil = (layer: SVGGElement, list: typeof puffsBack, k: number) => {
        const [ink, fill] = [...layer.children] as SVGGElement[];
        list.forEach((pf, i) => {
          const gr = clamp(grow * 1.12 - (i % 5) * 0.025, 0, 1.2) * (1 + fade * 0.25);
          const r = Math.max(0, pf.r * gr * (1 + 0.08 * Math.sin(now / (70 + k * 12) + pf.ph)));
          const cx = (c.x + pf.x * (1 + fade * 0.3) + Math.sin(now / 55 + pf.ph) * 3).toFixed(1);
          const cy = (c.y + pf.y * (1 + fade * 0.3) + Math.cos(now / 60 + pf.ph) * 3).toFixed(1);
          for (const el of [ink.children[i], fill.children[i]]) { el.setAttribute("cx", cx); el.setAttribute("cy", cy); el.setAttribute("r", r.toFixed(1)); }
        });
      };
      boil(back2, puffsBack, 0);
      boil(front, puffsFront, 1);
      [...stars.children].forEach((el, i) => {
        const a = i * 1.13 + Math.floor(now / 240 + i * 0.37) * 2.1;
        const q = (now / 240 + i * 0.37) % 1;
        const sc = Math.sin(Math.PI * q) * grow * 1.3;
        el.setAttribute("transform", `translate(${(c.x + Math.cos(a) * R * 0.98).toFixed(1)} ${(c.y + Math.sin(a) * R * 0.76).toFixed(1)}) rotate(${(q * 40 + i * 20).toFixed(0)}) scale(${(sc * R * 0.012).toFixed(3)})`);
      });
      [...limbs.children].forEach((g, i) => {
        const leg = i >= 3;
        const a = i * 1.26 + 0.4 + Math.sin(now / (leg ? 120 : 160) + i * 2) * 0.6;
        const reach = R * (1.25 + 0.22 * Math.sin(now / 85 + i)) * grow;
        const ex = c.x + Math.cos(a) * reach, ey = c.y + Math.sin(a) * reach * 0.82;
        const [o, sl, end] = [...g.children] as SVGElement[];
        const d = `M${c.x.toFixed(1)},${c.y.toFixed(1)} Q${(c.x + Math.cos(a + 0.5) * reach * 0.6).toFixed(1)},${(c.y + Math.sin(a + 0.5) * reach * 0.5).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
        o.setAttribute("d", d); sl.setAttribute("d", d);
        o.style.strokeWidth = `${hw * (leg ? 0.18 : 0.15)}`; sl.style.strokeWidth = `${hw * (leg ? 0.14 : 0.11)}`;
        end.setAttribute("transform", `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${((a * 180) / Math.PI).toFixed(0)}) scale(${(hw / 90).toFixed(3)})`);
      });
      [...words.children].forEach((node, i) => { const g = node as SVGGElement;
        const w = WORDS[i];
        const u = (p - w.t) / 0.26;
        if (u < 0 || u > 1) { g.style.opacity = "0"; return; }
        g.style.opacity = String(u > 0.8 ? (1 - u) / 0.2 : 1);
        const sc = u < 0.25 ? back(u / 0.25) : 1 + (u - 0.25) * 0.08;
        g.setAttribute("transform", `translate(${(c.x + w.x * R * 1.15).toFixed(1)} ${(c.y + w.y * R).toFixed(1)}) rotate(${w.r}) scale(${(sc * R / 120).toFixed(3)})`);
      });
      [...ejects.children].forEach((node, i) => { const g = node as SVGGElement;
        const e = EJECT[i];
        const u = (p - e.t) / e.d;
        if (u < 0 || u > 1) { g.style.opacity = "0"; return; }
        g.style.opacity = String(i < 4 ? Math.min(1, u / 0.08) : Math.min(1, u / 0.08, (1 - u) / 0.3));
        const f = easeIn(u);
        // Les quatre personnages vont jusqu'au bord de la fenêtre et au-delà.
        const dist = i < 4 ? Math.hypot(window.innerWidth, window.innerHeight) : e.dist;
        const x = c.x + Math.cos(e.a) * (R * 0.4 + f * dist);
        const y = c.y + Math.sin(e.a) * (R * 0.4 + f * dist) - Math.sin(Math.PI * u) * e.lift;
        const rot = i >= 4 ? (e.a * 180) / Math.PI : e.spin * u;
        g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(e.s * R / 110).toFixed(3)})`);
      });
      [...dizzy.children].forEach((el, i) => {
        const a = now / 280 + (i / 5) * Math.PI * 2;
        const x = c.x + Math.cos(a) * R * 0.8, y = c.y - R * 0.78 + Math.sin(a) * R * 0.22;
        el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(now / 6) % 360}) scale(${(grow * R / 130).toFixed(3)})`);
        (el as SVGElement).style.opacity = String(Math.sin(a) > -0.2 ? 1 : 0.35);
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
    // Prise sur une tuile : la main passe sous son bord bas, les doigts cachés dessous.
    const under = (i: number) => ({ x: slots[i].x + tiles[i].x - nw * 0.12, y: slots[i].y + tiles[i].y + nw * tiles[i].s * 0.34 });

    // Il attrape un outil inutile, le soulève au-dessus de sa tête, puis le
    // lance tout à droite : il sort du cadre en tournoyant.
    const offRight = window.innerWidth - root.getBoundingClientRect().left + nw * 1.5;
    const follow = (hand: number, j: number, t0: number, dur: number) =>
      add(t0, dur, () => { const u = under(j); hands[hand].x = u.x; hands[hand].y = u.y; });
    const toss = (hand: number, j: number, t0: number) => {
      move(hand, t0, 260, () => under(j), 16, snappy);
      grip(hand, t0 + 240, 60, 0.8);
      once(t0 + 250, () => { els[j].animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 180, composite: "add" }); });
      // Soulevé au-dessus de la tête, tenu fermement.
      tile(j, t0 + 300, 240, () => ({ x: body.x + hw * 0.1 - slots[j].x, y: body.y - hh * 0.85 - slots[j].y, s: 1.05, r: -25, o: 1, z: 5 }), smooth);
      follow(hand, j, t0 + 300, 240);
      add(t0 + 560, 160, (p) => { wired[j] = 1 - p; });
      tile(j, t0 + 560, 720, () => ({ x: offRight - slots[j].x, y: c.y - H * 0.1 - slots[j].y, s: 0.95, r: 0, o: 1, z: 5 }), bezier(0.3, 0, 0.6, 1), H * 0.3, 900);
      follow(hand, j, t0 + 560, 90);
      toRest(hand, t0 + 650, 240);
      return t0 + 700;
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
    // Étiquette posée sur le câble (le texte suit sa courbe) ; largeur mesurée une fois par libellé.
    const widths = new Map<string, number>();
    const label = (k: number, n: number) => {
      const g = chips.current[k];
      if (!g) return;
      const list = labels.current[k];
      const tp = g.querySelector("textPath")!;
      const word = list[n % list.length];
      tp.textContent = word;
      if (!widths.has(word)) widths.set(word, (g.querySelector("text") as SVGTextElement).getComputedTextLength() + 20);
      g.dataset.w = String(widths.get(word));
    };
    // Portion de la courbe entre deux abscisses, pour la pastille qui épouse le câble.
    const seg = (path: SVGPathElement, from: number, to: number, n = 10) => {
      let d = "";
      for (let i = 0; i <= n; i++) {
        const q = point(path, from + ((to - from) * i) / n);
        d += `${i ? "L" : "M"}${q.x.toFixed(1)},${q.y.toFixed(1)}`;
      }
      return d;
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
      // Près du boîtier, l'étiquette se resserre en paquet (et se déplie en repartant) :
      // aucun texte n'entre ni ne sort de la machine.
      // À l'entrée, le pli se fait sur la seconde moitié du trajet : c'est déjà un paquet en approchant du boîtier.
      const m = st.leg === "in" ? clamp((easeIn(t) - 0.5) / 0.35, 0, 1) : 1 - clamp((t - 0.08) / 0.26, 0, 1);
      const e = smooth(m);
      const half = lerp(Number(g.dataset.w ?? 60) / 2, 7, e);
      const [edge, bg, text] = [...g.children] as SVGElement[];
      const shape = seg(path, d - half, d + half);
      edge.setAttribute("d", shape);
      bg.setAttribute("d", shape);
      edge.style.strokeWidth = `${lerp(22, 11, e)}`;
      bg.style.strokeWidth = `${lerp(20, 8, e)}`;
      const tp = text.firstElementChild as SVGTextPathElement;
      if (tp.getAttribute("href") !== `#${uid}-track${i}`) tp.setAttribute("href", `#${uid}-track${i}`);
      tp.setAttribute("startOffset", d.toFixed(1));
      text.style.opacity = String(1 - Math.min(1, e * 1.6));
      if (e > 0.6) g.dataset.packet = "";
      else delete g.dataset.packet;
      g.style.opacity = String(Math.min(1, t * 8, (1 - t) * 8));
      if (!st.hit && t > 0.92) {
        st.hit = true;
        if (st.leg === "in") {
          glow(i, 0);
          if (handled.current) handled.current.textContent = String(Number(handled.current.textContent) + 1);
          vps?.animate([{ scale: 1.05 }, { scale: 1 }], { duration: 300, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
        } else glow(i, 1);
      }
    });

    // --- États finaux de chaque étape.
    let shown = -1;
    const settleTo = (to: number) => {
      tiles.forEach((_, i) => { tiles[i] = to === 0 ? messy(i) : home(i); });
      paths.forEach((_, i) => setDraw(i, to >= 1 ? 1 : 0));
      tangleO = to === 0 ? 1 : 0;
      wired.fill(1);
      pcS = to === 0 ? PC_S : 1;
      center.dataset.face = to === 0 ? "pc" : "vps";
      if (to === 2) center.dataset.on = "";
      else delete center.dataset.on;
      Object.assign(body, to === 1 ? { x: stand.x, y: stand.y, o: 1 } : { x: offstage, y: stand.y, o: 0 }, { s: 1, walk: 0, crouch: 0, dash: 0 });
      face = to === 2 ? "r" : "l";
      hands.forEach((h) => { h.free = true; h.grip = 1; h.thumb = 0; h.pose = "rest"; });
      stacked.fill(false);
      coilO = 0;
      focus = -1;
      gaze = null;
      delete center.dataset.boot;
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
      stacked.fill(false);
      coilO = 0;
      cloud.t0 = -1;
      gaze = null;
      delete center.dataset.boot;
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
          add(now + 100, 300, (p) => { pcS = lerp(1, PC_S, settle(p)); });
        }
        return;
      }
      if (to === 1) {
        face = "l";
        // Il entre par la droite, jette les deux outils inutiles…
        // Même élan qu'à la sortie, en miroir : il arrive en trombe, freine, se tasse.
        Object.assign(body, { x: offstage, y: stand.y, o: 1, s: 1, dir: -1, dash: 1 });
        walk(now, 560, { x: c.x + bw * 0.9, y: stand.y }, bezier(0.1, 0.5, 0.4, 1));
        add(now, 560, (p) => { body.dash = 1 - smooth(clamp((p - 0.35) / 0.55, 0, 1)); });
        add(now + 440, 240, (p) => { body.crouch = Math.sin(Math.PI * p); });
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
        // …rien ne se voit pendant la bagarre ; quand le nuage retombe, tout est
        // déjà rangé : les tuiles se posent à leur place, le PC est devenu le boîtier.
        once(t + 900, () => { center.dataset.face = "vps"; pcS = 1; });
        // Le nuage se dissipe sur Halfred seul, devant le boîtier : pile d'icônes
        // dans une main, rouleau de câbles dans l'autre. Rien n'apparaît ailleurs.
        const clear = t + 60 + cloud.dur * 0.84;
        const hold = (i: number) => ({ x: body.x + (i ? 1 : -1) * hw * 0.34, y: body.y + hh * 0.18 });
        once(clear - 260, () => {
          Object.assign(body, { x: stand.x, y: stand.y, s: 1, o: 1, walk: 0 });
          hands.forEach((h, i) => { Object.assign(h, hold(i), { free: false }); });
          hands[0].pose = "palm";
          hands[0].grip = 1;
          hands[1].grip = 0.8;
          stacked.fill(true);
          for (let i = REAL; i < stacked.length; i++) stacked[i] = false;
          coilO = 1;
        });
        t = clear + 200;
        // Il pose chaque icône à sa place, l'une après l'autre, du haut de la pile.
        for (let i = 0; i < REAL; i++) {
          move(0, t, 240, () => ({ x: slots[i].x, y: slots[i].y + nw * 0.34 }), 14, snappy);
          once(t + 240, () => { stacked[i] = false; pop(els[i]); });
          tile(i, t + 240, 200, () => home(i), settle);
          t += 300;
        }
        once(t, () => { hands[0].pose = "rest"; });
        toRest(0, t, 240);
        // Puis il déroule ses câbles : un par un, du boîtier jusqu'à chaque outil.
        for (let i = 0; i < REAL; i++) { plug(1, i, t); t += 540; }
        once(t, () => { coilO = 0; });
        toRest(1, t, 240);
        return;
      }
      // Étape 2 : il appuie sur le voyant du boîtier (main la plus proche), le
      // regarde démarrer, lève le pouce et sort ; l'automatisation tourne.
      face = "r";
      const led = () => ({ x: c.x + bw * 0.4 - 4, y: c.y + bh * 0.36 });
      gaze = led;
      hands[1].pose = "point";
      // Le poignet se pose au-dessus du voyant : le bout de l'index le touche.
      move(1, now, 260, () => ({ x: led().x + hw * 0.02, y: led().y - hw * 0.37 }), 10, snappy);
      once(now + 260, () => {
        center.dataset.boot = "";
        vps?.animate([{ scale: 1 }, { scale: 0.97 }, { scale: 1 }], { duration: 220 });
      });
      once(now + 360, () => { hands[1].pose = "rest"; });
      toRest(1, now + 360, 240);
      once(now + 1260, () => {
        delete center.dataset.boot;
        center.dataset.on = "";
        vps?.animate([{ scale: 1 }, { scale: 1.07 }, { scale: 1 }], { duration: 380, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
      });
      once(now + 1380, () => { gaze = null; });
      const up = () => ({ x: shoulder(1).x + hw * 0.5, y: body.y + hh * 0.08 + body.bob });
      move(1, now + 1400, 220, up, 0, snappy);
      add(now + 1480, 200, (p) => { hands[1].thumb = snappy(p); });
      once(now + 1520, () => {
        head.current?.animate(
          [{ rotate: "0deg" }, { rotate: "10deg", offset: 0.4 }, { rotate: "-3deg", offset: 0.75 }, { rotate: "0deg" }],
          { duration: 520, easing: "cubic-bezier(0.45, 0, 0.55, 1)", composite: "add" },
        );
      });
      add(now + 2000, 140, (p) => { hands[1].thumb = 1 - p; });
      toRest(1, now + 2000, 200);
      // Départ façon dessin animé : il se ramasse, puis file ; le buste part
      // devant, la tête suit en retard, le tout s'étire avec la vitesse.
      body.dir = 1;
      add(now + 2000, 180, (p) => { body.crouch = smooth(p); });
      add(now + 2180, 120, (p) => { body.crouch = 1 - p; body.dash = snappy(p); });
      walk(now + 2180, 520, { x: offstage, y: stand.y }, bezier(0.6, 0, 0.9, 0.5));
      once(now + 2700, () => { body.o = 0; body.dash = 0; body.crouch = 0; });
      once(now + 2300, () => startFlow(performance.now()));
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
      // Tant qu'une étape se joue, la section retient la molette (voir snap.tsx).
      if (sec && (tl.length > 0) !== ("busy" in sec.dataset)) { if (tl.length) sec.dataset.busy = ""; else delete sec.dataset.busy; }
      drawBody(still ? 0 : now);
      drawStack();
      drawTiles();
      center.style.scale = pcS.toFixed(3);
      drawTangle(still ? 0 : now);
      junk(still ? 0 : now);
      drawErrs(still ? 0 : now);
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
  }, [paths, uid]);

  useEffect(() => {
    const center = box.current;
    const root = center?.parentElement;
    if (!root || !center) return;
    // Seul un vrai changement de géométrie relance la mise en scène (sinon une
    // séquence en cours repartirait de son état final).
    let key = "";
    const draw = () => {
      const { x: cx, y: cy } = at(root, center);
      const next = `${root.clientWidth}x${root.clientHeight}:${cx},${cy}:` + nodes.current.slice(0, REAL).map((n) => n ? `${n.offsetLeft},${n.offsetTop},${n.offsetWidth}` : "").join("|");
      if (next === key) return;
      key = next;
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
  // Onomatopée : éclat à douze pointes, rayon 60 ; petite étoile à cinq branches pour les étoiles qui tournent.
  const burst = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2, r = i % 2 ? 40 : 60;
    return `${(Math.cos(a) * r * 1.3).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  const tiny = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 4 : 10;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
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
            {paths.map((d, i) => <path key={i} id={`${uid}-track${i}`} ref={(el) => { tracks.current[i] = el; }} d={d} className="hr-flow__track" />)}
            {/* La pagaille : un câble emmêlé par outil, jusqu'au PC. */}
            {Array.from({ length: REAL + JUNK.length }, (_, i) => (
              <path key={i} ref={(el) => { tangle.current[i] = el; }} className="hr-tangle" />
            ))}
            {Array.from({ length: REAL + JUNK.length }, (_, i) => (
              <g key={i} ref={(el) => { mess.current[i] = el; }} className="hr-mess"><circle r="4.5" /></g>
            ))}
            {/* Fils coupés qui crépitent, prises débranchées, bulles d'erreur. */}
            {CUT.map((i) => (
              <g key={i} ref={(el) => { cuts.current[i] = el; }} className="hr-cut">
                <g className="hr-plug hr-plug--dead"><rect className="hr-plug__body" x="-9" y="-4.5" width="10" height="9" rx="2.2" /><path className="hr-plug__pins" d="M1 -2.4h4M1 2.4h4" /></g>
                <polygon className="hr-spark" points="0,-9 2,-2 9,0 2,2 0,9 -2,2 -9,0 -2,-2" />
              </g>
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
                <path className="hr-chip__edge" /><path className="hr-chip__bg" />
                <text dy="4"><textPath href={`#${uid}-track${k}`} textAnchor="middle" /></text>
              </g>
            ))}
          </svg>
          <div className="hr-flow__col">{INPUTS.map((b, i) => node(BRANDS[b], i))}</div>
          <div ref={box} className="hr-flow__box" data-face="pc">
            {/* Avant : un vieux PC où tout est branché en vrac. */}
            <div className="hr-box__pc" aria-hidden>
              <span className="hr-pc__screen">
                <svg viewBox="0 0 24 24"><path d="M12 3l10 18H2z" className="hr-box__warn" /><path d="M12 10v5M12 18v.5" className="hr-box__bang" /></svg>
              </span>
              <span className="hr-pc__neck" />
              <span className="hr-pc__foot" />
            </div>
            {/* Après : le boîtier Halfred, logo gravé comme sur l'iMac, voyant qui s'allume. */}
            <div className="hr-box__vps" aria-hidden>
              <span className="hr-box__vents"><i /><i /><i /></span>
              <Image src="/brand/halfred-mark.png" alt="" width={256} height={339} className="hr-box__logo" />
              <span className="hr-box__led" />
            </div>
            {/* Le PC du début, rangé sous le boîtier : il affiche le monitoring, au vert. */}
            <div className="hr-flow__mon" aria-hidden>
              <span className="hr-pc__screen hr-mon">
                <span className="hr-mon__head"><i />{t.flow.monitor[0]}</span>
                <svg className="hr-mon__spark" viewBox="0 0 120 30" preserveAspectRatio="none">
                  <path d="M0 20 L10 18 L20 21 L30 17 L40 19 L50 16 L60 20 L70 18 L80 21 L90 17 L100 19 L110 16 L120 20 L130 18 L140 21 L150 17 L160 19 L170 16 L180 20 L190 18 L200 21 L210 17 L220 19 L230 16 L240 20" />
                </svg>
                <span className="hr-mon__foot"><b ref={handled}>0</b> {t.flow.monitor[1]} · 0 err.</span>
              </span>
              <span className="hr-pc__neck" />
              <span className="hr-pc__foot" />
            </div>
          </div>
          <div className="hr-flow__col">{OUTPUTS.map((b, i) => node(BRANDS[b], INPUTS.length + i))}</div>
          {JUNK.map((g, j) => node(g, REAL + j, true))}
          {/* Bras de Halfred, sous son buste : manche, liseré, main (pouce en dernier). */}
          <svg className="hr-flow__arms" width={size.w} height={size.h} aria-hidden>
            <defs>
              <linearGradient id={`${uid}-err`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--hr-red)" /><stop offset="1" stopColor="var(--hr-deep)" /></linearGradient>
            </defs>
            {/* Bulles d'erreur : devant le PC et les tuiles. */}
            {t.flow.mess.map((m, i) => (
              <g key={m} ref={(el) => { errs.current[i] = el; }} className="hr-err">
                <rect y="-10" height="20" rx="10" fill={`url(#${uid}-err)`} />
                <rect y="-10" height="20" rx="10" className="hr-err__shine" />
                <text y="4" x="8">{m}</text>
              </g>
            ))}
            {/* Rouleau de câbles tenu en main : quelques boucles, une prise par câble à brancher. */}
            <g ref={coil} className="hr-coil" style={{ opacity: 0 }}>
              <ellipse cx="-2" cy="14" rx="15" ry="19" /><ellipse cx="2" cy="16" rx="13" ry="17" /><ellipse cx="0" cy="18" rx="16" ry="15" />
              {Array.from({ length: REAL }, (_, i) => (
                <g key={i} className="hr-plug" transform={`rotate(${-75 + i * 30}) translate(0 -20) rotate(-90)`}>
                  <path className="hr-coil__lead" d="M-20 0H-9" />
                  <rect className="hr-plug__body" x="-9" y="-4.5" width="10" height="9" rx="2.2" /><path className="hr-plug__pins" d="M1 -2.4h4M1 2.4h4" />
                </g>
              ))}
            </g>
            {[0, 1].map((i) => (
              <g key={i} ref={(el) => { arms.current[i] = el; }} className="hr-arm">
                <path className="hr-arm__outline" />
                <path className="hr-arm__sleeve" />
                <g className="hr-arm__glove">
                  {HANDS.map(([pose, w, h, ax, ay]) => (
                    <image key={pose} data-pose={pose} href={`/brand/hand-${pose}.webp`} width={w} height={h} x={-ax * w} y={-ay * h} style={{ display: pose === "rest" ? undefined : "none" }} />
                  ))}
                </g>
              </g>
            ))}
          </svg>
          <div ref={hub} className="hr-flow__hub">
            <svg className="hr-butler" viewBox="0 0 240 320" aria-hidden>
              <g ref={torso} className="hr-butler__torso">
                <path d={JACKET} className="hr-butler__jacket" />
                <path d={SHIRT} className="hr-butler__shirt" />
                <path d={BOW} className="hr-butler__bow" />
                <circle cx="120" cy="240" r="3.4" className="hr-butler__bow" />
                <circle cx="120" cy="258" r="3.4" className="hr-butler__bow" />
              </g>
              <g ref={head} className="hr-butler__head">
                <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} className="hr-butler__hair" />
                <path d={FACE} className="hr-butler__face" />
              </g>
            </svg>
          </div>
          {/* Nuage de bagarre : étoiles d'impact, bras qui dépassent, bouffées par-dessus. */}
          <svg ref={fx} className="hr-flow__fx" width={size.w} height={size.h} aria-hidden style={{ opacity: 0 }}>
            <defs>
              <radialGradient id={`${uid}-puff`} cx="0.4" cy="0.35" r="0.75">
                <stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor="#eceef3" /><stop offset="1" stopColor="#c7cad3" />
              </radialGradient>
              {/* Rayons : forts au centre, éteints bien avant le bord du schéma. */}
              <radialGradient id={`${uid}-ray`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="200">
                <stop offset="0.25" stopColor="var(--hr-red)" stopOpacity="0.5" /><stop offset="1" stopColor="var(--hr-red)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="hr-fx__rays">{Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2, w = i % 2 ? 0.035 : 0.07;
              return <polygon key={i} fill={`url(#${uid}-ray)`} points={`0,0 ${Math.cos(a - w) * 200},${Math.sin(a - w) * 200} ${Math.cos(a + w) * 200},${Math.sin(a + w) * 200}`} />;
            })}</g>
            <g>{Array.from({ length: 6 }, (_, i) => <polygon key={i} points={star} className="hr-fx__star" data-alt={i % 2 || undefined} />)}</g>
            <g>{Array.from({ length: 5 }, (_, i) => (
              <g key={i}>
                <path className="hr-arm__outline" /><path className="hr-arm__sleeve" />
                {i < 3
                  ? <circle r="11" className="hr-fx__hand" />
                  : <path d="M-6 -9 h10 q12 0 14 9 q2 8 -8 8 h-18 z" className="hr-fx__shoe" />}
              </g>
            ))}</g>
            {/* Deux couches de bouffées ; chacune tracée deux fois (contour épais
                dessous, remplissage dessus) : une seule silhouette de nuage, sans
                les traits de chaque cercle à l'intérieur. */}
            <g>
              <g>{Array.from({ length: 16 }, (_, i) => <circle key={i} className="hr-fx__ink" />)}</g>
              <g>{Array.from({ length: 16 }, (_, i) => <circle key={i} className="hr-fx__puff--back" />)}</g>
            </g>
            <g>
              <g>{Array.from({ length: 13 }, (_, i) => <circle key={i} className="hr-fx__ink hr-fx__ink--thin" />)}</g>
              <g>{Array.from({ length: 13 }, (_, i) => <circle key={i} fill={`url(#${uid}-puff)`} />)}</g>
            </g>
            <g>
              {/* La mamie éjectée, avec la tête de Halfred. */}
              <g className="hr-ej">
                <path d="M-8 30 L-15 56 M8 30 L15 56" className="hr-ej__stocking" />
                <ellipse cx="-17" cy="58" rx="9" ry="4.5" className="hr-ej__dark" />
                <ellipse cx="17" cy="58" rx="9" ry="4.5" className="hr-ej__dark" />
                <path d="M-24 34 Q0 -4 24 34 Z" className="hr-ej__dress" />
                <path d="M-20 -2 Q0 -12 20 -2 L16 13 Q0 5 -16 13 Z" className="hr-ej__shawl" />
                <path d="M-17 1 L-36 -20 M17 1 L38 -12" className="hr-ej__stocking" />
                <circle cx="-38" cy="-22" r="5.5" className="hr-fx__hand" />
                <path d="M36 -16 q6 -9 12 0" className="hr-ej__strap" />
                <rect x="33" y="-14" width="17" height="13" rx="3" className="hr-ej__dark" />
                <circle cx="2" cy="-46" r="8" className="hr-ej__bun" />
                <g transform="translate(-40.65 -48.39) scale(0.3387)"><circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} className="hr-butler__hair" /><path d={FACE} className="hr-butler__face" /></g>
              </g>
              {/* Un chat noir, toutes griffes dehors. */}
              <g className="hr-ej hr-ej--cat">
                <path d="M18 6 Q36 -8 28 -26" className="hr-ej__tail" />
                <path d="M-10 18 L-17 31 M3 20 L5 33 M14 16 L23 27" className="hr-ej__tail" />
                <ellipse cx="0" cy="8" rx="21" ry="13" />
                <path d="M-29 -12 L-27 -26 L-19 -15 Z M-14 -16 L-9 -27 L-7 -12 Z" />
                <circle cx="-18" cy="-6" r="11.5" />
                <circle cx="-22" cy="-7" r="3" className="hr-ej__eye" /><circle cx="-13" cy="-7" r="3" className="hr-ej__eye" />
              </g>
              {/* Un pigeon, plumes en l'air. */}
              <g className="hr-ej hr-ej--bird">
                <ellipse cx="0" cy="0" rx="17" ry="11.5" />
                <path d="M-6 -4 Q-2 -28 11 -8 Z" className="hr-ej__wing" />
                <circle cx="15" cy="-9" r="8" />
                <path d="M22 -10 L31 -7 L22 -4 Z" className="hr-ej__beak" />
                <circle cx="17" cy="-11" r="1.8" className="hr-ej__pupil" />
                <ellipse cx="-22" cy="-14" rx="3" ry="7" transform="rotate(-30 -22 -14)" className="hr-ej__wing" />
              </g>
              {/* Une chaussure. */}
              <g className="hr-ej"><path d="M-18 -8 h16 q20 0 22 12 q2 8 -10 8 h-28 z" className="hr-fx__shoe" /><path d="M-18 8 h28" className="hr-ej__strap" /></g>
              {/* Des bouffées qui filent, traînée de vitesse derrière. */}
              {[0, 1, 2].map((i) => (
                <g key={i} className="hr-ej">
                  <path d="M-18 -8 H-54 M-18 0 H-64 M-18 8 H-50" className="hr-ej__speed" />
                  <circle cx="-4" cy="4" r="13" className="hr-fx__puff" fill={`url(#${uid}-puff)`} />
                  <circle cx="10" cy="-4" r="15" className="hr-fx__puff" fill={`url(#${uid}-puff)`} />
                  <circle cx="4" cy="9" r="11" className="hr-fx__puff" fill={`url(#${uid}-puff)`} />
                </g>
              ))}
            </g>
            <g>{["BAM!", "POW!", "CLONK!"].map((w, i) => (
              <g key={w} className="hr-fx__word" data-alt={i % 2 || undefined}>
                <polygon points={burst} /><text y="9" textAnchor="middle">{w}</text>
              </g>
            ))}</g>
            <g>{Array.from({ length: 5 }, (_, i) => <polygon key={i} points={tiny} className="hr-fx__dizzy" />)}</g>
          </svg>
        </div>
      </div>
    </section>
  );
}
