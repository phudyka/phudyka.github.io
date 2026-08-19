import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { KineticText } from "@/components/magicui/kinetic-text";
import Contact from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import { Column, Section, TagRow } from "@/components/ui/kit";
import { ACTIVITIES, CLIENT, IDENTITY, PILLARS } from "@/data/content";

export default function Home() {
  return (
    <Column>
      <section id="contenu" className="flex flex-col gap-6">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1.5">
            {
              /* Le seul moment orchestré du site : le nom se pose avant tout le
                reste, et c’est aussi le seul endroit où la typographie bouge —
                la lettre survolée s’épaissit et entraîne ses voisines. */
            }
            <BlurFade duration={0.7} blur="12px" yOffset={10}>
              <KineticText
                text={IDENTITY.name}
                className="text-4xl font-[500] tracking-[-0.035em] sm:text-5xl"
              />
            </BlurFade>
            <BlurFade duration={0.6} delay={0.12}>
              <p className="text-sm text-muted-foreground sm:text-base">
                {IDENTITY.role}
              </p>
            </BlurFade>
          </div>
          <BlurFade duration={0.7} delay={0.06}>
            <img
              src="/paul-hudyka.webp"
              srcSet="/paul-hudyka@1x.webp 256w, /paul-hudyka.webp 512w"
              sizes="(min-width: 640px) 96px, 80px"
              alt=""
              width={512}
              height={512}
              className="size-20 rounded-full border border-border object-cover sm:size-24"
            />
          </BlurFade>
        </div>

        <BlurFade delay={0.2}>
          <p className="text-balance text-2xl font-medium leading-snug tracking-[-0.018em] sm:text-[1.65rem]">
            {IDENTITY.headline}
          </p>
        </BlurFade>

        {
          /* La garantie de topologie tient sa propre place, juste après l’accroche :
            c’est l’argument que le visiteur doit emporter. Elle se distingue par le
            poids et la couleur, pas par un filet coloré. */
        }
        <BlurFade delay={0.26}>
          <p className="max-w-[60ch] text-pretty text-lg font-medium leading-relaxed tracking-[-0.008em]">
            {IDENTITY.guarantee}
          </p>
        </BlurFade>

        <BlurFade delay={0.32}>
          <p className="max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {IDENTITY.subhead}{" "}
            <span className="text-foreground/80">{IDENTITY.proof}</span>
          </p>
        </BlurFade>

        <BlurFade delay={0.38}>
          <div className="flex flex-wrap items-center gap-3">
            <InteractiveHoverButton href="#contact">
              Demander un devis
            </InteractiveHoverButton>
            <Link
              href="/halfred/"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium transition-colors duration-150 hover:border-foreground/25 hover:bg-accent active:translate-y-px"
            >
              Voir les offres et les prix
            </Link>
          </div>
        </BlurFade>
      </section>

      <Section
        id="activites"
        reveal
        title="Deux activités"
        lead="Une prestation qui installe l’IA chez vous, et un produit que je construis et fais vivre. Elles se financent différemment et ne se mélangent pas."
      >
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {ACTIVITIES.map((activity) => (
            <Link
              key={activity.slug}
              href={activity.href + "/"}
              className="group flex flex-col gap-3 p-5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent/60 sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  {activity.name}
                  <ArrowUpRight
                    className="size-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </h3>
                <span className="num shrink-0 text-right text-sm font-medium text-muted-foreground">
                  {activity.figure.value}
                </span>
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {activity.summary}
              </p>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground/80">
                {activity.detail}
              </p>
              <TagRow items={activity.marks} />
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="preuve"
        title="Ce qui tourne déjà, chez un vrai client"
        lead={`${CLIENT.name} — ${CLIENT.trade}, en activité depuis ${CLIENT.since}. ${CLIENT.status}.`}
      >
        <div className="flex flex-col gap-4 border-l border-border pl-5">
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {CLIENT.problem}
          </p>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {CLIENT.delivered}
          </p>
          {
            /* Peep reste hors ligne : PRODUCT.md classe sa publication parmi les
              décisions non tranchées et en garde la description. Ne pas la
              remonter ici sans accord explicite de Paul. */
          }
        </div>
      </Section>

      <Section
        id="methode"
        title="Comment ça se passe"
        lead="Trois façons d’entrer, selon ce que vous savez déjà de votre besoin."
      >
        <dl className="flex flex-col divide-y divide-border">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.name}
              className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0"
            >
              <dt className="font-medium">{pillar.name}</dt>
              <dd className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {pillar.body}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="contact"
        title="Parlons du process qui vous coûte le plus"
        lead="Décrivez-le en trois lignes. Je réponds sous 48 heures ouvrées avec un cadrage, pas avec une plaquette."
      >
        <Contact />
      </Section>

      <LegalFooter />
    </Column>
  );
}
