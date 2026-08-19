"use client";

import { useEffect, useState } from "react";

/**
 * Une media query lue en JavaScript.
 *
 * La feuille de style ne peut rien contre une animation créée par WAAPI
 * (`element.animate`) ni contre un ressort `motion` : `animation-duration: 0`
 * n’a aucune prise sur ces couches. Tout composant qui anime en JS doit donc
 * lire la préférence ici, sans quoi « `prefers-reduced-motion` est porté par la
 * CSS » devient une promesse d’accessibilité non tenue.
 *
 * Rend `false` au premier rendu — le serveur n’a pas de fenêtre — puis la
 * valeur réelle après montage, et suit les changements de préférence.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) =>
      setMatches(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

/** Le visiteur a demandé moins de mouvement. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Un vrai pointeur, capable de survol : souris ou trackpad, pas un doigt. */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
