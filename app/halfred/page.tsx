import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import Contact from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import { Column, DataRow, Section } from "@/components/ui/kit";
import { LEGAL, OFFERS, PILLARS, RATE } from "@/data/content";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Conception et déploiement d’agents IA sur-mesure pour PME : audit, pilote, déploiement en production, run. Prix et périmètres publics.",
};

export default function HalfredPage() {
  return (
    <Column>
      <section id="contenu" className="flex flex-col gap-6">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Halfred
          </h1>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-balance text-2xl font-medium leading-snug tracking-tight sm:text-[1.65rem]">
            Vos process répétitifs reprennent moins de temps, et vos données ne
            sortent jamais de chez vous.
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            Halfred installe des agents IA dans les process des PME. Le gain se
            mesure en heures rendues aux équipes. La garantie qui vient avec —
            vos données restent sur vos machines — n’est pas une clause de
            contrat mais une propriété de l’installation.
          </p>
        </BlurFade>
      </section>

      <Section
        id="topologie"
        reveal
        title="La garantie est topologique, donc vérifiable"
        lead="La plupart des offres vous demandent de faire confiance au modèle. Celle-ci ne vous demande rien : elle vous montre l’installation."
      >
        <div className="flex flex-col gap-4 border-l border-border pl-5">
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Le modèle tourne sur une machine que vous possédez, derrière votre
            propre réseau. Sa sortie vers l’extérieur est fermée : il n’existe
            aucun chemin par lequel une donnée pourrait partir, et cela se
            démontre en rendez-vous, câble par câble et règle par règle.
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
        <nav
          aria-label="Aller à une offre"
          className="mb-4 flex flex-wrap gap-1.5"
        >
          {OFFERS.map((offer) => (
            <a
              key={offer.id}
              href={`#offre-${offer.id}`}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              {offer.name}
              <span className="num text-xs text-muted-foreground">
                {offer.price}
              </span>
            </a>
          ))}
        </nav>

        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {OFFERS.map((offer) => (
            <article
              key={offer.id}
              id={`offre-${offer.id}`}
              className="flex scroll-mt-8 flex-col gap-4 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  {offer.name}
                </h3>
                <p className="num text-lg font-semibold tracking-tight">
                  {offer.price}
                </p>
              </div>

              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {offer.who}
              </p>

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
        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
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
              <dd className="text-pretty text-sm leading-relaxed text-muted-foreground">
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
