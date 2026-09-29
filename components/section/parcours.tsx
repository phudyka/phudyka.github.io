import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { IconCloud } from "@/components/magicui/icon-cloud";
import ProjectPointer from "@/components/project-pointer";
import Contact, { COPY_EN, COPY_FR_EMPLOI } from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import { Column, DataRow, Section, TagRow } from "@/components/ui/kit";
import {
  EDUCATION,
  LANGUAGES,
  MISSIONS,
  SCHOOL_PROJECTS,
  SKILL_GROUPS,
  STACK_ICON_URLS,
} from "@/data/content";
import {
  EDUCATION_EN,
  LANGUAGES_EN,
  MISSIONS_EN,
  SCHOOL_PROJECTS_EN,
  SKILL_GROUPS_EN,
} from "@/data/content.en";

/**
 * `/parcours/` et `/en/experience/`, rendues une fois pour les deux langues :
 * les données viennent de `data/content.ts` / `data/content.en.ts`, les
 * libellés de la table ci-dessous. Seul `/parcours/` porte le pied légal.
 */
const DATA = {
  fr: {
    missions: MISSIONS,
    school: SCHOOL_PROJECTS,
    skills: SKILL_GROUPS,
    education: EDUCATION,
    languages: LANGUAGES,
    contact: COPY_FR_EMPLOI,
    title: "Parcours",
    intro:
      "Ce qu’il y a derrière les deux activités : deux missions en entreprise, un socle bas niveau, et le détail technique pour ceux qui vont regarder le code.",
    stats: ["Missions en entreprise", "Dépôts publics École 42", "Technologies pratiquées", "Langues"],
    missionsId: "missions",
    missionsTitle: "Missions en entreprise",
    missionsLead: "Deux projets menés chez GPI France, de la conception à la livraison.",
    schoolId: "ecole42",
    schoolLead: "Projets systèmes, réseaux et rendu, écrits sans framework et sans bibliothèque.",
    skillsId: "competences",
    skillsTitle: "Compétences",
    skillsLead:
      "La sphère tourne seule et se laisse attraper à la souris ; la liste en dessous dit la même chose, en lisible.",
    cloudLabel: "Sphère des technologies employées",
    educationId: "formation",
    educationTitle: "Formation",
    languagesId: "langues",
    languagesTitle: "Langues",
    contactTitle: "Me contacter",
    contactLead: "Si ce parcours correspond à un poste chez vous, la conversation commence ici.",
  },
  en: {
    missions: MISSIONS_EN,
    school: SCHOOL_PROJECTS_EN,
    skills: SKILL_GROUPS_EN,
    education: EDUCATION_EN,
    languages: LANGUAGES_EN,
    contact: COPY_EN,
    title: "Experience",
    intro:
      "What sits behind the two projects on the front page: work delivered in companies, a low-level foundation from École 42, and the technical detail for anyone who is going to read the code.",
    stats: ["Company projects", "Public École 42 repositories", "Technologies practised", "Languages"],
    missionsId: "missions",
    missionsTitle: "In companies",
    missionsLead: "Three pieces of work at GPI France, from specification to delivery.",
    schoolId: "school",
    schoolLead: "Systems, networking and rendering projects, written with no framework and no library.",
    skillsId: "skills",
    skillsTitle: "Skills",
    skillsLead:
      "The sphere turns on its own and can be grabbed with the mouse; the list underneath says the same thing, readably.",
    cloudLabel: "Sphere of technologies in use",
    educationId: "education",
    educationTitle: "Education",
    languagesId: "languages",
    languagesTitle: "Languages",
    contactTitle: "Get in touch",
    contactLead: "If this background fits a role on your team, the conversation starts here.",
  },
} as const;

export function ParcoursBody({ lang }: { lang: "fr" | "en" }) {
  const t = DATA[lang];
  return (
    <Column>
      <section id="contenu" className="flex flex-col gap-6">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {t.title}
          </h1>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {t.intro}
          </p>
        </BlurFade>

        {
          /* Cette page s’adresse à l’audience secondaire : elle ouvre sur des
            quantités vérifiables plutôt que sur une phrase d’accroche. Les
            valeurs sont comptées à partir des données, jamais saisies à la
            main — elles ne peuvent pas dériver du contenu réel. */
        }
        <BlurFade delay={0.18}>
          <dl className="flex flex-col">
            <DataRow label={t.stats[0]} value={t.missions.length} />
            <DataRow label={t.stats[1]} value={t.school.length} />
            <DataRow label={t.stats[2]} value={STACK_ICON_URLS.length} />
            <DataRow label={t.stats[3]} value={t.languages.length} />
          </dl>
        </BlurFade>
      </section>

      <Section
        id={t.missionsId}
        reveal
        title={t.missionsTitle}
        lead={t.missionsLead}
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {t.missions.map((mission) => (
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

      <Section id={t.schoolId} title="École 42" lead={t.schoolLead}>
        <div className="flex flex-col divide-y divide-border">
          {t.school.map((project) => (
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

      <Section id={t.skillsId} title={t.skillsTitle} lead={t.skillsLead}>
        <div className="flex flex-col gap-5">
          <IconCloud label={t.cloudLabel} images={STACK_ICON_URLS} />
          {t.skills.map((group) => (
            <div key={group.name} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {group.name}
              </h3>
              <TagRow items={group.items} />
            </div>
          ))}
        </div>
      </Section>

      <Section id={t.educationId} title={t.educationTitle}>
        <div className="flex flex-col divide-y divide-border">
          {t.education.map((item) => (
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

      <Section id={t.languagesId} title={t.languagesTitle}>
        <dl className="flex flex-col">
          {t.languages.map((language) => (
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

      <Section id="contact" title={t.contactTitle} lead={t.contactLead}>
        <Contact copy={t.contact} />
      </Section>

      {lang === "fr" && <LegalFooter />}
    </Column>
  );
}
