"use client";

import { useEffect } from "react";

/**
 * Lance l'ouverture en éclipse du hero (`data-eclipse` sur la section) une fois
 * l'image décodée : l'animation ne démarre jamais sur une image encore absente.
 */
export default function EclipseStart() {
  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>(".hr-hero__art");
    const go = () => img?.closest("section")?.setAttribute("data-eclipse", "");
    img?.decode().then(go, go);
  }, []);
  return null;
}
