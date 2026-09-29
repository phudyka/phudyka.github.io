import { Check } from "lucide-react";
import type { CSSProperties } from "react";

type Gain = { title: string; body: string; demo: ReadonlyArray<readonly string[]> };
const at = (i: number) => ({ "--i": i }) as CSSProperties;

// Mini-démos en CSS seul, en boucle, figées sur leur état final sous
// `prefers-reduced-motion` et en pause hors écran (`data-idle`, voir snap.tsx).
// Données fictives d'illustration.

/** Boîte de réception : chaque message reçoit son étiquette, l'un après l'autre. */
function Inbox({ rows }: { rows: Gain["demo"] }) {
  return (
    <ul className="hr-demo hr-demo--inbox">
      {rows.map(([label, tag], i) => (
        <li key={label} style={at(i)}>
          <span className="hr-demo__dot" />
          <span className="hr-demo__label">{label}</span>
          <span className="hr-demo__tag">{tag}</span>
        </li>
      ))}
    </ul>
  );
}

/** Suivi : chaque échéance se coche, avec son état. */
function Followups({ rows }: { rows: Gain["demo"] }) {
  return (
    <ul className="hr-demo hr-demo--tasks">
      {rows.map(([label, state], i) => (
        <li key={label} style={at(i)}>
          <span className="hr-demo__check"><Check className="size-3" strokeWidth={3} /></span>
          <span className="hr-demo__label">{label}</span>
          <span className="hr-demo__state">{state}</span>
        </li>
      ))}
    </ul>
  );
}

/** Liaison : un e-mail part vers le tableur, la ligne se remplit case par case. */
function Sync({ rows }: { rows: Gain["demo"] }) {
  const [[from, to], head, line] = rows;
  return (
    <div className="hr-demo hr-demo--sync">
      <div className="hr-demo__mail">
        <span className="hr-demo__app">{from}</span>
        <span className="hr-demo__bar" />
        <span className="hr-demo__bar hr-demo__bar--short" />
        <span className="hr-demo__bar" />
      </div>
      <span className="hr-demo__wire"><span /></span>
      <div className="hr-demo__sheet">
        <span className="hr-demo__app">{to}</span>
        <div className="hr-demo__grid">
          {head.map((h) => <span key={h} className="hr-demo__th">{h}</span>)}
          {line.map((c, i) => <span key={c} className="hr-demo__td" style={at(i)}><span>{c}</span></span>)}
        </div>
      </div>
    </div>
  );
}

const DEMOS = [Inbox, Followups, Sync];

/**
 * À quoi sert l'automatisation, en trois cartes : en haut une mini-démo qui
 * montre la chose en marche, dessous un titre court et le concret. Pose les
 * bases avant le schéma animé de la section suivante.
 */
export default function Gains({ items }: { items: readonly Gain[] }) {
  return (
    <ul className="hr-gains">
      {items.map(({ title, body, demo }, i) => {
        const Demo = DEMOS[i % DEMOS.length];
        return (
          <li key={title} className="hr-gain">
            <div className="hr-gain__stage" aria-hidden><Demo rows={demo} /></div>
            <h3 className="hr-gain__title">{title}</h3>
            <p className="hr-gain__body">{body}</p>
          </li>
        );
      })}
    </ul>
  );
}
