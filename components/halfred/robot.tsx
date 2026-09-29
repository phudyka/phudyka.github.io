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
    let app: { dispose: () => void } | undefined;
    let gone = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const { Application } = await import("@splinetool/runtime");
      if (gone) return;
      const spline = new Application(cv);
      app = spline;
      await spline.load(SCENE);
      if (!gone) setReady(true);
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
