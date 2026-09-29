import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Chemin public d'une image du monde Halfred, ou `null` tant que Paul ne l'a
 * pas livrée dans `public/halfred/`. Lu au build (composants serveur, export
 * statique) : la page reste complète sans ses images.
 */
export function halfredImage(name: string): string | null {
  return existsSync(path.join(process.cwd(), "public/halfred", name))
    ? `/halfred/${name}`
    : null;
}
