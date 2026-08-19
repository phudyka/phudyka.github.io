"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Titre qui se pose caractère par caractère, chaque lettre passant par un 0 ou
 * un 1 avant de se fixer.
 * Source : kokonut-labs/kokonutui — `matrix-text.tsx` (Dorian Baffier, MIT).
 *
 * Trois écarts locaux :
 *
 * 1. Le vert `#00ff00` d’origine est remplacé par l’orange porteur du site.
 *    C’est la seule couleur d’accent du contrat de direction ; un second accent
 *    littéral, sur le titre de la page qui porte les prix, aurait été le
 *    quatrième signalé par la critique.
 * 2. `motion/react` est retiré. La transition n’est qu’un changement de couleur
 *    sur onze nœuds : une `transition` CSS la porte (voir `.matrix-letter` dans
 *    globals.css) sans instancier onze composants animés.
 * 3. `prefers-reduced-motion` court-circuite l’effet — le texte final est déjà
 *    dans le DOM au premier rendu, il suffit de ne pas le brouiller. Le nom
 *    accessible ne dépend jamais de l’animation : les lettres visibles sont
 *    `aria-hidden`, une doublure `sr-only` porte le texte.
 */
type Props = {
  text: string;
  className?: string;
  /** Attente avant la première lettre, en millisecondes. */
  initialDelay?: number;
  /** Temps passé en 0/1 par chaque lettre, en millisecondes. */
  letterAnimationDuration?: number;
  /** Décalage d’une lettre à la suivante, en millisecondes. */
  letterInterval?: number;
};

export function MatrixText({
  text,
  className,
  initialDelay = 200,
  letterAnimationDuration = 500,
  letterInterval = 100,
}: Props) {
  const reduced = useReducedMotion();
  const [scrambled, setScrambled] = useState<Record<number, string>>({});

  useEffect(() => {
    if (reduced) return;

    const timers: number[] = [];

    [...text].forEach((char, index) => {
      if (char === " ") return;

      timers.push(
        window.setTimeout(() => {
          setScrambled((prev) => ({
            ...prev,
            // Math.random n’est appelé qu’après montage : le rendu serveur et
            // le premier rendu client montrent tous deux le texte final.
            [index]: Math.random() > 0.5 ? "1" : "0",
          }));

          timers.push(
            window.setTimeout(() => {
              setScrambled((prev) => {
                const next = { ...prev };
                delete next[index];
                return next;
              });
            }, letterAnimationDuration),
          );
        }, initialDelay + index * letterInterval),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [reduced, text, initialDelay, letterInterval, letterAnimationDuration]);

  return (
    <span className={cn("matrix-text inline-flex font-mono", className)}>
      <span className="sr-only">{text}</span>
      {[...text].map((char, index) => (
        <span
          // La position est la seule identité stable d’une lettre : la re-clé
          // sur le caractère remonterait le nœud à chaque bascule.
          key={index}
          aria-hidden
          data-matrix={scrambled[index] === undefined ? undefined : ""}
          className="matrix-letter inline-block w-[1ch] text-center tabular-nums"
        >
          {scrambled[index] ?? (char === " " ? " " : char)}
        </span>
      ))}
    </span>
  );
}

export default MatrixText;
