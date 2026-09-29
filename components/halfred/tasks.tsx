"use client";

import { BellRing, CalendarDays, ChartColumn, FileText, type LucideIcon, Mail, Table2 } from "lucide-react";

type Rows = ReadonlyArray<readonly string[]>;
const rate = (el: HTMLElement, r: number) => el.getAnimations({ subtree: true }).forEach((a) => a.updatePlaybackRate(r));

const TASK_ICONS: readonly LucideIcon[] = [Mail, FileText, BellRing, CalendarDays, Table2, ChartColumn];

/**
 * Tâches qui tournent seules, en deux rangées qui défilent en sens contraire
 * (d'après Magic UI « Marquee »), en CSS : chaque rangée
 * est doublée pour boucler sans raccord. Au survol, le défilement ralentit
 * sans s'arrêter (vitesse de lecture des animations, sans saut).
 */
export default function Tasks({ rows }: { rows: Rows }) {
  const half = Math.ceil(rows.length / 2);
  const lines = [rows.slice(0, half), rows.slice(half)];
  return (
    <div className="hr-marquee" onPointerEnter={(e) => rate(e.currentTarget, 0.3)} onPointerLeave={(e) => rate(e.currentTarget, 1)}>
      {lines.map((line, r) => (
        <div key={r} className="hr-marquee__row" data-reverse={r % 2 || undefined}>
          {[0, 1].map((copy) => (
            <ul key={copy} className="hr-marquee__track" aria-hidden={copy === 1 || undefined}>
              {line.map(([task, when], j) => {
                const Icon = TASK_ICONS[(r * half + j) % TASK_ICONS.length];
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

