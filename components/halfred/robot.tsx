"use client";

import { useEffect, useRef, useState } from "react";

// Halfred en 3D (modélisé dans Blender, `design/halfred.blend`) : deux nœuds,
// la tête (pivot au centre, de profil au repos comme le logo) et le costume, textures cuites dans Cycles.
const MODEL = "/halfred/halfred.glb";
// Cadrage : le modèle entier, centré dans son cadre, avec cette marge autour (part de la hauteur).
const FOV = 26, MARGIN = 1.12;
// Débattement autour du regard de face (radians) : la tête suit le pointeur, le corps l'accompagne un peu.
const TURN = 0.95, NOD = 0.35, BODY = 0.35, EASE = 0.09, IDLE_MS = 2500;
// Lévitation (il n'a pas de jambes) : amplitude (part de la hauteur) et période (s).
const FLOAT = 0.018, FLOAT_S = 3.6;

/**
 * Halfred en 3D, sans cadre, dans la section Contact. Chargé quand la section
 * arrive à l'écran ; la boucle de rendu ne tourne que pendant qu'il est visible.
 * Éclairage, ombres et reflets sont cuits dans les textures : aucun calcul de lumière.
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
    let visible = true;
    let wake = () => {};
    let stop = () => {};

    const io = new IntersectionObserver(async ([e]) => {
      visible = e.isIntersecting;
      wake();
      if (e.intersectionRatio < 0.3 || loading) return;
      loading = true;
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
      renderer.setPixelRatio(Math.min(devicePixelRatio, "lite" in document.documentElement.dataset ? 1 : 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);

      const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(MODEL);
      if (gone) { renderer.dispose(); return; }
      gltf.scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.material = new THREE.MeshBasicMaterial({ map: (o.material as import("three").MeshStandardMaterial).map });
      });
      // Le personnage tourne autour de son axe vertical : on le recentre sur l'origine.
      const body = new THREE.Group();
      const size = new THREE.Box3().setFromObject(gltf.scene);
      const center = size.getCenter(new THREE.Vector3()), height = size.max.y - size.min.y;
      gltf.scene.position.sub(center);
      body.add(gltf.scene);
      scene.add(body);
      const head = gltf.scene.getObjectByName("Head")!;
      const rest = head.rotation.clone();

      const resize = () => {
        const w = node.clientWidth, h = node.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        // Distance pour que la hauteur (et la largeur sur un cadre étroit) tienne avec la marge.
        const fit = (height * MARGIN) / 2 / Math.tan((FOV * Math.PI) / 360);
        camera.position.set(0, 0, fit * Math.max(1, (size.max.x - size.min.x) / height / camera.aspect));
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        renderer.render(scene, camera);
      };

      // Au repos la tête est de profil (rotation du modèle). Quand le pointeur bouge, elle se
      // tourne vers lui et le corps suit un peu ; sans mouvement, retour de profil.
      const aim = { x: rest.y, y: rest.x, body: 0 };
      let raf = 0, idle = 0;
      const t0 = performance.now();
      const tick = (t: number) => {
        raf = 0;
        head.rotation.y += (aim.x - head.rotation.y) * EASE;
        head.rotation.x += (aim.y - head.rotation.x) * EASE;
        body.rotation.y += (aim.body - body.rotation.y) * EASE * 0.6;
        const s = ((t - t0) / 1000 / FLOAT_S) * Math.PI * 2;
        body.position.y = Math.sin(s) * FLOAT * height;
        body.rotation.z = Math.sin(s * 0.5) * 0.015;
        renderer.render(scene, camera);
        if (visible && !gone) raf = requestAnimationFrame(tick);
      };
      wake = () => { if (!still && visible && !raf) raf = requestAnimationFrame(tick); };
      const look = (ev: PointerEvent) => {
        const r = cv.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, (ev.clientX - (r.left + r.width / 2)) / (r.width / 2)));
        const ny = Math.max(-1, Math.min(1, ((ev.clientY - (r.top + r.height * 0.3)) / innerHeight) * 2));
        aim.x = nx * TURN; aim.y = rest.x + ny * NOD; aim.body = nx * BODY;
        clearTimeout(idle);
        idle = window.setTimeout(() => { aim.x = rest.y; aim.y = rest.x; aim.body = 0; }, IDLE_MS);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(node);
      resize();
      // Textures envoyées à la carte graphique avant l'apparition : pas d'image à moitié prête.
      await renderer.compileAsync(scene, camera);
      renderer.render(scene, camera);
      if (gone) return;
      if (!still) addEventListener("pointermove", look, { passive: true });
      wake();
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
