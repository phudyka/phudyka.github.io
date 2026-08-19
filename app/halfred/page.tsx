import type { Metadata } from "next";
import { ArrowDown, Check, Minus } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { MatrixText } from "@/components/magicui/matrix-text";
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
} from "@/components/ui/kit";
import { LEGAL, OFFERS, PILLARS, RATE } from "@/data/content";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Conception et déploiement d’agents IA sur-mesure pour PME : audit, pilote, déploiement en production, run. Prix et périmètres publics.",
};

export default function HalfredPage() {
  return (
    <Column>
      <Hero>
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            <MatrixText text="Halfred" />
          </h1>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-balance text-xl font-medium leading-snug tracking-tight sm:text-2xl">
            Vos process répétitifs reprennent moins de temps, et vos données ne
            sortent jamais de chez vous.
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            Halfred installe des agents IA dans les process des PME. Le gain se
            mesure en heures rendues aux équipes. La garantie qui vient avec —
            vos données restent sur vos machines — n’est pas une clause de
            contrat mais une propriété de l’installation.
          </p>
        </BlurFade>

        <BlurFade delay={0.26}>
          <HeroActions>
            <ParticleButton href="#contact">Demander un devis</ParticleButton>
            <a href="#offres" className={secondaryButton}>
              Voir le détail des offres
            </a>
          </HeroActions>
        </BlurFade>

        {
          /* L’ouverture de cette page est sa grille de prix : le visiteur vient
            pour savoir combien, et l’obtient avant de faire défiler. Chaque
            ligne mène au détail de l’offre plus bas — ce qui remplace la rangée
            de puces d’ancrage qui doublonnait dans la section Offres. Les
            lignes restent alignées gauche-droite : centrer une grille de prix
            lui retirerait sa colonne de chiffres. */
        }
        <BlurFade delay={0.32}>
          <dl className="mx-auto flex w-full max-w-md flex-col text-left">
            {OFFERS.map((offer) => (
              <a
                key={offer.id}
                href={`#offre-${offer.id}`}
                className="group flex items-baseline justify-between gap-4 border-b border-border/70 py-3 transition-colors last:border-b-0 hover:text-foreground"
              >
                <dt className="flex items-center gap-2 text-sm font-medium">
                  {offer.name}
                  <ArrowDown
                    className="size-3.5 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden
                  />
                </dt>
                <dd className="num shrink-0 text-right text-sm font-semibold">
                  {offer.price}
                </dd>
              </a>
            ))}
          </dl>
        </BlurFade>
      </Hero>

      <Section
        id="topologie"
        reveal
        title="La garantie est topologique, donc vérifiable"
        lead="La plupart des offres vous demandent de faire confiance au modèle. Celle-ci ne vous demande rien : elle vous montre l’installation."
      >
        <div className="flex flex-col gap-4">
          {
            /* Le seul bloc à pleine force de la page : tout le reste du corps
              est en couleur secondaire, donc celui-ci se détache par le poids
              et la couleur, sans filet ni encadré. */
          }
          <p className="max-w-[60ch] text-pretty text-lg font-medium leading-relaxed tracking-[-0.008em]">
            Il n’existe aucun chemin réseau par lequel une de vos données
            pourrait sortir. C’est ça, la garantie — pas une promesse, une
            topologie.
          </p>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Le modèle tourne sur une machine que vous possédez, derrière votre
            propre réseau, et sa sortie vers l’extérieur est fermée. Rien de
            tout cela ne vous demande de me croire : ça se vérifie en
            rendez-vous, câble par câble et règle par règle.
          </p>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            C’est ce que réclament la réglementation et, de plus en plus
            souvent, les donneurs d’ordre qui vous auditent. Pour tout le reste,
            un cloud souverain fait déjà le travail — et je vous le dirai plutôt
            que de vous vendre un déploiement local dont vous n’avez pas besoin.
          </p>
        </div>
      </Section>

      <Section
        id="offres"
        title="Offres"
        lead="Périmètres, durées et prix publics. Tous les montants sont hors taxe, et nets : la TVA n’est pas applicable."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {OFFERS.map((offer, index) => (
            <article
              key={offer.id}
              id={`offre-${offer.id}`}
              className="flex scroll-mt-8 flex-col gap-4 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                {
                  /* Le rang numérote un parcours, pas un classement : les
                    offres se suivent dans l’ordre où on les achète. */
                }
                <h3 className="flex items-baseline gap-2.5 text-lg font-semibold tracking-tight">
                  <span
                    className="num text-sm font-medium text-muted-foreground"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {offer.name}
                </h3>
                <p className="num text-lg font-semibold tracking-tight">
                  {offer.price}
                </p>
              </div>

              {
                /* Ligne de qualification : c’est elle qui dit au visiteur si
                  l’offre est la sienne, donc elle se lit à pleine couleur,
                  avant le tableau de données et la liste de périmètre. */
              }
              <p className="measure text-pretty leading-relaxed">{offer.who}</p>

              <dl className="flex flex-col">
                <DataRow label="Durée" value={offer.duration} />
                <DataRow label="Modèle" value={offer.model} />
                <DataRow label="Tarif" value={offer.priceNote} />
              </dl>

              <ul className="flex flex-col gap-1.5">
                {offer.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
                {offer.excluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Minus className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section id="modalites" title="Modalités">
        <dl className="flex flex-col">
          <DataRow label="Taux journalier de référence" value={RATE.value} />
          <DataRow
            label="Régime de TVA"
            value="Non applicable, art. 293 B du CGI"
          />
          <DataRow label="Validité des devis" value="30 jours" />
          <DataRow
            label="Paiement des forfaits"
            value="30 % à la commande, solde à la livraison"
          />
          <DataRow label="Paiement du Run" value="Mensuel, terme à échoir" />
        </dl>
        <p className="measure mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
          {RATE.note} Les documents commerciaux portent la mention{" "}
          {LEGAL.entity}, SIREN {LEGAL.siren}.
        </p>
      </Section>

      <Section
        id="piliers"
        title="Trois portes d’entrée"
        lead="Selon que vous cherchez à savoir, à déléguer, ou à rendre vos équipes autonomes."
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
        title="Le premier échange est un cadrage, pas un argumentaire"
        lead="Dites-moi ce que vos équipes refont à la main. Je vous dis si l’automatisation vaut le coup, et ce qu’elle coûte."
      >
        <Contact />
      </Section>

      <LegalFooter />
    </Column>
  );
}
