import React from "react";

import { cn } from "@/lib/utils";

type KineticTextProps = React.HTMLAttributes<HTMLElement> & {
  text: string;
};

/**
 * Chaque lettre est un nœud propre : survolée, elle s’épaissit et pousse ses
 * voisines. Source : magicuidesign/magicui — `registry/magicui/kinetic-text.tsx`.
 *
 * Deux écarts locaux. Les classes utilitaires — sept cents caractères répétés à
 * l’identique sur chaque lettre — sont remplacées par `.kinetic-letter`, une
 * classe unique définie dans `globals.css` ; le balisage passe de 7,6 Ko à
 * quelques centaines d’octets pour le même effet. Et l’unité de retour à la
 * ligne est le mot, pas la lettre : un conteneur `flex` place chaque lettre en
 * élément flex, donc une chaîne plus longue que sa colonne se couperait au
 * milieu d’un mot.
 */
export function KineticText({
  text,
  className = "",
  ...rest
}: KineticTextProps) {
  return (
    <h1 {...rest} className={cn("kinetic flex flex-wrap", className)}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="flex whitespace-pre">
          {wordIndex > 0
            ? <span aria-hidden className="kinetic-letter"></span>
            : null}
          {Array.from(word).map((letter, index) => (
            <span key={index} aria-hidden className="kinetic-letter">
              {letter}
            </span>
          ))}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </h1>
  );
}
