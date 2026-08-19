"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type BlurFadeProps = {
  children: ReactNode;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  blur?: string;
};

/**
 * Révélation en fondu-flou. L’animation elle-même est une @keyframes CSS
 * (voir globals.css) : le composant ne fait que décider du moment où elle part
 * et transmettre ses paramètres en variables. Le respect de
 * prefers-reduced-motion est également porté par la feuille de style.
 */
export default function BlurFade({
  children,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Sans détection de visibilité, l’animation part au montage.
  const [play, setPlay] = useState(!inView);

  useEffect(() => {
    const node = ref.current;
    if (play || !node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlay(true);
        observer.disconnect();
      },
      { rootMargin: "-50px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [play]);

  return (
    <div
      ref={ref}
      data-blur-fade={play ? "run" : "wait"}
      style={{
        "--bf-duration": `${duration}s`,
        "--bf-delay": `${0.04 + delay}s`,
        "--bf-y": `${yOffset}px`,
        "--bf-blur": blur,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}
