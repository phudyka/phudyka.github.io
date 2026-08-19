"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Titre dont chaque caractère bascule dans l’espace pour venir se poser.
 * Source : magicuidesign/magicui — `registry/magicui/text-3d-flip.tsx`.
 *
 * Écarts locaux :
 *
 * 1. Aucune dépendance d’animation. La version amont pilote un ressort `motion`
 *    par caractère ; ici l’animation est une `@keyframes` CSS (globals.css) et
 *    le composant se contente de poser l’axe et le retard de chaque lettre en
 *    variables. C’est la même grammaire que `blur-fade.tsx` : le composant
 *    décide du moment, la feuille de style porte le mouvement — et donc aussi
 *    le respect de `prefers-reduced-motion`, sans lecture JS.
 * 2. La prop `transition` (config de ressort) disparaît avec le ressort : le
 *    profil est une courbe de Bézier unique, réglable par `duration`.
 * 3. Le texte visible est `aria-hidden`, une doublure `sr-only` porte le nom
 *    accessible — un titre découpé en caractères se lit lettre par lettre par
 *    les lecteurs d’écran.
 */
type Props = {
  children: string;
  className?: string;
  /** Axe et sens de la bascule d’entrée. */
  rotateDirection?: "top" | "bottom" | "left" | "right";
  /** Décalage d’une lettre à la suivante, en secondes. */
  staggerDuration?: number;
  /** Point de départ de l’échelonnement. */
  staggerFrom?: "first" | "last" | "center";
  /** Durée de la bascule d’une lettre, en secondes. */
  duration?: number;
};

const AXIS = {
  top: { from: "rotateX(90deg)", origin: "center top" },
  bottom: { from: "rotateX(-90deg)", origin: "center bottom" },
  left: { from: "rotateY(-90deg)", origin: "left center" },
  right: { from: "rotateY(90deg)", origin: "right center" },
} as const;

function stagger(index: number, total: number, from: Props["staggerFrom"]) {
  if (from === "last") return total - 1 - index;
  if (from === "center") return Math.abs(index - (total - 1) / 2);
  return index;
}

export function Text3DFlip({
  children,
  className,
  rotateDirection = "top",
  staggerDuration = 0.03,
  staggerFrom = "first",
  duration = 0.55,
}: Props) {
  const letters = [...children];
  const axis = AXIS[rotateDirection];

  return (
    <span
      className={cn(
        "text-3d inline-flex flex-wrap [perspective:900px]",
        className,
      )}
    >
      <span className="sr-only">{children}</span>
      {letters.map((char, index) => (
        <span
          key={index}
          aria-hidden
          className="text-3d-letter inline-block"
          style={{
            "--t3d-from": axis.from,
            "--t3d-origin": axis.origin,
            "--t3d-duration": `${duration}s`,
            "--t3d-delay": `${
              stagger(index, letters.length, staggerFrom) * staggerDuration
            }s`,
          } as CSSProperties}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default Text3DFlip;
