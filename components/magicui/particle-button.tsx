"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Bouton d’action primaire : au clic, six particules partent du centre.
 * Source : kokonut-labs/kokonutui — `particle-button.tsx` (Dorian Baffier, MIT).
 *
 * Écarts locaux :
 *
 * 1. Pas de `Button` shadcn ni de `motion/react` : le dépôt n’a pas le premier,
 *    et les particules sont six nœuds à translater — une `@keyframes` CSS
 *    (globals.css) suffit. La rafale se rejoue en changeant la clé du calque,
 *    ce qui évite le minuteur d’effacement de la version d’origine.
 * 2. Les six trajectoires sont fixes au lieu d’être tirées au hasard : le
 *    hasard au rendu produirait un écart entre le HTML du serveur et celui du
 *    client, et six directions régulières se lisent mieux que six aléatoires.
 * 3. `position: fixed` remplacé par un calque absolu dans le bouton : la
 *    version d’origine mesure le bouton à chaque rendu et pose les particules
 *    en coordonnées de fenêtre, ce qui les décroche au défilement.
 * 4. Ce bouton est le traitement unique de « Demander un devis » — l’ancre en
 *    tête de page comme l’envoi du formulaire. La critique relevait deux
 *    traitements du même libellé sur une même page.
 */
type Props = {
  children: ReactNode;
  className?: string;
  /** Rendu en lien Next quand l’action est une ancre plutôt qu’un envoi. */
  href?: string;
  /** Remplace la pastille de curseur, par exemple par un indicateur d’envoi. */
  icon?: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const shell =
  "relative inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-[background-color,box-shadow,transform] duration-150 hover:bg-primary/88 hover:shadow-[0_3px_12px_-3px_color-mix(in_oklch,var(--primary)_60%,transparent)] active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none";

/** Six directions régulières, en pixels depuis le centre du bouton. */
const PARTICLES = [
  [-46, -30],
  [-28, -46],
  [0, -52],
  [28, -46],
  [46, -30],
  [58, -8],
] as const;

function Burst() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {PARTICLES.map(([x, y], index) => (
        <span
          key={index}
          className="particle absolute left-1/2 top-1/2 size-1 rounded-full bg-foreground"
          style={{
            "--particle-x": `${x}px`,
            "--particle-y": `${y}px`,
            "--particle-delay": `${index * 0.06}s`,
          } as CSSProperties}
        />
      ))}
    </span>
  );
}

export function ParticleButton({
  children,
  className,
  href,
  icon,
  onClick,
  ...props
}: Props) {
  // Compteur plutôt que booléen : la clé change à chaque clic, l’animation
  // repart même si la précédente n’est pas terminée.
  const [bursts, setBursts] = useState(0);
  const fire = () => {
    if (!prefersReducedMotion()) setBursts((count) => count + 1);
  };

  const content = (
    <>
      {bursts > 0 ? <Burst key={bursts} /> : null}
      {children}
      {icon ?? <MousePointerClick className="size-4" aria-hidden />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(shell, className)} onClick={fire}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(shell, className)}
      onClick={(event) => {
        fire();
        onClick?.(event);
      }}
      {...props}
    >
      {content}
    </button>
  );
}

export default ParticleButton;
