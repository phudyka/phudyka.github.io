import type { Metadata } from "next";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
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
import { CLIENT, PILLARS } from "@/data/content";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Agents IA sur-mesure installés chez le client, le modèle tournant sur sa machine. Ce qui est construit, comment, et pour qui.",
  alternates: {
    canonical: "/halfred/",
    languages: { fr: "/halfred/", en: "/en/halfred/" },
  },
};

/**
 * Halfred, lu comme une réalisation technique.
 *
 * La grille de prix est partie sur `/halfred/offres/` : cette page dit ce que
 * la chose est et comment elle tient, ce qui intéresse autant un employeur
 * qu'un dirigeant. Celui qui vient pour un tarif est à un clic, annoncé dès le
 * premier écran.
 */
export default function HalfredPage() {
  return (
    <Column>
      <Hero>
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <KineticText
            text="Halfred"
            className="justify-center text-5xl tracking-tight sm:text-6xl"
          />
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-balance text-xl font-medium leading-snug tracking-tight sm:text-2xl">
            Des agents IA qui tournent chez vous, sans aucun chemin par lequel
            vos données pourraient sortir.
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            Mon activité indépendante, ouverte en 2026. Conception, installation
            et exploitation d’agents qui écrivent, cherchent et calculent à
            partir des données de l’entreprise — sur ses machines.
          </p>
        </BlurFade>
        <BlurFade delay={0.26}>
          <HeroActions>
            <Link href="/halfred/offres/" className={secondaryButton}>
              Offres et tarifs
            </Link>
            <ParticleButton href="/">Me recruter</ParticleButton>
          </HeroActions>
        </BlurFade>
      </Hero>

      <Section
        id="topologie"
        reveal
        title="La garantie est topologique, donc vérifiable"
        lead="La plupart des offres demandent de faire confiance au modèle. Celle-ci ne demande rien : elle montre l’installation."
      >
        <div className="flex flex-col gap-4">
          <p className="max-w-[60ch] text-pretty text-lg font-medium leading-relaxed tracking-[-0.008em]">
            Il n’existe aucun chemin réseau par lequel une donnée du client
            pourrait sortir. C’est ça, la garantie — pas une promesse, une
            topologie.
          </p>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Le modèle tourne sur une machine que l’entreprise possède, derrière
            son propre réseau, et la sortie vers l’extérieur est fermée : une
            liste blanche réduite à un seul domaine, une étanchéité qui se
            vérifie par test plutôt que par clause. Aucun conteneur n’a d’accès
            direct à Internet.
          </p>
        </div>
      </Section>

      <Section
        id="injection"
        title="Le chiffrage ne passe jamais par le modèle"
        lead="C’est la décision de conception qui compte, et c’est aussi celle qui neutralise l’injection de prompt."
      >
        <p className="text-pretty leading-relaxed text-muted-foreground">
          Un agent qui rédige des devis et qu’on laisse calculer des montants
          est un agent dont une phrase bien tournée dans une pièce jointe peut
          changer le prix. Ici le calcul est confié à un script déterministe :
          le langage naturel reste en entrée et en sortie, jamais au milieu. Une
          consigne cachée dans un document peut faire varier une tournure ; elle
          ne peut pas faire varier un chiffre.
        </p>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          La même règle vaut pour les références : l’agent ne cite que des
          montants et des références réels issus des données de l’entreprise. Ce
          qui manque est signalé comme manquant, jamais comblé.
        </p>
      </Section>

      <Section
        id="client"
        title="Premier prospect"
        lead="Un seul, nommé, avec son statut réel : le devis est émis, rien n’est signé ni encaissé. Il n’y en aura pas un deuxième sur cette page tant qu’il n’existera pas."
      >
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {CLIENT.facts.map((fact) => (
            <DataRow key={fact.label} label={fact.label} value={fact.value} />
          ))}
        </dl>
        <p className="measure text-pretty leading-relaxed text-muted-foreground">
          {CLIENT.problem}
        </p>
        <p className="measure text-pretty leading-relaxed text-muted-foreground">
          {CLIENT.delivered}
        </p>
        <p className="measure text-pretty leading-relaxed text-muted-foreground">
          {CLIENT.second}
        </p>
        <TagRow
          items={[
            "Docker",
            "n8n",
            "Ollama",
            "PostgreSQL",
            "TypeScript",
            "Prisma",
          ]}
        />
      </Section>

      <Section
        id="piliers"
        title="Trois portes d’entrée"
        lead="Selon que l’entreprise cherche à savoir, à déléguer, ou à rendre ses équipes autonomes."
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
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les périmètres, les durées et les prix sont publics :{" "}
          <Link
            href="/halfred/offres/"
            className="underline underline-offset-4"
          >
            offres et tarifs
          </Link>
          .
        </p>
      </Section>

      <LegalFooter />
    </Column>
  );
}
