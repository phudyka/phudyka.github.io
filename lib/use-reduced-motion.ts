"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `prefers-reduced-motion` lu en JavaScript, et non depuis la feuille de style.
 *
 * La règle globale de `globals.css` neutralise les animations CSS, mais elle
 * n'a aucune prise sur deux couches introduites avec les composants Magic UI :
 * les ressorts de `motion` (dock, curseur), qui écrivent des styles inline
 * image par image, et les animations créées par `element.animate(...)`, qui
 * relèvent de l'API Web Animations et non de la propriété CSS `animation`.
 * Les composants concernés doivent donc décider eux-mêmes.
 *
 * Rend `false` au premier rendu serveur puis se corrige au montage : la valeur
 * n'existe pas avant d'avoir un `window`.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    setReduced(media.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Même lecture, hors cycle de rendu : pour un gestionnaire d'évènement. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}
