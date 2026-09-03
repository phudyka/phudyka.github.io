/**
 * Concatène des classes en ignorant les valeurs vides.
 *
 * Ni `clsx` ni `tailwind-merge` : aucun appelant ne passe de classe qui entre
 * en conflit avec la base, l'arbitrage des conflits n'avait donc rien à
 * arbitrer. Si un jour un appelant doit écraser une classe de base, c'est
 * `tailwind-merge` qu'il faudra remettre, pas contourner ici.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
