import type { ReactNode } from "react";

/**
 * Primitives du monde Halfred, coupées selon la règle de la moitié. Des `<a>`
 * simples : toutes les cibles sont des ancres de la page ou des routes
 * statiques.
 */
type ButtonProps = { href: string; children: ReactNode; small?: boolean };

/** Moitié gauche rouge, moitié droite noire, texte à cheval. */
export function HalfButton({ href, children, small }: ButtonProps) {
  return (
    <a href={href} className={`hr-btn hr-btn--half${small ? " hr-btn--sm" : ""}`}>
      {children}
    </a>
  );
}

/** Fond blanc, liseré rouge en bas. */
export function LightButton({ href, children, small }: ButtonProps) {
  return (
    <a href={href} className={`hr-btn hr-btn--light${small ? " hr-btn--sm" : ""}`}>
      {children}
    </a>
  );
}

/** Pastille rouge à gauche, libellé sur graphite. */
export function HalfBadge({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <span className="hr-badge">
      <span className="hr-badge__tag">{tag}</span>
      {children}
    </span>
  );
}
