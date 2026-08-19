"use client";

import { useEffect, useRef, useState } from "react";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";

const CELL = 40;

/**
 * Les deux marges de la page. La colonne de lecture fait 42 rem : au-delà,
 * l’espace restant de chaque côté reçoit une grille qui s’allume au passage du
 * curseur. Elle n’apparaît qu’à partir de `lg`, quand cet espace existe
 * vraiment, et reste derrière le contenu (`-z-10`) : le texte ne la touche
 * jamais, elle n’intercepte donc aucun clic utile.
 *
 * La grille est taillée à la mesure de sa marge — un nombre entier de cases,
 * arrondi vers le bas. Une grille dessinée plus large et coupée au débordement
 * reviendrait au même à l’œil, mais laisserait des centaines de rectangles hors
 * cadre : autant de nœuds à animer pour rien, et un débordement que l’audit
 * signale à juste titre.
 */
function Panel({ side }: { side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<[number, number] | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = () => {
      const { width, height } = node.getBoundingClientRect();
      const columns = Math.floor(width / CELL);
      const rows = Math.floor(height / CELL);
      setGrid(columns > 0 && rows > 0 ? [columns, rows] : null);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Classes écrites en entier : Tailwind lit le source tel quel, une classe
  // recomposée à l’exécution ne serait jamais générée.
  const strip = side === "left"
    ? "right-0 [mask-image:linear-gradient(to_left,transparent,black_55%)]"
    : "left-0 [mask-image:linear-gradient(to_right,transparent,black_55%)]";

  return (
    <div
      ref={ref}
      className={`pointer-events-auto absolute inset-y-0 ${
        side === "left" ? "left-0" : "right-0"
      } w-[calc((100vw-46rem)/2)] overflow-hidden`}
    >
      {grid
        ? (
          <div
            className={`absolute top-0 ${strip}`}
            style={{ width: grid[0] * CELL, height: grid[1] * CELL }}
          >
            <InteractiveGridPattern
              width={CELL}
              height={CELL}
              squares={grid}
            />
          </div>
        )
        : null}
    </div>
  );
}

export default function SideGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden lg:block"
    >
      <Panel side="left" />
      <Panel side="right" />
    </div>
  );
}
