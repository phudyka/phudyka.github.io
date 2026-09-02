import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { IconCloud } from "@/components/magicui/icon-cloud";
import ProjectPointer from "@/components/project-pointer";
import Contact, { COPY_EN } from "@/components/section/contact";
import { Column, DataRow, Section, TagRow } from "@/components/ui/kit";
import {
  EDUCATION_EN,
  LANGUAGES_EN,
  MISSIONS_EN,
  SCHOOL_PROJECTS_EN,
  SKILL_GROUPS_EN,
} from "@/data/content.en";
import { STACK_ICON_URLS } from "@/data/content";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Placements, École 42 systems and networking projects, technical skills, education and languages.",
  alternates: {
    canonical: "/en/experience/",
    languages: { fr: "/parcours/", en: "/en/experience/" },
  },
};

export default function ExperiencePage() {
  return (
    <Column>
      <section id="contenu" className="flex flex-col gap-6">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Experience
          </h1>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            What sits behind the two projects on the front page: work delivered
            in companies, a low-level foundation from École 42, and the
            technical detail for anyone who is going to read the code.
          </p>
        </BlurFade>

        {
          /* Comptées à partir des données, jamais saisies : elles ne peuvent
            pas dériver du contenu réel de la page. */
        }
        <BlurFade delay={0.18}>
          <dl className="flex flex-col">
            <DataRow label="Company projects" value={MISSIONS_EN.length} />
            <DataRow
              label="Public École 42 repositories"
              value={SCHOOL_PROJECTS_EN.length}
            />
            <DataRow
              label="Technologies practised"
              value={STACK_ICON_URLS.length}
            />
            <DataRow label="Languages" value={LANGUAGES_EN.length} />
          </dl>
        </BlurFade>
      </section>

      <Section
        id="missions"
        reveal
        title="In companies"
        lead="Three pieces of work at GPI France, from specification to delivery."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {MISSIONS_EN.map((mission) => (
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
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {mission.body}
              </p>
              <TagRow items={mission.stack} />
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="school"
        title="École 42"
        lead="Systems, networking and rendering projects, written with no framework and no library."
      >
        <div className="flex flex-col divide-y divide-border">
          {SCHOOL_PROJECTS_EN.map((project) => (
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
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {project.body}
              </p>
              <TagRow items={project.stack} />
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="skills"
        title="Skills"
        lead="The sphere turns on its own and can be grabbed with the mouse; the list underneath says the same thing, readably."
      >
        <div className="flex flex-col gap-5">
          <IconCloud
            label="Sphere of technologies in use"
            images={STACK_ICON_URLS}
          />
          {SKILL_GROUPS_EN.map((group) => (
            <div key={group.name} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {group.name}
              </h3>
              <TagRow items={group.items} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="education" title="Education">
        <div className="flex flex-col divide-y divide-border">
          {EDUCATION_EN.map((item) => (
            <article
              key={item.school}
              className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-medium">{item.school}</h3>
                <span className="num text-sm text-muted-foreground">
                  {item.period}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="languages" title="Languages">
        <dl className="flex flex-col">
          {LANGUAGES_EN.map((language) => (
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
        title="Get in touch"
        lead="If this background fits a role on your team, the conversation starts here."
      >
        <Contact copy={COPY_EN} />
      </Section>
    </Column>
  );
}
