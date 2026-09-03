"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

interface IconCloudProps {
  images: string[];
  label?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Géométrie de la sphère, en unités du canvas de 400 × 400.
 *
 * Les valeurs d’origine — rayon 100, icônes de 40 px — tiennent pour la
 * vingtaine d’icônes des démonstrations amont. À trente-quatre, la projection
 * les tassait en une tache illisible : deux fois trop de surface d’icône pour
 * la sphère qui les portait. Le rayon prend donc toute la place disponible
 * (150 + une demi-icône = 167, sous les 200 du demi-canvas) et l’icône
 * rétrécit d’un cran.
 */
const RADIUS = 150;
const ICON = 34;

/** Échelle et opacité de profondeur, exprimées en fractions du rayon. */
const depthScale = (z: number) => (z + 2 * RADIUS) / (3 * RADIUS);
const depthOpacity = (z: number) =>
  Math.max(0.2, Math.min(1, (z + 1.5 * RADIUS) / (2 * RADIUS)));

/**
 * Sphère d’icônes en rotation, dessinée sur un canvas.
 * Source : magicuidesign/magicui — `registry/magicui/icon-cloud.tsx`.
 * Écarts locaux : la branche « icônes React » (qui imposait `react-dom/server`
 * dans le bundle client) est retirée — seules des URL d’images sont acceptées ;
 * le bouton shadcn est remplacé par les tokens du site ; le canvas se met à
 * l’échelle en CSS et les coordonnées de pointage sont corrigées d’autant.
 */
export function IconCloud({
  images,
  label = "Nuage d’icônes interactif",
}: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  /**
   * Tout l'état de pointage vit dans des refs, pas dans `useState`.
   *
   * En amont, `mousePos`, `lastMousePos`, `isDragging` et `targetRotation`
   * étaient des états, et l'effet d'animation les avait tous en dépendances :
   * chaque `mousemove` provoquait un rendu, l'annulation de la boucle et son
   * redémarrage. La sphère saccadait et le glissement partait en escalier.
   * Une ref ne redéclenche rien ; la boucle tourne une fois pour toutes.
   */
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  /** Au repos, le pointeur est réputé au centre : sinon la sphère part en biais. */
  const mouseRef = useRef({ x: 200, y: 200 });
  const targetRef = useRef<
    {
      x: number;
      y: number;
      startX: number;
      startY: number;
      startTime: number;
      duration: number;
    } | null
  >(null);
  const pausedRef = useRef(false);
  pausedRef.current = isPaused;
  /** La boucle s'arrête quand tout est immobile ; `kick` la rallume. */
  const runningRef = useRef(false);
  const kickRef = useRef<(() => void) | null>(null);

  // Le mouvement s’arrête d’emblée si le visiteur a demandé moins d’animation.
  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (mediaQuery.matches) setIsPaused(true);

    const handleChange = (event: MediaQueryListEvent) =>
      setIsPaused(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Une passe de préparation : chaque image est peinte une fois dans un canvas
  // hors écran, découpée en rond, puis recopiée à chaque frame.
  useEffect(() => {
    imagesLoadedRef.current = new Array(images.length).fill(false);

    iconCanvasesRef.current = images.map((source, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = ICON;
      offscreen.height = ICON;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return offscreen;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = source;
      img.onload = () => {
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        offCtx.beginPath();
        offCtx.arc(ICON / 2, ICON / 2, ICON / 2, 0, Math.PI * 2);
        offCtx.closePath();
        offCtx.clip();
        offCtx.drawImage(img, 0, 0, ICON, ICON);
        imagesLoadedRef.current[index] = true;
      };
      return offscreen;
    });
  }, [images]);

  // Répartition des icônes sur une sphère de Fibonacci.
  useEffect(() => {
    const newIcons: Icon[] = [];
    const numIcons = images.length || 20;
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      newIcons.push({
        x: Math.cos(phi) * r * RADIUS,
        y: y * RADIUS,
        z: Math.sin(phi) * r * RADIUS,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    setIconPositions(newIcons);
  }, [images]);

  /** Le canvas est mis à l’échelle en CSS : ramener le pointeur à ses coordonnées internes. */
  function toCanvasSpace(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect || rect.width === 0) return null;
    const ratio = canvas.width / rect.width;
    return {
      x: (event.clientX - rect.left) * ratio,
      y: (event.clientY - rect.top) * ratio,
    };
  }

  /**
   * L'icône sous le pointeur, ou `null`. La version amont parcourait la liste
   * en `forEach` avec un `return` dedans, qui n'interrompt rien : la dernière
   * icône touchée gagnait, et le glissement démarrait quand même par-dessus
   * l'animation de recentrage. Une boucle qui sort vraiment règle les deux.
   */
  function iconUnder(
    point: { x: number; y: number },
    canvas: HTMLCanvasElement,
  ) {
    const cosX = Math.cos(rotationRef.current.x);
    const sinX = Math.sin(rotationRef.current.x);
    const cosY = Math.cos(rotationRef.current.y);
    const sinY = Math.sin(rotationRef.current.y);

    for (const icon of iconPositions) {
      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      // Seules les icônes de la face avant se cliquent : celles du fond sont
      // masquées par elles, et les attraper à travers la sphère surprend.
      if (rotatedZ < 0) continue;

      const dx = point.x - (canvas.width / 2 + rotatedX);
      const dy = point.y - (canvas.height / 2 + rotatedY);
      const radius = (ICON / 2) * depthScale(rotatedZ);

      if (dx * dx + dy * dy < radius * radius) return icon;
    }
    return null;
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = toCanvasSpace(event);
    const canvas = canvasRef.current;
    if (!point || !canvas) return;

    const hit = iconUnder(point, canvas);
    if (hit) {
      const targetX = -Math.atan2(
        hit.y,
        Math.sqrt(hit.x * hit.x + hit.z * hit.z),
      );
      const targetY = Math.atan2(hit.x, hit.z);
      const startX = rotationRef.current.x;
      const startY = rotationRef.current.y;
      const distance = Math.hypot(targetX - startX, targetY - startY);

      targetRef.current = {
        x: targetX,
        y: targetY,
        startX,
        startY,
        startTime: performance.now(),
        duration: Math.min(1200, Math.max(500, distance * 600)),
      };
      kickRef.current?.();
      return;
    }

    targetRef.current = null;
    draggingRef.current = true;
    lastMouseRef.current = { x: event.clientX, y: event.clientY };
    kickRef.current?.();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = toCanvasSpace(event);
    if (point) mouseRef.current = point;

    if (!draggingRef.current) return;
    const deltaX = event.clientX - lastMouseRef.current.x;
    const deltaY = event.clientY - lastMouseRef.current.y;
    rotationRef.current = {
      x: rotationRef.current.x + deltaY * 0.005,
      y: rotationRef.current.y + deltaX * 0.005,
    };
    lastMouseRef.current = { x: event.clientX, y: event.clientY };
    kickRef.current?.();
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  /** Pointeur sorti : la sphère reprend sa rotation lente, pas une fuite en biais. */
  const handleMouseLeave = () => {
    draggingRef.current = false;
    mouseRef.current = { x: 200, y: 200 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.hypot(centerX, centerY);
      const dx = mouseRef.current.x - centerX;
      const dy = mouseRef.current.y - centerY;
      const speed = 0.003 + (Math.hypot(dx, dy) / maxDistance) * 0.01;
      const target = targetRef.current;

      if (target) {
        const progress = Math.min(
          1,
          (performance.now() - target.startTime) / target.duration,
        );
        const eased = easeOutCubic(progress);

        rotationRef.current = {
          x: target.startX + (target.x - target.startX) * eased,
          y: target.startY + (target.y - target.startY) * eased,
        };

        if (progress >= 1) targetRef.current = null;
      } else if (!draggingRef.current && !pausedRef.current) {
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      iconPositions.forEach((icon, index) => {
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;

        const scale = depthScale(rotatedZ);
        const opacity = depthOpacity(rotatedZ);

        ctx.save();
        ctx.translate(
          canvas.width / 2 + rotatedX,
          canvas.height / 2 + rotatedY,
        );
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        if (iconCanvasesRef.current[index] && imagesLoadedRef.current[index]) {
          ctx.drawImage(
            iconCanvasesRef.current[index],
            -ICON / 2,
            -ICON / 2,
            ICON,
            ICON,
          );
        }

        ctx.restore();
      });

      const hasPendingAssets = !imagesLoadedRef.current.every(Boolean);
      const shouldContinue = !pausedRef.current || draggingRef.current ||
        targetRef.current !== null || hasPendingAssets;

      if (shouldContinue) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        runningRef.current = false;
      }
    };

    // Une seule boucle pour la vie du composant : les refs de pointage ne
    // figurent pas dans les dépendances, donc rien ne la redémarre.
    runningRef.current = true;
    kickRef.current = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      animate();
    };
    animate();

    return () => {
      runningRef.current = false;
      kickRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [iconPositions]);

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="h-auto w-full cursor-grab rounded-lg active:cursor-grabbing"
        aria-label={label}
        role="img"
      />
      <button
        type="button"
        onClick={() => {
          setIsPaused(!isPaused);
          if (isPaused) kickRef.current?.();
        }}
        aria-label={isPaused ? "Relancer la rotation" : "Arrêter la rotation"}
        className="absolute top-2 right-2 grid size-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {isPaused
          ? <Play className="size-4" aria-hidden />
          : <Pause className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
