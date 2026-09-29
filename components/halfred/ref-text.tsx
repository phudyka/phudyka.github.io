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
        const card = (
          <span className="hr-ref__card" role="tooltip">
            {shot ? <img src={shot} alt="" loading="lazy" decoding="async" /> : null}
            <span className="hr-ref__name">{part.name}</span>
            <span className="hr-ref__desc">{part.desc}</span>
          </span>
        );
        return part.href
          ? <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className="hr-ref">{part.name}{card}</a>
          : <span key={i} tabIndex={0} className="hr-ref">{part.name}{card}</span>;
      })}
    </p>
  );
}
