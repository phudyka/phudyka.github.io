"use client";

import { useEffect, useRef, useState } from "react";

// Scène de démonstration du composant « Spline Scene » (21st.dev) : un robot qui suit le pointeur.
const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Robot 3D interactif, sans cadre, posé dans la section Contact (la scène
 * s'arrête aux cuisses : le bas est fondu dans le noir). Le moteur
 * Spline est lourd : importé seulement quand la scène approche de l'écran,
 * puis révélé en fondu une fois chargé.
 */
export default function Robot() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = box.current;
    const cv = canvas.current;
    if (!node || !cv) return;
    // `stop()`/`play()` de Spline rejouent le zoom d'ouverture de la scène : on ne
    // coupe que la boucle de rendu (API interne, runtime épinglé dans package.json).
    type Loop = { setAnimationLoop: (f: (() => void) | null) => void };
    let app: { dispose: () => void; render: () => void; _renderer?: Loop } | undefined;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gone = false;
    let loading = false;
    // Chargée à l'approche, puis mise en pause hors écran : la scène ne
    // consomme rien pendant qu'on lit le reste de la page.
    const io = new IntersectionObserver(async ([e]) => {
      if (app) { if (!still) app._renderer?.setAnimationLoop(e.isIntersecting ? app.render : null); return; }
      if (!e.isIntersecting || loading) return;
      loading = true;
      const { Application } = await import("@splinetool/runtime");
      if (gone) return;
      const spline = new Application(cv);
      await spline.load(SCENE);
      app = spline as unknown as typeof app;
      // La scène ouvre sur un zoom de caméra : on ne la révèle qu'une fois posée.
      // Sous `prefers-reduced-motion`, la scène posée est figée : une image fixe.
      if (!gone) setTimeout(() => {
        if (gone) return;
        setReady(true);
        if (still) app?._renderer?.setAnimationLoop(null);
      }, 1800);
    }, { rootMargin: "400px" });
    io.observe(node);
    return () => { gone = true; io.disconnect(); app?.dispose(); };
  }, []);

  return (
    <div ref={box} className="hr-robot" data-ready={ready || undefined} aria-hidden>
      <canvas ref={canvas} />
    </div>
  );
}
