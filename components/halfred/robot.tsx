"use client";

import { useEffect, useRef, useState } from "react";

// Scène de démonstration du composant « Spline Scene » (21st.dev) : un robot qui suit le pointeur.
const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
const ARMS = new Set(["arm", "elbow", "forearm", "Hand", "Hand LEFT"]);
// Couleurs de Halfred par pièce de la scène (tête et mains rouges comme le logo, le reste en smoking).
const RED = "#d22232", TUX = "#2a2a30";
const DRESS: Record<string, string> = {
  "Head 2": RED, Hand: RED, Body: TUX, Cube: "#1a1a1e", "Cylinder 3": "#1a1a1e",
  "Rectangle 2": TUX, "Rectangle 3": TUX, "Rectangle 4": TUX, "Cube 2": TUX, "Cube 3": TUX,
};

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
    type Starts = Map<{ name: string }, { disconnect: () => void }[]>;
    type Scene = {
      dispose: () => void;
      render: () => void;
      _renderer?: Loop;
      _eventManager?: { handlers?: { Start?: { eventsPerObject?: Starts } } };
    };
    let app = undefined as Scene | undefined;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gone = false;
    let loading = false;
    // Chargée une fois la section Contact à l'écran, puis mise en pause hors écran : la scène ne
    // consomme rien pendant qu'on lit le reste de la page.
    const io = new IntersectionObserver(async ([e]) => {
      if (app) { if (!still) app._renderer?.setAnimationLoop(e.isIntersecting ? app.render : null); return; }
      if (e.intersectionRatio < 0.3 || loading) return;
      loading = true;
      // Le chargement (scripts, scène, shaders) occupe le fil principal : on
      // attend que le défilement soit posé pour ne pas hacher un glissé.
      await new Promise<void>((done) => {
        let id = window.setTimeout(finish, 250);
        function finish() { removeEventListener("scroll", wait); done(); }
        function wait() { clearTimeout(id); id = window.setTimeout(finish, 250); }
        addEventListener("scroll", wait, { passive: true });
      });
      const { Application } = await import("@splinetool/runtime");
      if (gone) return;
      // WebGL classique : le pipeline WebGPU de Spline compile ses shaders au
      // premier rendu (gel de l'onglet, voire échec selon le pilote).
      const spline = new Application(cv, { renderer: "webgl" });
      await spline.load(SCENE);
      const scene = spline as unknown as Scene;
      app = scene;
      // Machine modeste : rendu à la résolution de base (pas de ×2 écran Retina).
      const lite = () => (scene as unknown as { _renderer?: { setPixelRatio?: (r: number) => void } })._renderer?.setPixelRatio?.(1);
      if ("lite" in document.documentElement.dataset) lite();
      else window.addEventListener("hr-lite", lite, { once: true });
      // Habillé en Halfred : tête et mains rouges, smoking anthracite. Les
      // jambes, coupées à l'écran, ne sont plus rendues. Le squelette et les
      // noms des pièces ne changent pas : le suivi du pointeur reste intact.
      for (const o of spline.getAllObjects() as unknown as { name: string; color: string; visible: boolean }[]) {
        const paint = DRESS[o.name];
        if (paint) o.color = paint;
        if (o.name === "Bottom" || o.name === "Pelvic") o.visible = false;
      }
      // Les bras restent baissés : on débranche l'animation d'ouverture qui les
      // lève en boucle. La tête suit toujours le pointeur (même API interne).
      for (const [part, events] of scene._eventManager?.handlers?.Start?.eventsPerObject ?? []) {
        if (ARMS.has(part.name)) events.forEach((ev) => ev.disconnect());
      }
      // La scène ouvre sur un zoom de caméra : on ne la révèle qu'une fois posée.
      // Sous `prefers-reduced-motion`, la scène posée est figée : une image fixe.
      if (!gone) setTimeout(() => {
        if (gone) return;
        setReady(true);
        if (still) scene._renderer?.setAnimationLoop(null);
      }, 1800);
    }, { threshold: [0, 0.3] });
    io.observe(node);
    return () => { gone = true; io.disconnect(); app?.dispose(); };
  }, []);

  return (
    <div ref={box} className="hr-robot" data-ready={ready || undefined} aria-hidden>
      <canvas ref={canvas} />
    </div>
  );
}
