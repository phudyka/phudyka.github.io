import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Bouton dont la pastille se dilate jusqu’à remplir le fond au survol,
 * le libellé glissant pour laisser place au même libellé fléché.
 * Source : magicuidesign/magicui — `registry/magicui/interactive-hover-button.tsx`.
 * Écart local : accepte un `href` pour se rendre en lien Next, l’action
 * « Demander un devis » étant une ancre et non un envoi de formulaire.
 */
type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const shell =
  "group relative inline-flex h-10 w-auto cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-background px-6 text-center text-sm font-semibold";

function Inner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="flex items-center justify-center gap-2">
        <span
          aria-hidden
          className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]"
        />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </span>
      <span
        aria-hidden
        className="absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary-foreground group-hover:opacity-100"
      >
        <span>{children}</span>
        <ArrowRight className="size-4" />
      </span>
    </>
  );
}

export function InteractiveHoverButton({
  children,
  className,
  href,
  ...props
}: Props) {
  if (href) {
    return (
      <Link href={href} className={cn(shell, className)}>
        <Inner>{children}</Inner>
      </Link>
    );
  }

  return (
    <button type="button" className={cn(shell, className)} {...props}>
      <Inner>{children}</Inner>
    </button>
  );
}
