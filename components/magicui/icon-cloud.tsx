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
  showControl?: boolean;
  label?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

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
  showControl = true,
  label = "Nuage d’icônes interactif",
}: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState<
    {
      x: number;
      y: number;
      startX: number;
      startY: number;
      distance: number;
      startTime: number;
      duration: number;
    } | null
  >(null);
  const animationFrameRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  // Le mouvement s’arrête d’emblée si le visiteur a demandé moins d’animation.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return offscreen;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = source;
      img.onload = () => {
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        offCtx.beginPath();
        offCtx.arc(20, 20, 20, 0, Math.PI * 2);
        offCtx.closePath();
        offCtx.clip();
        offCtx.drawImage(img, 0, 0, 40, 40);
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
        x: Math.cos(phi) * r * 100,
        y: y * 100,
        z: Math.sin(phi) * r * 100,
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

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = toCanvasSpace(event);
    const canvas = canvasRef.current;
    if (!point || !canvas) return;

    iconPositions.forEach((icon) => {
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const screenX = canvas.width / 2 + rotatedX;
      const screenY = canvas.height / 2 + rotatedY;

      const scale = (rotatedZ + 200) / 300;
      const radius = 20 * scale;
      const dx = point.x - screenX;
      const dy = point.y - screenY;

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(
          icon.y,
          Math.sqrt(icon.x * icon.x + icon.z * icon.z),
        );
        const targetY = Math.atan2(icon.x, icon.z);
        const currentX = rotationRef.current.x;
        const currentY = rotationRef.current.y;
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2),
        );

        setTargetRotation({
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration: Math.min(2000, Math.max(800, distance * 1000)),
        });
        return;
      }
    });

    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = toCanvasSpace(event);
    if (point) setMousePos(point);

    if (isDragging) {
      const deltaX = event.clientX - lastMousePos.x;
      const deltaY = event.clientY - lastMousePos.y;
      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      };
      setLastMousePos({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const dx = mousePos.x - centerX;
      const dy = mousePos.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.003 + (distance / maxDistance) * 0.01;

      if (targetRotation) {
        const elapsed = performance.now() - targetRotation.startTime;
        const progress = Math.min(1, elapsed / targetRotation.duration);
        const easedProgress = easeOutCubic(progress);

        rotationRef.current = {
          x: targetRotation.startX +
            (targetRotation.x - targetRotation.startX) * easedProgress,
          y: targetRotation.startY +
            (targetRotation.y - targetRotation.startY) * easedProgress,
        };

        if (progress >= 1) setTargetRotation(null);
      } else if (!isDragging && !isPaused) {
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

        const scale = (rotatedZ + 200) / 300;
        const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));

        ctx.save();
        ctx.translate(
          canvas.width / 2 + rotatedX,
          canvas.height / 2 + rotatedY,
        );
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        if (iconCanvasesRef.current[index] && imagesLoadedRef.current[index]) {
          ctx.drawImage(iconCanvasesRef.current[index], -20, -20, 40, 40);
        }

        ctx.restore();
      });

      const hasPendingAssets = !imagesLoadedRef.current.every(Boolean);
      const shouldContinue = !isPaused || isDragging ||
        targetRotation !== null || hasPendingAssets;

      if (shouldContinue) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [images, iconPositions, isDragging, isPaused, mousePos, targetRotation]);

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="h-auto w-full cursor-grab rounded-lg active:cursor-grabbing"
        aria-label={label}
        role="img"
      />
      {showControl
        ? (
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused
              ? "Relancer la rotation"
              : "Arrêter la rotation"}
            className="absolute top-2 right-2 grid size-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {isPaused
              ? <Play className="size-4" aria-hidden />
              : <Pause className="size-4" aria-hidden />}
          </button>
        )
        : null}
    </div>
  );
}
