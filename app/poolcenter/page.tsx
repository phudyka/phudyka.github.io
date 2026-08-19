import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import Contact from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import {
  Bento,
  BentoCell,
  Column,
  DataRow,
  Section,
  TagRow,
} from "@/components/ui/kit";
import { POOLCENTER } from "@/data/content";

export const metadata: Metadata = {
  title: "PoolCenter",
  description:
    "Application métier de gestion d’interventions pour les professionnels de l’entretien de piscines : planning, saisie terrain, rapports sanitaires, portail client. Bêta privée saison 2026.",
};

export default function PoolCenterPage() {
  return (
    <Column>
      <section id="contenu" className="flex flex-col gap-6">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            PoolCenter
          </h1>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-balance text-2xl font-medium leading-snug tracking-tight sm:text-[1.65rem]">
            Le carnet sanitaire, le planning et la preuve de passage dans la
            poche de l’intervenant — même sans réseau.
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {POOLCENTER.problem}
          </p>
        </BlurFade>
        <BlurFade delay={0.26}>
          <a
            href={POOLCENTER.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            poolcenter.app
            <ArrowUpRight
              className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
              aria-hidden
            />
          </a>
        </BlurFade>
      </section>

      <Section
        id="statut"
        reveal
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
