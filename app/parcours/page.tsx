import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { IconCloud } from "@/components/magicui/icon-cloud";
import ProjectPointer from "@/components/project-pointer";
import Contact from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import { Column, Section, TagRow } from "@/components/ui/kit";
import {
  LANGUAGES,
  MISSIONS,
  SCHOOL_PROJECTS,
  SKILL_GROUPS,
  STACK_ICON_URLS,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Parcours",
  description:
    "Missions en entreprise, projets systèmes et réseaux de l’École 42, compétences techniques et langues de Paul Hudyka.",
};

export default function ParcoursPage() {
  return (
    <Column>
      <section id="contenu" className="flex flex-col gap-6">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Parcours
          </h1>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            Ce qu’il y a derrière les deux activités : deux missions en
            entreprise, un socle bas niveau, et le détail technique pour ceux
            qui vont regarder le code.
          </p>
        </BlurFade>
      </section>

      <Section
        id="missions"
        reveal
        title="Missions en entreprise"
        lead="Deux projets menés chez GPI France, de la conception à la livraison."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {MISSIONS.map((mission) => (
            <article
              key={mission.name}
              className="relative flex flex-col gap-3 p-5 sm:p-6"
            >
              <ProjectPointer kind={mission.pointer} />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  {mission.name}
                </h3>
                <span className="num text-sm text-muted-foreground">
                  {mission.period}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{mission.company}</p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {mission.body}
              </p>
              <TagRow items={mission.stack} />
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="ecole42"
        title="École 42"
        lead="Projets systèmes, réseaux et rendu, écrits sans framework et sans bibliothèque."
      >
        <div className="flex flex-col divide-y divide-border">
          {SCHOOL_PROJECTS.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
            >
              <ProjectPointer kind={project.pointer} />
              <h3 className="flex items-center gap-2 font-medium">
                {project.name}
                <ArrowUpRight
                  className="size-3.5 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden
                />
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {project.body}
              </p>
              <TagRow items={project.stack} />
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="competences"
        title="Compétences"
        lead="La sphère tourne seule et se laisse attraper à la souris ; la liste en dessous dit la même chose, en lisible."
      >
        <div className="flex flex-col gap-5">
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
      </Section>

      <Section id="langues" title="Langues">
        <dl className="flex flex-col">
          {LANGUAGES.map((language) => (
            <div
              key={language.name}
              className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 last:border-b-0"
            >
              <dt className="text-sm font-medium">{language.name}</dt>
              <dd className="text-right text-sm text-muted-foreground">
                {language.level}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="contact"
        title="Ce parcours sert deux activités"
        lead="Si l’une des deux répond à un besoin chez vous, la conversation commence ici."
      >
        <Contact />
      </Section>

      <LegalFooter />
    </Column>
  );
}
