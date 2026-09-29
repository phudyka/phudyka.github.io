import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import FeatureCarousel from "@/components/scroll/feature-carousel";
import Contact, { COPY_EN, COPY_FR_EMPLOI } from "@/components/section/contact";
import {
  BRAND_LOGO,
  Column,
  DataRow,
  Hero,
  HeroActions,
  secondaryButton,
  Section,
  TagRow,
} from "@/components/ui/kit";
import * as FR from "@/data/content";
import * as EN from "@/data/content.en";

/**
 * L’accueil, rendu une fois pour les deux langues : les données viennent de
 * `data/content.ts` / `data/content.en.ts`, les libellés de la table ci-dessous.
 */
type Lang = "fr" | "en";

const DATA = {
  fr: {
    d: { HIRING: FR.HIRING, OVERLAP: FR.OVERLAP, SHIPPED: FR.SHIPPED, LOOKING_FOR: FR.LOOKING_FOR, SHOTS: FR.SHOTS },
    contact: COPY_FR_EMPLOI,
    cta: "Me contacter",
    parcours: ["/parcours/", "Voir le parcours complet"],
    scroll: ["/scroll/", "Lire en défilement"],
    hours: ["horaires", "Horaires", `Je travaille ${FR.OVERLAP.base}. Pour une équipe ailleurs, voici où nos journées se recouvrent.`],
    hoursTail: null,
    shipped: ["realisations", "Ce que j’ai construit", "Trois travaux, chacun entre les mains de quelqu’un d’autre que moi."],
    shots: "Écrans de PoolCenter",
    looking: ["recherche", "Ce que je cherche", "Dit franchement, pour qu’aucun de nous deux ne le découvre en entretien."],
    contactSection: ["Me contacter", "Un lien vers l’annonce suffit pour commencer. Je réponds sous deux jours ouvrés."],
    footer: (
      <footer className="flex flex-col gap-2 border-t border-border pt-8 text-sm text-muted-foreground">
        <p>{FR.HIRING.availability}.</p>
        <p>
          Vous cherchez un prestataire plutôt qu’un salarié ?{" "}
          <Link
            href="/halfred/offres/"
            className="underline underline-offset-4"
          >
            Les offres et les tarifs de Halfred
          </Link>{" "}
          sont publics.
        </p>
      </footer>
    ),
  },
  en: {
    d: { HIRING: EN.HIRING, OVERLAP: EN.OVERLAP, SHIPPED: EN.SHIPPED, LOOKING_FOR: EN.LOOKING_FOR, SHOTS: EN.SHOTS_EN },
    contact: COPY_EN,
    cta: "Get in touch",
    parcours: ["/en/experience/", "See the full background"],
    scroll: ["/en/scroll/", "Read it scrolling"],
    hours: ["hours", "Working hours", `I work ${EN.OVERLAP.base}. For your team, that is when our days overlap.`],
    hoursTail: "If your team needs someone awake while it sleeps, that is the overlap.",
    shipped: ["shipped", "What I have shipped", "Three pieces of work, each of them in the hands of someone who is not me."],
    shots: "PoolCenter screens",
    looking: ["looking-for", "What I am looking for", "Stated plainly, so neither of us wastes a call finding out."],
    contactSection: ["Get in touch", "A link to the posting is enough to start. I answer within two working days."],
    footer: (
      <footer className="border-t border-border pt-8 text-sm text-muted-foreground">
        <p>
          {EN.HIRING.availability}. This page is the English side of a bilingual
          site; the French one presents my independent activity.
        </p>
      </footer>
    ),
  },
} as const;

export function HomeBody({ lang }: { lang: Lang }) {
  const t = DATA[lang];
  const { HIRING, OVERLAP, SHIPPED, LOOKING_FOR, SHOTS } = t.d;
  return (
    <Column>
      <Hero>
        <BlurFade duration={0.7} delay={0.06}>
          {
            /* `next/image` n’apporte rien ici : l’export statique impose
              `unoptimized`, donc le composant se contenterait d’émettre cette
              même balise en perdant le `srcSet` écrit à la main — les deux
              seules variantes qui existent réellement dans `public/`. */
          }
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

        {
          /* Le seul moment orchestré du site : le nom se pose avant tout le
            reste, et c’est aussi le seul endroit où la typographie bouge — la
            lettre survolée s’épaissit et entraîne ses voisines. */
        }
        <div className="flex flex-col gap-1.5">
          <BlurFade duration={0.7} blur="12px" yOffset={10}>
            <KineticText
              text={FR.IDENTITY.name}
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
            <ParticleButton href="#contact">{t.cta}</ParticleButton>
            <Link href={t.parcours[0]} className={secondaryButton}>
              {t.parcours[1]}
            </Link>
            {
              /* Même dossier, lecture longue : des chapitres, et un acte
                épinglé où le réseau se ferme sous le curseur du lecteur. */
            }
            <Link href={t.scroll[0]} className={secondaryButton}>
              {t.scroll[1]}
            </Link>
          </HeroActions>
        </BlurFade>
      </Hero>

      {
        /* L’argument le plus rare du dossier passe avant les réalisations : une
          entreprise qui cherche une couverture horaire n’a pas à lire trois
          projets pour savoir si le candidat est compatible avec son équipe. */
      }
      <Section id={t.hours[0]} reveal title={t.hours[1]} lead={t.hours[2]}>
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {OVERLAP.rows.map((row) => (
            <DataRow key={row.zone} label={row.zone} value={row.hours} />
          ))}
        </dl>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {OVERLAP.note}
          {t.hoursTail && <>{" "}{t.hoursTail}</>}
        </p>
      </Section>

      <Section id={t.shipped[0]} title={t.shipped[1]} lead={t.shipped[2]}>
        {/* Les écrans d'abord : un recruteur regarde avant de lire. */}
        <FeatureCarousel shots={SHOTS} label={t.shots} />
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
                  {item.slug in BRAND_LOGO
                    ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={BRAND_LOGO[item.slug as keyof typeof BRAND_LOGO]}
                        alt=""
                        width={192}
                        height={192}
                        className="size-6 rounded-md"
                      />
                    )
                    : null}
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
              <TagRow items={item.stack} />
            </Link>
          ))}
        </div>
      </Section>

      <Section id={t.looking[0]} title={t.looking[1]} lead={t.looking[2]}>
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {LOOKING_FOR.map((row) => (
            <DataRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
      </Section>

      <Section
        id="contact"
        title={t.contactSection[0]}
        lead={t.contactSection[1]}
      >
        <Contact copy={t.contact} />
      </Section>

      {t.footer}
    </Column>
  );
}
