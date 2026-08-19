import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusion de classes Tailwind : les conflits sont tranchés par la dernière valeur. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
