import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import Contact, { COPY_EN } from "@/components/section/contact";
import {
  Column,
  DataRow,
  Hero,
  HeroActions,
  secondaryButton,
  Section,
  TagRow,
} from "@/components/ui/kit";
import {
  HIRING,
  LOOKING_FOR,
  OVERLAP,
  SHIPPED,
  SITE_EN,
} from "@/data/content.en";
import { IDENTITY } from "@/data/content";

export const metadata: Metadata = {
  title: "Web & mobile developer",
  description: SITE_EN.description,
  alternates: { canonical: "/en/", languages: { fr: "/", en: "/en/" } },
  openGraph: {
    title: SITE_EN.title,
    description: SITE_EN.description,
    url: SITE_EN.url,
    locale: "en_GB",
    type: "profile",
  },
};

export default function HomeEn() {
  return (
    <Column>
      <Hero>
        <BlurFade duration={0.7} delay={0.06}>
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

        <div className="flex flex-col gap-1.5">
          <BlurFade duration={0.7} blur="12px" yOffset={10}>
            <KineticText
              text={IDENTITY.name}
              className="justify-center text-5xl tracking-[-0.035em] sm:text-6xl"
            />
          </BlurFade>
          <BlurFade duration={0.6} delay={0.12}>
            <p className="text-sm text-muted-foreground sm:text-base">
              {HIRING.role}
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.2}>
          <p className="text-balance text-xl font-medium leading-snug tracking-[-0.018em] sm:text-2xl">
            {HIRING.headline}
          </p>
        </BlurFade>

        <BlurFade delay={0.26}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {HIRING.subhead}{" "}
            <span className="text-foreground">{HIRING.proof}</span>
          </p>
        </BlurFade>

        <BlurFade delay={0.32}>
          <HeroActions>
            <ParticleButton href="#contact">Get in touch</ParticleButton>
            <Link href="/en/experience/" className={secondaryButton}>
              See the full background
            </Link>
          </HeroActions>
        </BlurFade>
      </Hero>

      {
        /*
        L'argument le plus rare du dossier passe en deuxième position, avant
        même les réalisations : un recruteur qui cherche une couverture horaire
        n'a pas besoin de lire trois projets pour savoir si le candidat est
        compatible avec son équipe.
      */
      }
      <Section
        id="hours"
        reveal
        title="Working hours"
        lead={`I work ${OVERLAP.base}. For your team, that is when our days overlap.`}
      >
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {OVERLAP.rows.map((row) => (
            <DataRow key={row.zone} label={row.zone} value={row.hours} />
          ))}
        </dl>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {OVERLAP.note}{" "}
          If your team needs someone awake while it sleeps, that is the overlap.
        </p>
      </Section>

      <Section
        id="shipped"
        title="What I have shipped"
        lead="Three pieces of work, each of them in the hands of someone who is not me."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {SHIPPED.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group flex flex-col gap-3 p-5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent/60 sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  {item.name}
                  <ArrowUpRight
                    className="size-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </h3>
                <span className="num shrink-0 text-right text-sm font-medium text-muted-foreground">
                  {item.figure}
                </span>
              </div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.kind}
              </p>
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
              <TagRow items={item.stack} />
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="looking-for"
        title="What I am looking for"
        lead="Stated plainly, so neither of us wastes a call finding out."
      >
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {LOOKING_FOR.map((row) => (
            <DataRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
      </Section>

      <Section
        id="contact"
        title="Get in touch"
        lead="A link to the posting is enough to start. I answer within two working days."
      >
        <Contact copy={COPY_EN} />
      </Section>

      <footer className="border-t border-border pt-8 text-sm text-muted-foreground">
        <p>
          {HIRING.availability}. This page is the English side of a bilingual
          site; the French one presents my independent activity.
        </p>
      </footer>
    </Column>
  );
}
