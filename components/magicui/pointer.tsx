"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useMotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Source : magicuidesign/magicui — `registry/magicui/pointer.tsx`.
 * A custom pointer component that displays an animated cursor.
 * Add this as a child to any component to enable a custom pointer when hovering.
 * You can pass custom children to render as the pointer.
 *
 * @component
 * @param {HTMLMotionProps<"div">} props - The component props
 */
export function Pointer({
  className,
  style,
  children,
  ...props
}: HTMLMotionProps<"div">): React.ReactNode {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  // Le curseur est monté par `motion` avec des valeurs inline : la règle CSS
  // `prefers-reduced-motion` de globals.css ne les atteint pas. Sous cette
  // préférence, il apparaît et disparaît sans échelle ni durée.
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Un curseur dessiné n'a de sens que là où il existe un curseur. Sur une
    // machine tactile ou hybride, la version d'origine posait quand même
    // `cursor: none` en style inline sur la carte : mesuré à 390px en
    // `pointer: coarse`, le curseur système disparaissait au-dessus du bloc.
    const finePointer = typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    const parentElement = typeof window !== "undefined"
      ? (containerRef.current?.parentElement ?? null)
      : null;

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsActive(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    if (parentElement) {
      parentElement.style.cursor = "none";
      parentElement.addEventListener("mousemove", handleMouseMove);
      parentElement.addEventListener("mouseenter", handleMouseEnter);
      parentElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (parentElement) {
        parentElement.style.cursor = "";
        parentElement.removeEventListener("mousemove", handleMouseMove);
        parentElement.removeEventListener("mouseenter", handleMouseEnter);
        parentElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [x, y]);

  return (
    <>
      {
        /* Sonde : sert seulement à retrouver l’élément parent. `hidden` la
          retire du flux, sinon elle compterait comme un enfant dans un
          conteneur flex et y ouvrirait un espacement. */
      }
      <div ref={containerRef} className="hidden" />
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="pointer-events-none fixed z-50 transform-[translate(-50%,-50%)]"
            style={{
              top: y,
              left: x,
              ...style,
            }}
            initial={reduced ? { opacity: 1 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : undefined}
            {...props}
          >
            {children || (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "rotate-[-70deg] stroke-white text-black",
                  className,
                )}
              >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
