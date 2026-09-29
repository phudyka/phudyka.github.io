import { BellRing, CalendarDays, ChartColumn, FileText, type LucideIcon, Mail, Table2 } from "lucide-react";
import LiveSheet from "@/components/halfred/live-sheet";
import NotifList from "@/components/halfred/notif-list";

type Gain = { title: string; body: string; demo: ReadonlyArray<readonly string[]> };

// Mini-démos en boucle, figées sur leur état final sous
// `prefers-reduced-motion` et en pause hors écran (`data-idle`, voir snap.tsx).
// Données fictives d'illustration.

const TASK_ICONS: readonly LucideIcon[] = [Mail, FileText, BellRing, CalendarDays, Table2, ChartColumn];

/**
 * Tâches qui tournent seules, en deux rangées qui défilent en sens contraire
 * (d'après Magic UI « Marquee »), en pause au survol. CSS seul : chaque rangée
 * est doublée pour boucler sans raccord.
 */
function Tasks({ rows }: { rows: Gain["demo"] }) {
  const half = Math.ceil(rows.length / 2);
  const lines = [rows.slice(0, half), rows.slice(half)];
  return (
    <div className="hr-marquee">
      {lines.map((line, r) => (
        <div key={r} className="hr-marquee__row" data-reverse={r % 2 || undefined}>
          {[0, 1].map((copy) => (
            <ul key={copy} className="hr-marquee__track" aria-hidden={copy === 1 || undefined}>
              {line.map(([task, when]) => {
                const Icon = TASK_ICONS[rows.findIndex((row) => row[0] === task) % TASK_ICONS.length];
                return (
                  <li key={task} className="hr-task">
                    <span className="hr-task__icon"><Icon className="size-4" strokeWidth={1.8} /></span>
                    <span className="hr-task__text">
                      <span className="hr-task__name">{task}</span>
                      <span className="hr-task__when">{when}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}

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
