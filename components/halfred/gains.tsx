import LiveSheet from "@/components/halfred/live-sheet";
import Tasks from "@/components/halfred/tasks";
import NotifList from "@/components/halfred/notif-list";

type Gain = { title: string; body: string; demo: ReadonlyArray<readonly string[]> };

// Mini-démos en boucle, figées sur leur état final sous
// `prefers-reduced-motion` et en pause hors écran (`data-idle`, voir snap.tsx).
// Données fictives d'illustration.

const DEMOS = [Tasks, NotifList, LiveSheet];

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
