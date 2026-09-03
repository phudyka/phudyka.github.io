"use client";

import {
  Activity,
  Eye,
  GraduationCap,
  KeyRound,
  type LucideIcon,
  MessagesSquare,
  Terminal,
} from "lucide-react";
import { Pointer } from "@/components/magicui/pointer";

/**
 * Un curseur par projet, posé en enfant de la carte survolée. Le motif dit de
 * quoi parle le projet avant qu’on ait lu la carte : une clé pour KeyMaster,
 * un tracé de signes vitaux pour le monitoring, un prompt pour le shell.
 * Sur mobile, faute de survol, rien de tout cela ne se déclenche.
 */
/**
 * Aucune couleur littérale : cinq accents Tailwind en dur (`amber`, `rose`,
 * `sky`, `orange`, `emerald`) faisaient de cette page l'endroit le plus
 * chromatique du site, pour une décoration, contre la règle de l'orange unique.
 * Le motif distingue les projets ; la couleur ne l'aide pas à le faire.
 */
const POINTERS: Record<string, { icon: LucideIcon | "pong" }> = {
  key: { icon: KeyRound },
  pulse: { icon: Activity },
  pong: { icon: "pong" },
  chat: { icon: MessagesSquare },
  raycast: { icon: Eye },
  shell: { icon: Terminal },
  school: { icon: GraduationCap },
};

/** La balle et la raquette de ft_transcendence : aucune icône lucide ne le dit. */
function PongCursor({ className }: { className: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect x="3" y="7" width="3" height="14" rx="1.5" fill="currentColor" />
      <circle cx="17" cy="14" r="3.5" fill="currentColor" />
    </svg>
  );
}

export default function ProjectPointer({ kind }: { kind: string }) {
  const entry = POINTERS[kind];
  if (!entry) return null;

  const shadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]";

  return (
    <Pointer>
      {entry.icon === "pong"
        ? <PongCursor className={`text-foreground ${shadow}`} />
        : <entry.icon className={`size-6 text-foreground ${shadow}`} />}
    </Pointer>
  );
}
