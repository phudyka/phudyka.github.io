import type { ReactNode } from "react";

/**
 * Deux châssis, une seule grammaire.
 *
 * Une capture posée nue sur la page se lit comme une image ; posée dans le
 * cadre de l'appareil qui l'a produite, elle se lit comme un écran. C'est la
 * seule raison d'être de ces deux composants — ils n'ajoutent aucune couleur,
 * aucun reflet, aucune surcouche de verre : les mêmes jetons que le reste du
 * site, une bordure, un fond de carte.
 *
 * Inspirés du `Safari` de Magic UI, réécrits en balisage plutôt qu'en SVG :
 * la barre de titre doit porter du vrai texte — l'URL est une information, et
 * une URL peinte dans un SVG n'est ni sélectionnable ni traduisible.
 */

/** Châssis navigateur : trois pastilles, un champ d'adresse, la page dessous. */
export function BrowserFrame(
  { url, children }: { url: string; children: ReactNode },
) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-3 py-2.5">
        <div className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-muted-foreground/40" />
          <span className="size-2.5 rounded-full bg-muted-foreground/40" />
          <span className="size-2.5 rounded-full bg-muted-foreground/40" />
        </div>
        <p className="num min-w-0 flex-1 truncate rounded-md bg-background px-3 py-1 text-center text-xs text-muted-foreground">
          {url}
        </p>
        {/* Contrepoids des pastilles : sans lui l'URL n'est pas centrée. */}
        <div className="w-[42px] shrink-0" aria-hidden />
      </div>
      {children}
    </div>
  );
}

/**
 * Châssis téléphone. Pas d'encoche : la capture vient d'un navigateur en
 * fenêtre étroite, elle n'en a pas, et en peindre une par-dessus recouvrirait
 * le titre de l'écran — un ornement qui mange l'information qu'il encadre.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[220px] sm:max-w-[260px] rounded-[2rem] border border-border bg-card p-2.5">
      <div className="overflow-hidden rounded-[1.5rem] border border-border">
        {children}
      </div>
    </div>
  );
}
