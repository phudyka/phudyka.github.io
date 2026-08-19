"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Grille de carrés qui s’allument au survol.
 * Source : magicuidesign/magicui — `registry/magicui/interactive-grid-pattern.tsx`.
 * Écart local : les gris en dur sont remplacés par les tokens de bordure du site,
 * pour que la grille suive le thème au lieu de flotter au-dessus.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  /** [horizontal, vertical] */
  squares?: [number, number];
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn("absolute inset-0 h-full w-full", className)}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-border transition-all duration-100 ease-in-out not-[&:hover]:duration-[1200ms]",
              hoveredSquare === index ? "fill-primary/25" : "fill-transparent",
              squaresClassName,
            )}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        );
      })}
    </svg>
  );
}
