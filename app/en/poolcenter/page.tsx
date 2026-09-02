import type { Metadata } from "next";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import Contact, { COPY_EN } from "@/components/section/contact";
import {
  Column,
  DataRow,
  Hero,
  Section,
  TagRow,
} from "@/components/ui/kit";
import { POOLCENTER_EN } from "@/data/content.en";

export const metadata: Metadata = {
  title: "PoolCenter",
  description:
    "Field-service application for professional pool maintenance: one Flutter codebase for web, Android and iOS on Supabase, with offline mode and regulatory PDF reports.",
  alternates: {
    canonical: "/en/poolcenter/",
    languages: { fr: "/poolcenter/", en: "/en/poolcenter/" },
  },
};

export default function PoolCenterEnPage() {
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
            A working day on three platforms, offline included, with the
            compliance report generated at the end of the visit.
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {POOLCENTER_EN.role}
          </p>
        </BlurFade>
      </Hero>

      <Section
        id="problem"
        reveal
        title="The problem"
        lead="Why the application exists at all."
      >
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {POOLCENTER_EN.problem}
        </p>
      </Section>

      <Section
        id="engineering"
        title="How it is built"
        lead="The part a technical reader came for."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {POOLCENTER_EN.engineering.map((block) => (
            <article
              key={block.title}
              className="flex flex-col gap-2 p-5 sm:p-6"
            >
              <h3 className="font-medium">{block.title}</h3>
              <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            </article>
          ))}
        </div>
        <TagRow items={POOLCENTER_EN.stack} />
      </Section>

      <Section id="status" title="Status">
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          <DataRow label="Version" value={POOLCENTER_EN.version} />
          <DataRow label="Distribution" value={POOLCENTER_EN.phase} />
          <DataRow label="Public site" value="poolcenter.app" />
        </dl>
        <p className="text-sm leading-relaxed text-muted-foreground">
          No search in either store finds the application yet: it is distributed
          to invited testers only, and it is in real-world use by professionals.
        </p>
      </Section>

      <Section
        id="contact"
        title="Get in touch"
        lead="Happy to walk through any part of this in detail."
      >
        <Contact copy={COPY_EN} />
      </Section>
    </Column>
  );
}
