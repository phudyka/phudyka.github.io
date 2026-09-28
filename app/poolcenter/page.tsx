import FeatureCarousel from "@/components/scroll/feature-carousel";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { ParticleButton } from "@/components/magicui/particle-button";
import Contact, { COPY_FR_POOLCENTER } from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import {
  Bento,
  BRAND_LOGO,
  BrandTitle,
  BentoCell,
  Column,
  DataRow,
  Hero,
  HeroActions,
  secondaryButton,
  Section,
  TagRow,
} from "@/components/ui/kit";
import { POOLCENTER, SHOTS } from "@/data/content";

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
    <Column brand="poolcenter">
      <Hero>
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <BrandTitle text="PoolCenter" logo={BRAND_LOGO.poolcenter} />
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

      {/* Montrer avant de décrire : l'écran réel, sur le compte de démonstration. */}
      <BlurFade delay={0.32}>
        <FeatureCarousel shots={SHOTS} label="Écrans de PoolCenter" />
      </BlurFade>

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
        <Contact copy={COPY_FR_POOLCENTER} />
      </Section>

      <LegalFooter />
    </Column>
  );
}
