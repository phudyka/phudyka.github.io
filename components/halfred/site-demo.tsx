"use client";

import { useEffect, useRef, useState } from "react";

// Scène de démonstration du composant « Spline Scene » (21st.dev) : un robot qui suit le pointeur.
const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Encart d'aperçu pour la section Sites : une scène 3D interactive dans un cadre
 * noir, éclairé d'un halo rouge, pour montrer le niveau de finition possible.
 */
export default function SiteDemo({ label, hint }: { label: string; hint: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Le moteur Spline est lourd : importé seulement quand l'encart approche de l'écran.
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
    <div ref={box} className="hr-demo" data-ready={ready || undefined}>
      <div className="hr-demo__head">
        <span className="hr-demo__dot" aria-hidden />
        <span>{label}</span>
      </div>
      <div className="hr-demo__scene" aria-hidden>
        <canvas ref={canvas} />
      </div>
      <p className="hr-demo__hint">{hint}</p>
    </div>
  );
}
