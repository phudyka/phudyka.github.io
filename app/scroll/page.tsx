import type { Metadata } from "next";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import ProjectPointer from "@/components/project-pointer";
import Clock from "@/components/scroll/clock";
import Topology from "@/components/scroll/topology";
import { secondaryButton, TagRow } from "@/components/ui/kit";
import {
  EDUCATION,
  HIRING,
  IDENTITY,
  MISSIONS,
  POOLCENTER,
  SKILL_GROUPS,
  STACK_ICON_URLS,
} from "@/data/content";

export const metadata: Metadata = {
  title: "En défilement",
  description:
    "Le même dossier, lu comme un magazine : une application en production, un réseau qui se ferme sous le curseur, un parcours.",
  alternates: { canonical: "/scroll/" },
};

/**
 * Version longue de l'accueil, lue comme un magazine imprimé : des chapitres,
 * des coupes franches entre les fonds, et un seul acte épinglé — le réseau qui
 * se ferme, où le curseur du lecteur devient le paquet.
 *
 * Elle ne remplace pas `/` : les deux disent la même chose, l'une en une page
 * dense, l'autre en six chapitres. Un bouton mène de l'une à l'autre, le dock
 * ramène partout ailleurs.
 *
 * Le contrat « mouvement rare » du site tient toujours : cette page a un seul
 * moment orchestré, comme l'accueil, et c'est l'acte de topologie.
 */

/**
 * Un logo par employeur et par école, servi par le site. Les marques restent
 * hors de `data/content.ts` : elles n'ont de sens que sur cette page.
 */
const LOGOS: Record<string, string> = {
  "GPI France": "/logos/gpi-france.webp",
  "École 42 Nice": "/logos/ecole-42.webp",
  "Université Côte d’Azur": "/logos/uca.webp",
};

/** Vignette de marque, ou rien du tout plutôt qu'un carré vide. */
function Logo({ name }: { name: string }) {
  const src = LOGOS[name];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={128}
      height={128}
      loading="lazy"
      alt=""
      aria-hidden
      className="size-8 shrink-0 object-contain"
    />
  );
}

function Chapter(
  { n, title, children, tint }: {
    n: string;
    title: string;
    tint?: string;
    children: React.ReactNode;
  },
) {
  return (
    <section
      className="w-full border-t border-border py-20 sm:py-28"
      style={tint ? { backgroundColor: tint } : undefined}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5">
        <BlurFade inView>
          <div className="flex flex-col gap-3">
            <span className="num text-xs uppercase tracking-wide text-primary">
              Chapitre {n}
            </span>
            <h2 className="text-pretty text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
              {title}
            </h2>
          </div>
        </BlurFade>
        {children}
      </div>
    </section>
  );
}

