"use client";

import { useCallback, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { prefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Bascule de thème : le nouveau thème est révélé par un disque qui s’ouvre
 * depuis le bouton, via l’API View Transitions.
 * Source : magicuidesign/magicui — `registry/magicui/animated-theme-toggler.tsx`.
 *
 * Écarts locaux. Les six autres formes de révélation d’origine (carré,
 * triangle, losange, hexagone, rectangle, étoile) sont retirées : le site
 * n’en appelle qu’une, et leurs cent lignes de calcul de polygones ne
 * servaient personne. Le mode autonome l’est aussi — `next-themes` détient
 * l’état et la persistance, ce composant ne fait que demander la bascule, il
 * n’écrit jamais dans `localStorage`. Enfin le nom accessible est français.
 */
interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

const DURATION = 400;

/**
 * Toutes les coordonnées sont des pourcentages de la boîte de référence du
 * cliché : Chrome 150 rend les coordonnées absolues de `clip-path` sur
 * `::view-transition-new(root)` sans les mettre à l’échelle lors de la
 * première transition suivant le chargement, sur les échelles d’affichage
 * fractionnaires (Windows à 150 %, par exemple). En pixels, le disque
 * s’ouvrirait au mauvais endroit.
 */
function circleClipPaths(
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number,
): [string, string] {
  const at = `${(cx / viewportWidth) * 100}% ${(cy / viewportHeight) * 100}%`;
  // Un rayon en pourcentage se résout contre hypot(l, h) / racine de 2.
  const radius = `${
    (maxRadius / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100
  }%`;
  return [`circle(0% at ${at})`, `circle(${radius} at ${at})`];
}

export const AnimatedThemeToggler = ({
  className,
  theme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) => {
  const isDark = theme === "dark";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);
  const activeAnimRef = useRef<Animation | null>(null);

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel();
    activeAnimRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelAnim();
      const root = document.documentElement;
      if (root.dataset.magicuiThemeVt !== "active") return;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    };
  }, [cancelAnim]);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (
      !button ||
      isTransitioningRef.current ||
      document.documentElement.dataset.magicuiThemeVt === "active"
    ) {
      return;
    }

    // innerWidth/innerHeight, et non visualViewport : les pourcentages se
    // résolvent contre la boîte de référence du cliché, laquelle inclut les
    // barres de défilement classiques.
    const viewportWidth = globalThis.innerWidth;
    const viewportHeight = globalThis.innerHeight;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );

    const applyTheme = () => {
      // La classe bascule toujours de façon synchrone pour que l’API View
      // Transitions prenne son cliché sur le nouveau thème.
      document.documentElement.classList.toggle("dark");
      onThemeChange(isDark ? "light" : "dark");
    };

    // Le balayage est créé par `element.animate(...)`, une animation WAAPI : la
    // règle `animation: none !important` de globals.css ne peut pas l'arrêter,
    // elle ne gouverne que la propriété CSS `animation`. Mesuré avant ce
    // garde-fou : sous `prefers-reduced-motion: reduce`, l'appel était
    // strictement identique à celui du mode par défaut, 400 ms de clip-path
    // plein écran. La préférence se lit donc ici, avant d'ouvrir la transition.
    if (
      prefersReducedMotion() ||
      typeof document.startViewTransition !== "function"
    ) {
      applyTheme();
      return;
    }

    const clipPath = circleClipPaths(
      x,
      y,
      maxRadius,
      viewportWidth,
      viewportHeight,
    );

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = "active";
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      `${DURATION}ms`,
    );
    // Le clip-path fermé est épinglé en CSS pour que Firefox ne peigne pas le
    // nouveau thème sans masque entre le cliché et l’animation JS.
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);
    const cleanup = () => {
      isTransitioningRef.current = false;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
      cancelAnim();
    };

    isTransitioningRef.current = true;
    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });
    if (typeof transition?.finished?.finally === "function") {
      transition.finished.finally(cleanup).catch(() => {});
    } else {
      cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready
        .then(() => {
          activeAnimRef.current = document.documentElement.animate(
            { clipPath },
            {
              duration: DURATION,
              easing: "ease-in-out",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => {});
    }
  }, [isDark, onThemeChange, cancelAnim]);

  return (
    // Le nom accessible est en français et suit l'état ; le consommateur peut
    // le remplacer. La doublure `sr-only` anglaise d'origine était masquée par
    // cet attribut, donc jamais annoncée, mais présente dans le DOM d'un site
    // entièrement francophone.
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en thème clair" : "Passer en thème sombre"}
      className={className}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
};
