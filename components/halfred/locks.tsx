"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

/**
 * Les trois garde-fous, chacun avec un loquet : quand la liste arrive à
 * l'écran, les loquets se ferment l'un après l'autre ; chacun se bascule aussi
 * à la main. Déclenché par un
 * IntersectionObserver plutôt que par le scroll, pour rejouer proprement à
 * chaque arrivée même quand la page se cale sur la section. Sous
 * `prefers-reduced-motion`, les verrous sont fermés d'emblée.
 */
export default function Locks({ items, label }: { items: readonly string[]; label: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const [armed, setArmed] = useState(false);
  // Loquets basculés à la main : ils ne suivent plus l'enclenchement automatique.
  const [manual, setManual] = useState<Record<number, boolean>>({});
  const uid = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setArmed(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className="hr-locks" data-armed={armed || undefined} aria-label={label}>
      {items.map((line, i) => (
        <li
          key={line}
          className="hr-lock"
          data-on={(manual[i] ?? armed) || undefined}
          data-manual={i in manual || undefined}
          style={{ "--i": i } as CSSProperties}
        >
          <span className="num hr-lock__num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
          <span id={`${uid}-${i}`} className="hr-lock__text">{line}</span>
          <button
            type="button"
            role="switch"
            aria-checked={manual[i] ?? armed}
            aria-labelledby={`${uid}-${i}`}
            className="hr-lock__latch"
            onClick={() => setManual((m) => ({ ...m, [i]: !(m[i] ?? armed) }))}
          />
        </li>
      ))}
    </ol>
  );
}