export default function ScrollPage() {
  return (
    <main id="contenu" className="pb-32">
      {/* ── Page de titre ──────────────────────────────────────────────── */}
      {
        /* Le dock flotte en bas de fenêtre : le premier écran se centre et
          garde 8 rem sous lui, sinon les boutons passent dessous. */
      }
      <header className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-8 px-5 pb-32 pt-24">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <KineticText
            text={IDENTITY.name}
            className="text-5xl tracking-[-0.035em] sm:text-6xl"
          />
        </BlurFade>
        <BlurFade delay={0.12}>
          {
            /* Les retours à la ligne sont écrits, pas laissés à l'équilibrage :
              une promesse coupée en deux se lit comme une coquille. */
          }
          <p className="text-balance text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-3xl">
            Je livre seul, jusqu’en production.
            <br />
            <span className="text-primary">
              Du schéma de données au magasin d’applications.
            </span>
          </p>
        </BlurFade>
        <BlurFade delay={0.2}>
          <Clock />
        </BlurFade>
        <BlurFade delay={0.28}>
          <div className="flex flex-col gap-4">
            <p className="num text-xs uppercase tracking-wide text-muted-foreground">
              {HIRING.availability} · Français, anglais, espagnol
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ParticleButton href="#contact">Me contacter</ParticleButton>
              <Link href="/" className={secondaryButton}>
                Lire la version courte
              </Link>
            </div>
          </div>
        </BlurFade>
      </header>

      {/* ── I · PoolCenter ─────────────────────────────────────────────── */}
      <Chapter n="I" title="Une application en production, portée seul.">
        <BlurFade inView>
          <div className="flex flex-col gap-5">
            <p className="text-pretty text-lg leading-relaxed">
              PoolCenter est le sujet même de mon stage chez Piscine Center,
              certifié par 42 et par l’entreprise : un logiciel métier pour les
              professionnels de l’entretien de piscines.
            </p>
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              Flutter sur le web, Android et iOS, sur Supabase : PostgreSQL avec
              politiques RLS, Auth, Storage, Edge Functions en Deno, Realtime,
              Vault. Mode hors-ligne, rapports PDF au format carnet sanitaire,
              portail client, planning.
            </p>
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              Autour : intégration continue avec analyse statique, tests
              Flutter, Deno et SQL, analyse de composition logicielle, DAST,
              sauvegarde PostgreSQL automatisée et test de restauration. Chaque
              correctif est adossé à un test dont la mutation vérifie qu’il
              échoue sans lui.
            </p>
          </div>
        </BlurFade>

        <BlurFade inView>
          <figure className="flex flex-col gap-3">
            <a
              href="https://poolcenter.app"
              target="_blank"
              rel="noreferrer"
              className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/scroll-media/pc-site.webp"
                width={1600}
                height={911}
                loading="lazy"
                alt="Page d’accueil de poolcenter.app : le titre du produit, une maquette du rapport d’entretien sur navigateur et une fiche d’analyses chimiques sur téléphone."
                className="w-full rounded-xl border border-border transition-colors group-hover:border-primary"
              />
            </a>
            <figcaption className="text-sm text-muted-foreground">
              <span className="num">poolcenter.app</span>, en production —
              ouvrir le site.
            </figcaption>
          </figure>
        </BlurFade>

        <BlurFade inView>
          <figure className="flex flex-col gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/scroll-media/pc-planning.webp"
              width={1800}
              height={1069}
              loading="lazy"
              alt="Le planning mensuel de PoolCenter : menu latéral épinglé, cinq piscines en lignes, les jours ouvrés de septembre en colonnes, un pastillage par passage prévu, fait ou manqué."
              className="w-full rounded-xl border border-border"
            />
            <figcaption className="text-sm leading-relaxed text-muted-foreground">
              Le planning du mois, dans l’application. Jeu de démonstration :
              aucune donnée de client réel.
            </figcaption>
          </figure>
        </BlurFade>

        <BlurFade inView>
          <dl className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card px-5 sm:px-6">
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Version</dt>
              <dd className="num text-sm font-medium">{POOLCENTER.version}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Plateformes</dt>
              <dd className="num text-sm font-medium">web, Android, iOS</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Diffusion</dt>
              <dd className="text-sm font-medium">
                bêta fermée, en conditions réelles
              </dd>
            </div>
          </dl>
        </BlurFade>
      </Chapter>

      {/* ── II · Topologie, le seul acte épinglé ───────────────────────── */}
      {
        /* Pleine largeur, pas la colonne de lecture : le schéma est le pic de
          la page, et à 672 px il se lisait comme une vignette. */
      }
      <section className="w-full border-t border-border">
        <div className="mx-auto w-full max-w-5xl px-5">
          <Topology />
        </div>
      </section>

      <section className="w-full py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5">
          <BlurFade inView>
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              Même principe chez GPI France : les licences KeyMaster se valident
              {" "}
              <strong className="font-medium text-foreground">
                hors ligne
              </strong>{" "}
              par signature ECDSA, parce qu’un CHU déploie sans accès Internet.
              Et dans PoolCenter : RLS, Vault, DAST, mode hors-ligne. Trois
              contextes, une même spécialité : le logiciel sous contrainte de
              sécurité, souvent en environnement fermé.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── III · Parcours ────────────────────────────────────────────── */}
      <Chapter
        n="III"
        title="Deux stages de six mois, un cursus, une entreprise."
      >
        <BlurFade inView>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {MISSIONS.map((m) => (
              <article
                key={m.name}
                className="relative flex flex-col gap-3 p-5 sm:p-6"
              >
                <ProjectPointer kind={m.pointer} />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Logo name={m.company} />
                    <h3 className="text-lg font-semibold tracking-tight">
                      {m.name}
                    </h3>
                  </div>
                  <span className="num shrink-0 text-sm text-muted-foreground">
                    {m.period}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {m.company}
                </p>
                <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                  {m.body}
                </p>
                <TagRow items={m.stack} />
              </article>
            ))}
          </div>
        </BlurFade>

        <BlurFade inView>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {EDUCATION.map((e) => (
              <article
                key={e.school}
                className="relative flex flex-col gap-3 p-5 sm:p-6"
              >
                <ProjectPointer kind="school" />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Logo name={e.school} />
                    <h3 className="text-lg font-semibold tracking-tight">
                      {e.school}
                    </h3>
                  </div>
                  <span className="num shrink-0 text-sm text-muted-foreground">
                    {e.period}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {e.title}
                </p>
                <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                  {e.body}
                </p>
              </article>
            ))}
          </div>
        </BlurFade>
      </Chapter>

      {/* ── Technologies : la sphère du portfolio ──────────────────────── */}
      <Chapter n="IV" title="Ce que j’ai réellement pratiqué.">
        <BlurFade inView>
          <div className="flex flex-col gap-6">
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              La sphère tourne seule et se laisse attraper à la souris. La liste
              en dessous dit la même chose, en lisible. Rien n’y figure sans un
              projet derrière.
            </p>
            <IconCloud
              label="Sphère des technologies employées"
              images={STACK_ICON_URLS}
            />
            {SKILL_GROUPS.map((group) => (
              <div key={group.name} className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {group.name}
                </h3>
                <TagRow items={group.items} />
              </div>
            ))}
          </div>
        </BlurFade>
      </Chapter>

      {/* ── Colophon ───────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="w-full border-t border-border py-24 sm:py-32"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between">
          <BlurFade inView>
            <div className="flex flex-col gap-5">
              <p className="text-pretty text-xl leading-snug">
                Je cherche un poste de développeur, en remote, aux heures de
                Paris. Si votre équipe a besoin de quelqu’un qui livre seul et
                code sûr par construction, écrivez-moi.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <ParticleButton href="/#contact">Me contacter</ParticleButton>
                <Link href="/parcours/" className={secondaryButton}>
                  Le parcours détaillé
                </Link>
              </div>
              <p className="measure text-sm leading-relaxed text-muted-foreground">
                Tout ce qui est écrit ici est vérifiable : dépôts publics,
                conventions de stage, soutenance filmée.
              </p>
            </div>
          </BlurFade>
          <BlurFade inView>
            <figure className="flex w-40 shrink-0 flex-col gap-3 sm:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/scroll-media/portrait.webp"
                width={720}
                height={720}
                loading="lazy"
                alt="Portrait de Paul Hudyka."
                className="w-full rounded-2xl border border-border object-cover"
              />
              <figcaption className="text-xs leading-relaxed text-muted-foreground">
                Image générée à partir de photos, pas une photographie.
              </figcaption>
            </figure>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
