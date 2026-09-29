"use client";

import { CalendarClock, FileText, type LucideIcon, Receipt, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ICONS: readonly LucideIcon[] = [FileText, CalendarClock, Receipt, RefreshCw];
const EVERY_MS = 2200;
const SHOWN = 4;

/**
 * Notifications qui arrivent en haut de la pile et poussent les autres vers
 * le bas (d'après Magic UI « Animated List »), en boucle, en CSS : la nouvelle
 * s'ouvre en hauteur, la dernière sort sous le fondu. Arrêtée hors écran ;
 * sous `prefers-reduced-motion`, la pile est posée d'emblée, immobile.
 */
export default function NotifList({ rows }: { rows: ReadonlyArray<readonly string[]> }) {
  const box = useRef<HTMLUListElement>(null);
  // Numéros d'arrivée : le plus récent en tête ; la clé change à chaque arrivée.
  const [seq, setSeq] = useState<number[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeq([...Array(Math.min(SHOWN, rows.length)).keys()].reverse());
      return;
    }
    let timer = 0;
    let n = 0;
    const push = () => setSeq((s) => [n++, ...s].slice(0, SHOWN + 1));
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (!e.isIntersecting) return;
      // Premier passage : la pile arrive déjà garnie, la suite tombe une à une.
      if (!n) { n = SHOWN - 1; setSeq([...Array(SHOWN - 1).keys()].reverse()); }
      timer = window.setInterval(push, EVERY_MS);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [rows.length]);

  return (
    <ul ref={box} className="hr-notifs">
      {seq.map((k) => {
        const i = k % rows.length;
        const [title, detail, ago] = rows[i];
        const Icon = ICONS[i % ICONS.length];
        return (
          <li key={k}>
            <div className="hr-notif">
              <span className="hr-notif__icon"><Icon className="size-4" strokeWidth={1.8} /></span>
              <span className="hr-notif__text">
                <span className="hr-notif__title">{title}<span className="hr-notif__ago"> · {ago}</span></span>
                <span className="hr-notif__detail">{detail}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
