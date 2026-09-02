import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import Contact from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import {
  Bento,
  BentoCell,
  Column,
  DataRow,
  Hero,
  HeroActions,
  secondaryButton,
  Section,
  TagRow,
  Timeline,
} from "@/components/ui/kit";
import { POOLCENTER } from "@/data/content";

export const metadata: Metadata = {
  title: "PoolCenter",
  description:
    "Application métier de gestion d’interventions pour les professionnels de l’entretien de piscines : planning, saisie terrain, rapports sanitaires, portail client. Bêta privée saison 2026.",
  alternates: {
    canonical: "/poolcenter/",
    languages: { fr: "/poolcenter/", en: "/en/poolcenter/" },
  },
};

export default function PoolCenterPage() {
  return (
    <Column>
      <Hero>
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <KineticText
            text="PoolCenter"
            className="justify-center text-5xl tracking-tight sm:text-6xl"
          />
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-balance text-xl font-medium leading-snug tracking-tight sm:text-2xl">
            Le carnet sanitaire, le planning et la preuve de passage dans la
            poche de l’intervenant — même sans réseau.
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {POOLCENTER.problem}
          </p>
        </BlurFade>
        <BlurFade delay={0.26}>
          <HeroActions>
            <ParticleButton href="#contact">Demander un devis</ParticleButton>
            <a
              href={POOLCENTER.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group ${secondaryButton}`}
            >
              poolcenter.app
              <ArrowUpRight
                className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                aria-hidden
              />
            </a>
          </HeroActions>
        </BlurFade>
      </Hero>

      {
        /* L’ouverture du corps de cette page est une journée d’intervention,
          pas une liste de fonctions : le pisciniste doit reconnaître sa propre
          journée avant qu’on lui décrive un périmètre. Le périmètre complet
          suit, en bento. */
      }
      <Section
        id="journee"
        reveal
        title="Une journée, du planning au rapport"
        lead="Ce que l’application change se lit dans l’ordre où la journée arrive, pas dans une liste de fonctionnalités."
      >
        <div className="flex flex-col gap-5">
          {
            /* Le seul bloc à pleine force de la page. La contrainte
              réglementaire est ce qui rend l’outil non négociable ; tout le
              reste du corps est en couleur secondaire. */
          }
          <p className="max-w-[60ch] text-pretty text-lg font-medium leading-relaxed tracking-[-0.008em]">
            Tout ce qui n’est pas saisi pendant le passage se ressaisit le soir,
            de mémoire, au bureau. C’est exactement là que le carnet sanitaire
            se troue.
          </p>
          <Timeline items={POOLCENTER.day} />
        </div>
      </Section>

      <Section
        id="statut"
        title="Statut"
        lead="La vitrine produit est en ligne et consultable. L’application, elle, est en test terrain chez des professionnels : l’accès se fait sur invitation, avant commercialisation."
      >
        <dl className="flex flex-col">
          <DataRow label="Version" value={POOLCENTER.version} />
          <DataRow label="Phase" value={POOLCENTER.phase} />
          <DataRow label="Plateformes" value="Web, Android, iOS, tablette" />
          <DataRow label="Accès" value={POOLCENTER.access} />
          <DataRow label="Structure" value="En cours d’immatriculation" />
        </dl>
      </Section>

      <Section
        id="fonctionnalites"
        title="Ce que l’application couvre"
        lead="Du planning du matin au rapport PDF envoyé au propriétaire le soir."
      >
        <Bento>
          {POOLCENTER.features.map((feature) => (
            <BentoCell
              key={feature.name}
              title={feature.name}
              span={feature.span}
            >
              {feature.body}
            </BentoCell>
          ))}
        </Bento>
      </Section>

      <Section
        id="technique"
        title="Construit sur"
        lead="Une base de code unique pour le mobile, la tablette et le navigateur. Le web est la cible de production."
      >
        <TagRow items={POOLCENTER.stack} />
      </Section>

      <Section
        id="contact"
        title="Vous entretenez des piscines ?"
        lead="La bêta se remplit par cooptation. Écrivez-moi ce que vous gérez aujourd’hui, et sur quel outil."
      >
        <Contact />
      </Section>

      <LegalFooter />
    </Column>
  );
}
