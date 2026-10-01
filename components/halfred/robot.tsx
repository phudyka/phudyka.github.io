"use client";

import { useEffect, useRef, useState } from "react";

// Halfred en 3D (modélisé dans Blender, `design/halfred.blend`) : deux nœuds,
// la tête (pivot au centre, de profil au repos comme le logo) et le costume, textures cuites dans Cycles.
const MODEL = "/halfred/halfred.glb";
// Cadrage : tête et buste, regard vers le visiteur.
const LOOK = [-0.04, 1.97, 0] as const;
const EYE = [-0.04, 2.15, 7.4] as const;
// Débattement de la tête autour du regard de face (radians), douceur du geste,
// et délai sans mouvement avant de repasser de profil.
const TURN = 0.55, NOD = 0.25, EASE = 0.06, IDLE_MS = 2500;
// Apparition : le rendu passe d'une mosaïque de gros pixels à la pleine définition.
const MATERIALIZE_MS = 1100;
const STEPS = [0.03, 0.06, 0.12, 0.25, 0.5];

/**
 * Halfred en 3D, sans cadre, posé dans la section Contact. Chargé quand la
 * section arrive à l'écran, puis rendu seulement quand quelque chose bouge
 * (pointeur, redimensionnement) : aucune boucle de rendu au repos.
 */
export default function Robot() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = box.current;
    const cv = canvas.current;
    if (!node || !cv) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gone = false;
    let loading = false;
    let stop = () => {};

    const io = new IntersectionObserver(async ([e]) => {
      if (e.intersectionRatio < 0.3 || loading) return;
      loading = true;
      io.disconnect();
      // Chargement et compilation occupent le fil principal : on attend que le
      // défilement soit posé pour ne pas hacher un glissé.
      await new Promise<void>((done) => {
        let id = window.setTimeout(finish, 250);
        function finish() { removeEventListener("scroll", wait); done(); }
        function wait() { clearTimeout(id); id = window.setTimeout(finish, 250); }
        addEventListener("scroll", wait, { passive: true });
      });
      const [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/libs/meshopt_decoder.module.js"),
      ]);
      if (gone) return;

      const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: "low-power" });
      const dpr = () => Math.min(devicePixelRatio, "lite" in document.documentElement.dataset ? 1 : 2);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(...EYE); camera.lookAt(...LOOK);

      const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(MODEL);
      if (gone) { renderer.dispose(); return; }
      // Éclairage, ombres et reflets sont cuits dans les textures (Cycles) : aucun calcul de lumière ici.
      gltf.scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.material = new THREE.MeshBasicMaterial({ map: (o.material as import("three").MeshStandardMaterial).map });
      });
      scene.add(gltf.scene);
      const head = gltf.scene.getObjectByName("Head")!;
      const rest = head.rotation.clone();

      let ratio = dpr();
      const resize = () => {
        const w = node.clientWidth, h = node.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h; camera.updateProjectionMatrix();
        renderer.setPixelRatio(ratio); renderer.setSize(w, h, false);
        renderer.render(scene, camera);
      };

      // Au repos la tête est de profil (rotation du modèle). Quand le pointeur bouge, elle se
      // tourne vers lui (0 = face au visiteur) ; sans mouvement, elle revient de profil.
      const aim = { x: rest.y, y: rest.x };
      let raf = 0, idle = 0;
      const tick = () => {
        raf = 0;
        const dx = aim.x - head.rotation.y, dy = aim.y - head.rotation.x;
        head.rotation.y += dx * EASE; head.rotation.x += dy * EASE;
        renderer.render(scene, camera);
        if (Math.abs(dx) + Math.abs(dy) > 1e-3) raf = requestAnimationFrame(tick);
      };
      const look = (ev: PointerEvent) => {
        const r = cv.getBoundingClientRect();
        const nx = ((ev.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((ev.clientY - (r.top + r.height * 0.25)) / innerHeight) * 2;
        aim.x = Math.max(-1, Math.min(1, nx)) * TURN;
        aim.y = rest.x + Math.max(-1, Math.min(1, ny)) * NOD;
        if (!raf) raf = requestAnimationFrame(tick);
        clearTimeout(idle);
        idle = window.setTimeout(() => {
          aim.x = rest.y; aim.y = rest.x;
          if (!raf) raf = requestAnimationFrame(tick);
        }, IDLE_MS);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(node);
      if (!still) addEventListener("pointermove", look, { passive: true });

      // Matérialisation : la résolution monte par paliers, pixels nets (pas de flou).
      // Sous `prefers-reduced-motion` : image directe, fondu seul.
      if (!still) {
        cv.style.imageRendering = "pixelated";
        const t0 = performance.now();
        const grow = (t: number) => {
          if (gone) return;
          const k = (t - t0) / MATERIALIZE_MS;
          ratio = k < 1 ? STEPS[Math.floor(k * STEPS.length)] * dpr() : dpr();
          resize();
          if (k < 1) requestAnimationFrame(grow);
          else cv.style.imageRendering = "";
        };
        requestAnimationFrame(grow);
      } else resize();
      setReady(true);

      stop = () => {
        cancelAnimationFrame(raf);
        clearTimeout(idle);
        removeEventListener("pointermove", look);
        ro.disconnect();
        renderer.dispose();
      };
    }, { threshold: [0, 0.3] });
    io.observe(node);
    return () => { gone = true; io.disconnect(); stop(); };
  }, []);

  return (
    <div ref={box} className="hr-robot" data-ready={ready || undefined} aria-hidden>
      <canvas ref={canvas} />
    </div>
  );
}
