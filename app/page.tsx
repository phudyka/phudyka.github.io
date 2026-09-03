import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import Contact, { COPY_FR_EMPLOI } from "@/components/section/contact";
import {
  Column,
  DataRow,
  Hero,
  HeroActions,
  secondaryButton,
  Section,
  TagRow,
} from "@/components/ui/kit";
import {
  HIRING,
  IDENTITY,
  LOOKING_FOR,
  OVERLAP,
  SHIPPED,
} from "@/data/content";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { fr: "/", en: "/en/" } },
};

/**
 * L’accueil présente un candidat, plus une prestation.
 *
 * Le site vendait Halfred dès la première ligne. Un recruteur arrivant par un
 * CV tombait sur « Vos équipes passent des heures sur des tâches qu’un agent
 * peut reprendre » — une phrase qui ne lui parle pas, et qui l’oblige à
 * chercher ailleurs ce qu’il est venu lire. Le chemin commercial n’a pas
 * disparu : il vit sous `/halfred/` et `/halfred/offres/`, où un dirigeant
 * arrive par le lien ou par la recherche, et où les prix restent publics.
 */
export default function Home() {
  return (
    <Column>
      <Hero>
        <BlurFade duration={0.7} delay={0.06}>
          {
            /* `next/image` n’apporte rien ici : l’export statique impose
              `unoptimized`, donc le composant se contenterait d’émettre cette
              même balise en perdant le `srcSet` écrit à la main — les deux
              seules variantes qui existent réellement dans `public/`. */
          }
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/paul-hudyka.webp"
            srcSet="/paul-hudyka@1x.webp 256w, /paul-hudyka.webp 512w"
            sizes="(min-width: 640px) 96px, 80px"
            alt=""
            width={512}
            height={512}
            className="mx-auto size-20 rounded-full border border-border object-cover sm:size-24"
          />
        </BlurFade>

        {
          /* Le seul moment orchestré du site : le nom se pose avant tout le
            reste, et c’est aussi le seul endroit où la typographie bouge — la
            lettre survolée s’épaissit et entraîne ses voisines. */
        }
        <div className="flex flex-col gap-1.5">
          <BlurFade duration={0.7} blur="12px" yOffset={10}>
            <KineticText
              text={IDENTITY.name}
              className="justify-center text-5xl tracking-[-0.035em] sm:text-6xl"
            />
          </BlurFade>
          <BlurFade duration={0.6} delay={0.12}>
            <p className="text-sm text-muted-foreground sm:text-base">
              {HIRING.role}
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.2}>
          <p className="text-balance text-xl font-medium leading-snug tracking-[-0.018em] sm:text-2xl">
            {HIRING.headline}
          </p>
        </BlurFade>

        <BlurFade delay={0.26}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {HIRING.subhead}{" "}
            <span className="text-foreground">{HIRING.proof}</span>
          </p>
        </BlurFade>

        <BlurFade delay={0.32}>
          <HeroActions>
            <ParticleButton href="#contact">Me contacter</ParticleButton>
            <Link href="/parcours/" className={secondaryButton}>
              Voir le parcours complet
            </Link>
            {
              /* Même dossier, lecture longue : des chapitres, et un acte
                épinglé où le réseau se ferme sous le curseur du lecteur. */
            }
            <Link href="/scroll/" className={secondaryButton}>
              Lire en défilement
            </Link>
          </HeroActions>
        </BlurFade>
      </Hero>

      {
        /* L’argument le plus rare du dossier passe avant les réalisations : une
          entreprise qui cherche une couverture horaire n’a pas à lire trois
          projets pour savoir si le candidat est compatible avec son équipe. */
      }
      <Section
        id="horaires"
        reveal
        title="Horaires"
        lead={`Je travaille ${OVERLAP.base}. Pour une équipe ailleurs, voici où nos journées se recouvrent.`}
      >
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {OVERLAP.rows.map((row) => (
            <DataRow key={row.zone} label={row.zone} value={row.hours} />
          ))}
        </dl>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {OVERLAP.note}
        </p>
      </Section>

      <Section
        id="realisations"
        title="Ce que j’ai construit"
        lead="Trois travaux, chacun entre les mains de quelqu’un d’autre que moi."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {SHIPPED.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group flex flex-col gap-3 p-5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent/60 sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  {item.name}
                  <ArrowUpRight
                    className="size-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </h3>
                <span className="num shrink-0 text-right text-sm font-medium text-muted-foreground">
                  {item.figure}
                </span>
              </div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.kind}
              </p>
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
              {
                /* Quatrième palier de gris toujours proscrit : à 14px, `/80`
                  tombait à 3,89:1 sur le thème clair, sous le seuil AA. La
                  hiérarchie entre résumé et détail passe par l’ordre. */
              }
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
              <TagRow items={item.stack} />
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="recherche"
        title="Ce que je cherche"
        lead="Dit franchement, pour qu’aucun de nous deux ne le découvre en entretien."
      >
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {LOOKING_FOR.map((row) => (
            <DataRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
      </Section>

      <Section
        id="contact"
        title="Me contacter"
        lead="Un lien vers l’annonce suffit pour commencer. Je réponds sous deux jours ouvrés."
      >
        <Contact copy={COPY_FR_EMPLOI} />
      </Section>

      <footer className="flex flex-col gap-2 border-t border-border pt-8 text-sm text-muted-foreground">
        <p>{HIRING.availability}.</p>
        <p>
          Vous cherchez un prestataire plutôt qu’un salarié ?{" "}
          <Link
            href="/halfred/offres/"
            className="underline underline-offset-4"
          >
            Les offres et les tarifs de Halfred
          </Link>{" "}
          sont publics.
        </p>
      </footer>
    </Column>
  );
}
