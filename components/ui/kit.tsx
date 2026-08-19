import type { ReactNode } from "react";
import BlurFade from "@/components/blur-fade";

/** Colonne de lecture unique, identique sur toutes les pages. */
export function Column({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-32 pt-16 sm:pt-24">
      <div className="flex flex-col gap-14 sm:gap-16">{children}</div>
    </main>
  );
}

export function Section({
  id,
  title,
  lead,
  reveal = false,
  children,
}: {
  id?: string;
  title: string;
  lead?: string;
  /**
   * Réservé à la première section sous la ligne de flottaison : elle marque le
   * passage du premier écran au corps de la page. Toutes les autres sections
   * sont visibles d’emblée — une entrée identique répétée sur chaque section
   * n’est pas un moment, c’est un tic. Le seul moment orchestré du site est la
   * pose du nom en tête d’accueil.
   */
  reveal?: boolean;
  children: ReactNode;
}) {
  const body = (
    <section id={id} className="flex min-h-0 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
        {lead
          ? (
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {lead}
            </p>
          )
          : null}
      </div>
      {children}
    </section>
  );

  if (!reveal) return body;

  return (
    <BlurFade inView yOffset={4} blur="4px" duration={0.35}>
      {body}
    </BlurFade>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-md border border-border bg-muted/60 px-2 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export function TagRow({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => <Tag key={item}>{item}</Tag>)}
    </div>
  );
}

/** Ligne compacte : libellé à gauche, valeur alignée à droite en chiffres tabulaires. */
export function DataRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 last:border-b-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="num text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

/**
 * Grille bento : des tuiles de largeurs inégales sur trois colonnes. Elle ne
 * remplace pas les lignes chiffrées du chemin commercial — c’est une manière
 * de lire un périmètre fonctionnel d’un coup d’œil, là où une liste de huit
 * entrées se lit en huit temps. Pas d’icône, pas de chiffre décoratif : le
 * titre et la phrase suffisent.
 */
export function Bento({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-3">{children}</div>;
}

export function BentoCell({
  title,
  span = 1,
  children,
}: {
  title: string;
  /** 1 ou 2 colonnes sur les trois. */
  span?: 1 | 2;
  children: ReactNode;
}) {
  return (
    <article
      className={`flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/50 ${
        span === 2 ? "sm:col-span-2" : "sm:col-span-1"
      }`}
    >
      <h3 className="font-medium">{title}</h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </article>
  );
}
