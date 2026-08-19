import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import BlurFade from "@/components/blur-fade";

/** Colonne de lecture unique, identique sur toutes les pages. */
export function Column({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-32 pt-16 sm:pt-24">
      <div className="flex flex-col gap-14 sm:gap-16">{children}</div>
    </main>
  );
}

/**
 * Premier écran. Le contenu se centre sur une grille de fond de 24 px et le
 * titre monte d’un cran d’échelle : c’est la forme du bloc de référence
 * retenue par le client, appliquée aux trois pages du chemin commercial.
 *
 * La grille est peinte en fond, pas dessinée en nœuds — la grille interactive
 * des marges (components/side-grid.tsx) reste la seule à coûter du DOM. Elle
 * s’arrête à `-inset-x-5`, la valeur exacte du rembourrage de `Column` : un
 * débordement d’un pixel de plus donnerait une barre de défilement horizontale
 * sur mobile, que l’audit signale.
 */
export function Hero({
  children,
  cue = true,
}: {
  children: ReactNode;
  /** Flèche de bas de premier écran. Fausse sur les pages sans corps long. */
  cue?: boolean;
}) {
  return (
    <section
      id="contenu"
      className="relative flex flex-col gap-6 text-center"
    >
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute -inset-x-5 -top-16 bottom-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />
      {children}
      {cue
        ? (
          <ArrowDown
            aria-hidden
            className="mt-2 size-5 animate-bounce self-center text-muted-foreground"
          />
        )
        : null}
    </section>
  );
}

/** Rangée d’actions du premier écran : centrée, elle passe à la ligne. */
export function HeroActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {children}
    </div>
  );
}

/**
 * Action secondaire. Même gabarit que le bouton primaire
 * (components/magicui/particle-button.tsx) — hauteur, rayon plein, graisse —
 * pour que les deux se lisent comme une paire et non comme deux composants.
 */
export const secondaryButton =
  "inline-flex h-10 w-fit items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium transition-colors duration-150 hover:border-foreground/25 hover:bg-accent active:translate-y-px";

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

/**
 * Suite de moments datés. Même grammaire que `DataRow` — repère à gauche,
 * contenu à droite, filet 1px entre les lignes — mais le repère est une heure
 * et le contenu une phrase. Sert à faire reconnaître une journée de travail
 * avant d’énumérer un périmètre fonctionnel.
 */
export function Timeline({
  items,
}: {
  items: readonly { time: string; title: string; body: string }[];
}) {
  return (
    <ol className="flex flex-col divide-y divide-border">
      {items.map((item) => (
        <li
          key={item.time}
          className="grid gap-1 py-4 sm:grid-cols-[5.5rem_1fr] sm:gap-5"
        >
          <p className="num text-sm text-muted-foreground sm:pt-px">
            {item.time}
          </p>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
