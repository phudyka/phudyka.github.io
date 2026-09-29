import type { ReactNode } from "react";

// Trois pictos dessinés pour l'occasion, chacun avec un seul mouvement :
// l'aiguille qui tourne (le temps), la cloche qui sonne (le rappel), le point
// qui passe d'un outil à l'autre (la liaison). Figés sous `prefers-reduced-motion`.
const ICONS: readonly ReactNode[] = [
  <svg key="time" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 12V7.5" />
    <path className="hr-gain__hand" d="M12 12h4" />
    <circle cx="12" cy="12" r="0.9" className="hr-gain__dot" />
  </svg>,
  <svg key="bell" viewBox="0 0 24 24" aria-hidden>
    <g className="hr-gain__bell">
      <path d="M6.5 16.5h11l-1.4-2V10a4.1 4.1 0 0 0-8.2 0v4.5z" />
      <path d="M10.4 19a1.7 1.7 0 0 0 3.2 0" />
    </g>
    <path className="hr-gain__wave" d="M4 7.5a8 8 0 0 1 2-3M20 7.5a8 8 0 0 0-2-3" />
  </svg>,
  <svg key="link" viewBox="0 0 24 24" aria-hidden>
    <rect x="2.5" y="8" width="6" height="8" rx="1.6" />
    <rect x="15.5" y="8" width="6" height="8" rx="1.6" />
    <path d="M8.5 12h7" strokeDasharray="1.2 1.6" />
    <circle className="hr-gain__packet hr-gain__dot" cx="9" cy="12" r="1.2" />
  </svg>,
];

/**
 * À quoi sert l'automatisation, en trois cartes : un picto qui bouge sur sa
 * trame, un titre court, le concret. Pose les bases avant le schéma animé de
 * la section suivante.
 */
export default function Gains({ items }: { items: ReadonlyArray<{ title: string; body: string }> }) {
  return (
    <ul className="hr-gains">
      {items.map(({ title, body }, i) => (
        <li key={title} className="hr-gain">
          <span className="hr-gain__icon"><span>{ICONS[i % ICONS.length]}</span></span>
          <h3 className="hr-gain__title">{title}</h3>
          <p className="hr-gain__body">{body}</p>
        </li>
      ))}
    </ul>
  );
}
