"use client";

import React, { useRef } from "react";
import {
  motion,
  type MotionProps,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Dock façon macOS : la barre suit la position horizontale du curseur et
 * chaque icône grossit selon sa distance à ce curseur.
 * Source : magicuidesign/magicui — `registry/magicui/dock.tsx`.
 * Écart local : la variante `cva` a été retirée (aucune variante n’est
 * utilisée) et les couleurs viennent des tokens du site.
 */

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 58;
const DEFAULT_DISTANCE = 140;

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () =>
      React.Children.map(children, (child) => {
        if (
          React.isValidElement<DockIconProps>(child) &&
          child.type === DockIcon
        ) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX,
            size: iconSize,
            magnification: iconMagnification,
            distance: iconDistance,
          });
        }
        return child;
      });

    return (
      <motion.div
        ref={ref}
        onMouseMove={(event) => mouseX.set(event.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...(props as MotionProps)}
        className={cn(
          // Opaque et pleinement arrondi : le contrat (DESIGN.md, règle de
          // l'occultation franche) interdit la translucidité sur un élément qui
          // recouvre le texte. En `bg-background/90 backdrop-blur-md`, la copie
          // du pied de page se lisait à travers la barre.
          "mx-auto flex w-max items-center gap-1 rounded-full border border-border bg-background p-1.5",
          className,
        )}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = "Dock";

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // Le rembourrage d'origine (20% de la cellule) rognait la cible cliquable de
  // 40px à 24px : le `<a>` occupe la cellule moins ce rembourrage, et 24px est
  // le plancher strict de WCAG 2.5.8, sans marge. La cellule entière est
  // désormais la cible ; l'icône garde sa respiration par sa propre taille.
  const padding = 2;
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(
    mouseX ?? defaultMouseX,
    (value: number) => {
      const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
      return value - bounds.x - bounds.width / 2;
    },
  );

  // Le grossissement est un ressort de `motion` : il écrit une largeur inline à
  // chaque image, hors d'atteinte de la règle CSS `prefers-reduced-motion` de
  // globals.css. Sous cette préférence, la cellule garde donc sa taille de
  // repos — mesuré : elle passait toujours de 40 à 56px.
  const reduced = useReducedMotion();

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, reduced ? size : magnification, size],
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn(
        "flex aspect-square items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon };
