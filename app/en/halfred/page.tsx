import type { Metadata } from "next";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import Contact, { COPY_EN } from "@/components/section/contact";
import {
  Column,
  Hero,
  Section,
  TagRow,
} from "@/components/ui/kit";
import { HALFRED_EN } from "@/data/content.en";

export const metadata: Metadata = {
  title: "Halfred",
  description:
    "Bespoke AI agents that run on the customer’s own machines, with no outbound network path. What is built, and the design decisions behind it.",
  alternates: {
    canonical: "/en/halfred/",
    languages: { fr: "/halfred/", en: "/en/halfred/" },
  },
};

export default function HalfredEnPage() {
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
            AI agents that run on the customer’s machines, with no path by which
            their data could leave.
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {HALFRED_EN.what}
          </p>
        </BlurFade>
      </Hero>

      <Section
        id="topology"
        reveal
        title="The guarantee is topological, so it can be checked"
        lead="Most offerings ask you to trust the model. This one asks nothing: it shows you the installation."
      >
        <p className="max-w-[60ch] text-pretty text-lg font-medium leading-relaxed tracking-[-0.008em]">
          There is no network path by which a customer’s data could leave. That
          is the guarantee — not a promise, a topology.
        </p>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {HALFRED_EN.topology}
        </p>
      </Section>

      <Section
        id="injection"
        title="Pricing never goes through the model"
        lead="The design decision that matters, and the one that neutralises prompt injection."
      >
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {HALFRED_EN.injection}
        </p>
      </Section>

      <Section
        id="customer"
        title="First customer"
        lead="One, with its real status. There will not be a second one on this page until it exists."
      >
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {HALFRED_EN.client}
        </p>
        <TagRow items={HALFRED_EN.stack} />
      </Section>

      <Section
        id="contact"
        title="Get in touch"
        lead="If this kind of constrained-agent work is what your team needs, the conversation starts here."
      >
        <Contact copy={COPY_EN} />
      </Section>

      <footer className="border-t border-border pt-8 text-sm text-muted-foreground">
        <p>
          Halfred is my independent activity, registered in France. Scopes and
          prices are public on{" "}
          <Link href="/halfred/offres/" className="underline underline-offset-4">
            the French offers page
          </Link>
          .
        </p>
      </footer>
    </Column>
  );
}
