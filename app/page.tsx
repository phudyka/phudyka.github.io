import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import Contact from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import {
  Column,
  DataRow,
  Hero,
  HeroActions,
  secondaryButton,
  Section,
  TagRow,
} from "@/components/ui/kit";
import { ACTIVITIES, CLIENT, IDENTITY, PILLARS } from "@/data/content";

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
            reste, et c’est aussi le seul endroit où la typographie bouge —
            la lettre survolée s’épaissit et entraîne ses voisines. */
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
              {IDENTITY.role}
            </p>
          </BlurFade>
        </div>

        {
          /* PRODUCT.md, principe 1 : le résultat business ouvre. La garantie de
            topologie ne suit plus l’accroche — elle a sa propre section, après
            la preuve, là où elle a quelque chose à prouver. */
        }
        <BlurFade delay={0.2}>
          <p className="text-balance text-xl font-medium leading-snug tracking-[-0.018em] sm:text-2xl">
            {IDENTITY.headline}
          </p>
        </BlurFade>

        <BlurFade delay={0.26}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {IDENTITY.subhead}{" "}
            <span className="text-foreground">{IDENTITY.proof}</span>
          </p>
        </BlurFade>

        <BlurFade delay={0.32}>
          <HeroActions>
            <ParticleButton href="#contact">Demander un devis</ParticleButton>
            {
              /* Le premier écran de /halfred/ porte désormais la grille de prix
                elle-même : le lien vise la page, plus une ancre interne. Le
                libellé promet des prix, le premier écran les livre. */
            }
            <Link href="/halfred/" className={secondaryButton}>
              Voir les offres et les prix
            </Link>
          </HeroActions>
        </BlurFade>
      </Hero>

      <Section
        id="activites"
        reveal
        title="Deux activités"
        lead="Une prestation qui installe l’IA chez vous, et un produit que je construis et fais vivre. Elles se financent différemment et ne se mélangent pas."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {ACTIVITIES.map((activity) => (
            <Link
              key={activity.slug}
              href={activity.href + "/"}
              className="group flex flex-col gap-3 p-5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent/60 sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  {activity.name}
                  <ArrowUpRight
                    className="size-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </h3>
                <span className="num shrink-0 text-right text-sm font-medium text-muted-foreground">
                  {activity.figure.value}
                </span>
              </div>
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {activity.summary}
              </p>
              {
                /* Quatrième palier de gris supprimé : à 14px, `/80` tombait à
                  3,89:1 sur le thème clair, sous le seuil AA. La hiérarchie
                  entre résumé et détail passe par l'ordre, pas par un gris de
                  plus. */
              }
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {activity.detail}
              </p>
              <TagRow items={activity.marks} />
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="preuve"
        title="Ce qui tourne déjà, chez un vrai client"
        lead={`${CLIENT.name} — ${CLIENT.trade}, en activité depuis ${CLIENT.since}. Deux outils livrés, tous les deux sur leurs machines.`}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 border-l border-border pl-5">
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {CLIENT.problem}
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {CLIENT.delivered}
            </p>
            {
              /* Le second outil est décrit par sa fonction et jamais nommé :
                PRODUCT.md classe sa publication nommée parmi les décisions non
                tranchées. Ne pas y ajouter son nom sans accord de Paul. */
            }
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {CLIENT.second}
            </p>
          </div>

          <dl className="flex flex-col">
            {CLIENT.facts.map((fact) => (
              <DataRow
                key={fact.label}
                label={fact.label}
                value={fact.value}
              />
            ))}
          </dl>
        </div>
      </Section>

      {
        /* Le seul bloc à pleine force de la page. Il arrive après la preuve,
          jamais avant : c’est la garantie technique qui prouve le résultat
          annoncé, pas l’inverse. */
      }
      <Section
        id="garantie"
        title="Et vos données ne sont jamais parties"
        lead="C’est la question que pose tout dirigeant à qui l’on propose de l’IA. Voici la réponse, sous une forme vérifiable."
      >
        <div className="flex flex-col gap-4">
          <p className="max-w-[60ch] text-pretty text-lg font-medium leading-relaxed tracking-[-0.008em]">
            {IDENTITY.guarantee}
          </p>
          <p className="max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            Le modèle tourne derrière votre réseau, sa sortie vers l’extérieur
            est fermée. Ce n’est pas une clause de contrat mais une propriété de
            l’installation : elle se démontre câble par câble et règle par
            règle, en rendez-vous.
          </p>
          <Link
            href="/halfred/#topologie"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium"
          >
            Comment cette garantie est installée
            <ArrowUpRight
              className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
              aria-hidden
            />
          </Link>
        </div>
      </Section>

      <Section
        id="methode"
        title="Comment ça se passe"
        lead="Trois façons d’entrer, selon ce que vous savez déjà de votre besoin."
      >
        <dl className="flex flex-col divide-y divide-border">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.name}
              className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0"
            >
              <dt className="font-medium">{pillar.name}</dt>
              <dd className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {pillar.body}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="contact"
        title="Parlons du process qui vous coûte le plus"
        lead="Décrivez-le en trois lignes. Je réponds sous 48 heures ouvrées avec un cadrage, pas avec une plaquette."
      >
        <Contact />
      </Section>

      <LegalFooter />
    </Column>
  );
}
