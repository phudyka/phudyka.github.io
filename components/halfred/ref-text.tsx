import { halfredImage } from "@/components/halfred/asset";
import type { RefPart } from "@/data/content";

/**
 * Phrase de réalisations : chaque nom est souligné du trait moitié rouge
 * moitié blanc ; au survol ou au focus, un aperçu (capture, nom, une ligne)
 * s'ouvre au-dessus. CSS seul. Avec `href`, le nom est un lien.
 */
export default function RefText({ parts, className }: { parts: readonly RefPart[]; className?: string }) {
  return (
    <p className={`hr-refs ${className ?? ""}`}>
      {parts.map((part, i) => {
        if (typeof part === "string") return part;
        const shot = part.shot ? halfredImage(`site-${part.shot}.webp`) : null;
        // L'aperçu est caché aux lecteurs d'écran : sa ligne est lue une fois,
        // comme description du nom, sans répéter le nom.
        const id = `ref-${part.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        const card = (
          <span className="hr-ref__card" aria-hidden>
            {shot ? <img src={shot} alt="" loading="lazy" decoding="async" /> : null}
            <span className="hr-ref__name">{part.name}</span>
            <span id={id} className="hr-ref__desc">{part.desc}</span>
          </span>
        );
        const Tag = part.href ? "a" : "span";
        const link = part.href ? { href: part.href, target: "_blank", rel: "noopener noreferrer" } : { tabIndex: 0 };
        return <Tag key={i} {...link} aria-describedby={id} className="hr-ref">{part.name}{card}</Tag>;
      })}
    </p>
  );
}
