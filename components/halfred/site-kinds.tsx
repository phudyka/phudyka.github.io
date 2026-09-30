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
    <div ref={root} className="hr-kinds">
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
          <figure className="hr-shot">
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
    <svg className="hr-mac__svg" viewBox="0 0 600 492" fill="none" aria-hidden>
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
      </defs>
      <rect fill="url(#hr-mac-stand)" x="232.4" y="401.32" width="135.19" height="83.37" />
      <rect fill="#2a2c30" x="232.4" y="484.69" width="135.19" height="5.61" />
      <rect fill="#1a1b1e" x="234.32" y="489.39" width="17.21" height="1.9" rx=".15" />
      <rect fill="#1a1b1e" x="348.45" y="489.39" width="17.21" height="1.9" rx=".15" />
      <path fill="url(#hr-mac-body)" d="M23.83,10.99h552.03c4.92,0,8.91,3.99,8.91,8.91v324.18H14.92V19.9c0-4.92,3.99-8.91,8.91-8.91Z" />
      <path fill="url(#hr-mac-chin)" d="M14.92,343.94h570.85v48.47c0,4.92-3.99,8.91-8.91,8.91H23.83c-4.92,0-8.91-3.99-8.91-8.91Z" />
      {/* Liseré de lumière sur l'arête haute et les flancs du boîtier. */}
      <path d="M15.4,344V19.9c0-4.6,3.8-8.4,8.4-8.4h552c4.6,0,8.4,3.8,8.4,8.4V344" stroke="rgb(255 255 255 / 0.14)" strokeWidth=".8" />
      <rect fill="#070708" x="28.78" y="24.68" width="542.44" height="305.74" rx=".8" />
      <circle fill="#0c0c0e" cx="300" cy="17.7" r="2.11" />
      <circle fill="#1b1d2e" cx="300" cy="17.7" r=".85" />
    </svg>
  );
}
