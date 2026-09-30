"use client";

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Price } from "@/components/halfred/steps";
import type { Offer } from "@/data/content";

export type Kind = {
  offer: Offer;
  body: string;
  points: readonly string[];
  shot: { src: string; label: string; icon: string | null };
};

// Chaque formule reste le temps que la barre rouge de l’onglet se remplisse (9 s).
const SHOT_MS = 9000;

/**
 * Trois formules (vitrine, marchand, application) qui tournent seules : le
 * texte, le prix et la capture changent ensemble. Un clic choisit une
 * formule ; le survol ne l'arrête pas (la barre de l'onglet continue).
 *
 * Rien ne bouge à gauche : chaque texte variable empile ses trois versions
 * dans la même case de grille (`swap`), qui prend la hauteur de la plus
 * longue ; seule la version active est visible. À droite, la fenêtre du
 * navigateur est posée sur l'écran d'un iMac (`Mac`), sur une surface éclairée.
 */
export default function SiteKinds(
  { intro, refs, kinds, vat }: { intro: ReactNode; refs: ReactNode; kinds: readonly Kind[]; vat: string },
) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((active + 1) % kinds.length), SHOT_MS);
    return () => clearTimeout(id);
  }, [active, visible, kinds]);

  // Curseur de l'écran (d'après Magic UI « Smooth Cursor », allégé) : sur
  // l'écran de l'iMac, la flèche système laisse place à une flèche à l'échelle
  // de la fenêtre, qui suit la souris avec un léger retard et s'incline à peine
  // dans le sens du mouvement. Souris seulement ; direct sous mouvement réduit.
  const shot = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = shot.current, cur = cursor.current;
    if (!el || !cur) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = { x: 0, y: 0, tx: 0, ty: 0, r: 0, raf: 0, on: false };
    const step = () => {
      const k = still ? 1 : 0.3;
      const dx = (m.tx - m.x) * k, dy = (m.ty - m.y) * k;
      m.x += dx;
      m.y += dy;
      m.r += (Math.max(-12, Math.min(12, dx * 0.8)) - m.r) * 0.2;
      cur.style.transform = `translate(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px) rotate(${m.r.toFixed(1)}deg)`;
      m.raf = m.on || Math.abs(dx) + Math.abs(dy) > 0.1 ? requestAnimationFrame(step) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      m.tx = e.clientX - r.left;
      m.ty = e.clientY - r.top;
      if (!m.on) { m.on = true; m.x = m.tx; m.y = m.ty; el.dataset.cursor = ""; }
      if (!m.raf) m.raf = requestAnimationFrame(step);
    };
    const leave = () => { m.on = false; delete el.dataset.cursor; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); cancelAnimationFrame(m.raf); };
  }, []);

  // La molette (via `Snap`) passe d'abord d'un onglet à l'autre, puis la page glisse.
  const current = useRef(0);
  current.current = active;
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const onStep = (e: Event) => {
      const next = current.current + (e as CustomEvent<number>).detail;
      if (next < 0 || next >= kinds.length) return;
      e.preventDefault();
      setActive(next);
    };
    node.addEventListener("hr-step", onStep);
    return () => node.removeEventListener("hr-step", onStep);
  }, [kinds.length]);

  // Fond de l'onglet actif : une seule pièce qui glisse d'un onglet à l'autre.
  const tabs = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const list = tabs.current;
    if (!list) return;
    const place = () => {
      const tab = list.querySelectorAll<HTMLElement>(".hr-kinds__tab")[active];
      if (tab) setPill({ x: tab.offsetLeft, w: tab.offsetWidth });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  const swap = (render: (k: Kind) => ReactNode) => (
    <div className="hr-swap">
      {kinds.map((k, i) => (
        <div key={k.offer.id} data-on={i === active || undefined} aria-hidden={i !== active}>{render(k)}</div>
      ))}
    </div>
  );

  return (
    <div ref={root} className="hr-kinds" data-wheel="">
      <div className="hr-kinds__text">
        {intro}
        <div className="hr-kinds__detail" role="tabpanel">
          {swap((k) => <p className="hr-kinds__body">{k.body}</p>)}
          <ul className="hr-kinds__points">
            {kinds[0].points.map((_, i) => (
              <li key={i}>
                <span className="num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                {swap((k) => k.points[i])}
              </li>
            ))}
          </ul>
        </div>
        <div className="hr-local__price hr-kinds__price">
          {swap((k) => (
            <>
              <Price value={k.offer.price} />
              <p className="text-sm text-muted-foreground">{k.offer.note ?? " "}</p>
            </>
          ))}
          <p className="hr-steps__vat mt-1">{vat}</p>
        </div>
      </div>

      <div className="hr-kinds__stage">
        <div className="hr-mac">
          <Mac />
          <figure ref={shot} className="hr-shot">
            {/* Barre de navigateur : les trois formules sont ses onglets. */}
            <div className="hr-shot__bar">
              <span className="hr-shot__dots" aria-hidden><span /><span /><span /></span>
              <div ref={tabs} className="hr-kinds__tabs" role="tablist">
                <span className="hr-kinds__pill" aria-hidden style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
                {kinds.map((k, i) => (
                  <button
                    key={k.offer.id}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    className="hr-kinds__tab"
                    data-on={i === active || undefined}
                    data-run={i === active && visible ? "" : undefined}
                    onClick={() => setActive(i)}
                  >
                    {k.shot.icon
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={k.shot.icon} alt="" className="hr-kinds__icon" />
                      : <span className="hr-kinds__icon" aria-hidden>{k.shot.label[0]}</span>}
                    <span className="hr-kinds__label">{k.offer.name}</span>
                    <span className="hr-kinds__close" aria-hidden>×</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="hr-shot__view" aria-hidden>
              {kinds.map((k, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={k.shot.src} src={k.shot.src} alt="" loading="lazy" decoding="async" data-on={i === active || undefined} />
              ))}
            </div>
            <figcaption className="sr-only">{kinds[active].shot.label}</figcaption>
            <span ref={cursor} className="hr-shot__cursor" aria-hidden>
              <svg viewBox="0 0 24 26"><path d="M3 2.2 20.6 11.4c.9.5.8 1.8-.2 2.1l-7.3 2.2-3.4 7c-.4.9-1.8.8-2.1-.2L2.1 3.4c-.2-.8.5-1.5 1.2-1.2Z" /></svg>
            </span>
          </figure>
        </div>
        {refs}
      </div>
    </div>
  );
}

/**
 * iMac en noir sidéral (d'après un mock SVG libre, recoloré) : l'écran est
 * laissé noir, la fenêtre HTML se pose dessus (coordonnées reprises en % dans
 * `.hr-mac .hr-shot`). Décoratif.
 */
function Mac() {
  return (
    <svg className="hr-mac__svg" viewBox="0 0 600 491.3" fill="none" aria-hidden>
      <defs>
        <linearGradient id="hr-mac-stand" x1="300" y1="484.69" x2="300" y2="401.32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#141518" />
          <stop offset=".12" stopColor="#2c2e33" />
          <stop offset=".45" stopColor="#35373c" />
          <stop offset=".75" stopColor="#2f3136" />
          <stop offset="1" stopColor="#1c1d21" />
        </linearGradient>
        <linearGradient id="hr-mac-body" x1="0" y1="10" x2="0" y2="344" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2b2d31" />
          <stop offset="1" stopColor="#1e1f23" />
        </linearGradient>
        <linearGradient id="hr-mac-chin" x1="0" y1="344" x2="0" y2="402" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#34363b" />
          <stop offset="1" stopColor="#26282c" />
        </linearGradient>
        {/* Aluminium anodisé : grain très fin (bruit désaturé) et reflets doux. */}
        <filter id="hr-mac-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.16" /></feComponentTransfer>
        </filter>
        <linearGradient id="hr-mac-sheen" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".015" />
          <stop offset="1" stopColor="#fff" stopOpacity=".04" />
        </linearGradient>
        <linearGradient id="hr-mac-stand-sheen" x1="232.4" y1="0" x2="367.6" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity=".35" />
          <stop offset=".3" stopColor="#fff" stopOpacity=".06" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".02" />
          <stop offset="1" stopColor="#000" stopOpacity=".35" />
        </linearGradient>
        <clipPath id="hr-mac-shell">
          <path d="M23.83,10.99h552.03c4.92,0,8.91,3.99,8.91,8.91v324.18H14.92V19.9c0-4.92,3.99-8.91,8.91-8.91Z" />
          <path d="M14.92,343.94h570.85v48.47c0,4.92-3.99,8.91-8.91,8.91H23.83c-4.92,0-8.91-3.99-8.91-8.91Z" />
          <rect x="232.4" y="401.32" width="135.19" height="89" />
        </clipPath>
      </defs>
      <rect fill="url(#hr-mac-stand)" x="232.4" y="401.32" width="135.19" height="83.37" />
      <rect fill="url(#hr-mac-stand-sheen)" x="232.4" y="401.32" width="135.19" height="83.37" />
      {/* Socle vu d'un peu au-dessus : face supérieure en trapèze, puis la tranche. */}
      <path fill="#303237" d="M234.2,484.2h131.6l5.2,4.3H229Z" />
      <rect fill="#1f2024" x="229" y="488.5" width="142" height="1.9" />
      <path fill="url(#hr-mac-body)" d="M23.83,10.99h552.03c4.92,0,8.91,3.99,8.91,8.91v324.18H14.92V19.9c0-4.92,3.99-8.91,8.91-8.91Z" />
      <path fill="url(#hr-mac-chin)" d="M14.92,343.94h570.85v48.47c0,4.92-3.99,8.91-8.91,8.91H23.83c-4.92,0-8.91-3.99-8.91-8.91Z" />
      <path fill="url(#hr-mac-sheen)" d="M14.92,343.94h570.85v48.47c0,4.92-3.99,8.91-8.91,8.91H23.83c-4.92,0-8.91-3.99-8.91-8.91Z" />
      <g clipPath="url(#hr-mac-shell)"><rect width="600" height="491.3" filter="url(#hr-mac-grain)" /></g>
      {/* Joint entre le boîtier et le menton. */}
      <path d="M14.92,344.2h570.85" stroke="rgb(0 0 0 / 0.45)" strokeWidth=".6" />
      {/* Liseré de lumière sur l'arête haute et les flancs du boîtier. */}
      <path d="M15.4,344V19.9c0-4.6,3.8-8.4,8.4-8.4h552c4.6,0,8.4,3.8,8.4,8.4V344" stroke="rgb(255 255 255 / 0.14)" strokeWidth=".8" />
      <rect fill="#070708" x="28.78" y="24.68" width="542.44" height="305.74" rx=".8" />
      <circle fill="#0c0c0e" cx="300" cy="17.7" r="2.11" />
      <circle fill="#1b1d2e" cx="300" cy="17.7" r=".85" />
    </svg>
  );
}
