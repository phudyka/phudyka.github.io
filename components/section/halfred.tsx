import Link from "next/link";
import { ArrowDown, Check } from "lucide-react";
import BlurFade from "@/components/blur-fade";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import Contact, { COPY_EN_HALFRED } from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import {
  Column,
  DataRow,
  Hero,
  HeroActions,
  secondaryButton,
  Section,
  TagRow,
} from "@/components/ui/kit";
import { HALFRED, LEGAL, OFFERS, TERMS } from "@/data/content";
import { HALFRED_EN, OFFERS_EN, TERMS_EN } from "@/data/content.en";

/**
 * Les deux pages Halfred, rendues une fois pour les deux langues : la copie
 * vient de `HALFRED` / `HALFRED_EN`, les prix de `OFFERS` / `OFFERS_EN`. Une
 * seule mise en page empêche la version anglaise de dériver de la française.
 */
type Lang = "fr" | "en";

const DATA = {
  fr: { t: HALFRED, offers: OFFERS, terms: TERMS, contact: undefined },
  en: { t: HALFRED_EN, offers: OFFERS_EN, terms: TERMS_EN, contact: COPY_EN_HALFRED },
} as const;

const body = "measure text-pretty text-sm leading-relaxed text-muted-foreground";

function Items({ items }: { items: ReadonlyArray<{ name: string; body: string }> }) {
  return (
    <dl className="flex flex-col divide-y divide-border">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0"
        >
          <dt className="font-medium">{item.name}</dt>
          <dd className={body}>{item.body}</dd>
        </div>
      ))}
    </dl>
  );
}

/** `/halfred/` : la démarche, ce qui se fait, les garde-fous, le prospect. */
export function HalfredBody({ lang }: { lang: Lang }) {
  const { t } = DATA[lang];
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
            {t.tagline}
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {t.intro}
          </p>
        </BlurFade>
        <BlurFade delay={0.26}>
          <HeroActions>
            <ParticleButton href={`${t.offersHref}#contact`}>
              {t.ctaContact}
            </ParticleButton>
            <Link href={t.offersHref} className={secondaryButton}>
              {t.ctaOffers}
            </Link>
          </HeroActions>
        </BlurFade>
      </Hero>

      <Section id="demarche" reveal title={t.approach.title} lead={t.approach.lead}>
        <ol className="flex flex-col divide-y divide-border">
          {t.approach.steps.map((step, index) => (
            <li
              key={step.name}
              className="flex gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <span
                className="num pt-0.5 text-sm font-medium text-muted-foreground"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-medium">{step.name}</p>
                <p className={body}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="exemples" title={t.quick.title} lead={t.quick.lead}>
        <ul className="flex flex-col gap-1.5">
          {t.quick.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className={body}>{t.quick.hosting}</p>
      </Section>

      <Section id="plus-gros" title={t.bigger.title} lead={t.bigger.lead}>
        <Items items={t.bigger.items} />
      </Section>

      <Section id="garde-fous" title={t.safeguards.title} lead={t.safeguards.lead}>
        <Items items={t.safeguards.items} />
      </Section>

      <Section id="client" title={t.client.title} lead={t.client.lead}>
        <dl className="flex flex-col rounded-xl border border-border bg-card px-5 py-1 sm:px-6">
          {t.client.facts.map((fact) => (
            <DataRow key={fact.label} label={fact.label} value={fact.value} />
          ))}
        </dl>
        {t.client.paragraphs.map((p) => (
          <p key={p} className="measure text-pretty leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
        <TagRow items={t.client.stack} />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.toOffers[0]}
          <Link href={t.offersHref} className="underline underline-offset-4">
            {t.toOffers[1]}
          </Link>
          {t.toOffers[2]}
        </p>
      </Section>

      {lang === "fr" ? <LegalFooter /> : null}
    </Column>
  );
}

/** `/halfred/offres/` : la grille, le détail, les modalités, le contact. */
export function OffresBody({ lang }: { lang: Lang }) {
  const { t, offers, terms, contact } = DATA[lang];
  const o = t.offers;
  return (
    <Column>
      <Hero>
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <KineticText
            text={o.title}
            className="justify-center text-5xl tracking-tight sm:text-6xl"
          />
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-balance text-xl font-medium leading-snug tracking-tight sm:text-2xl">
            {o.tagline}
          </p>
        </BlurFade>
        <BlurFade delay={0.18}>
          <p className="mx-auto max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {o.intro}
          </p>
        </BlurFade>
        <BlurFade delay={0.26}>
          <HeroActions>
            <ParticleButton href="#contact">{o.ctaContact}</ParticleButton>
            <Link href={t.home} className={secondaryButton}>
              {o.ctaBack}
            </Link>
          </HeroActions>
        </BlurFade>

        {
          /* L’ouverture de cette page est sa grille de prix : le visiteur vient
            pour savoir combien, et l’obtient avant de faire défiler. Chaque
            ligne mène au détail de l’offre plus bas. Les lignes restent
            alignées gauche-droite : centrer une grille de prix lui retirerait
            sa colonne de chiffres. */
        }
        <BlurFade delay={0.32}>
          <dl className="mx-auto flex w-full max-w-md flex-col text-left">
            {offers.map((offer) => (
              <a
                key={offer.id}
                href={`#offre-${offer.id}`}
                className="group flex items-baseline justify-between gap-4 border-b border-border/70 py-3 transition-colors last:border-b-0 hover:text-foreground"
              >
                <dt className="flex items-center gap-2 text-sm font-medium">
                  {offer.name}
                  <ArrowDown
                    className="size-3.5 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden
                  />
                </dt>
                <dd className="num shrink-0 text-right text-sm font-semibold">
                  {offer.price}
                </dd>
              </a>
            ))}
          </dl>
        </BlurFade>
      </Hero>

      <Section id="offres" reveal title={o.listTitle} lead={o.listLead}>
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {offers.map((offer, index) => (
            <article
              key={offer.id}
              id={`offre-${offer.id}`}
              className="flex scroll-mt-8 flex-col gap-3 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-baseline gap-2.5 text-lg font-semibold tracking-tight">
                  <span
                    className="num text-sm font-medium text-muted-foreground"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {offer.name}
                </h3>
                <p className="num text-lg font-semibold tracking-tight">
                  {offer.price}
                </p>
              </div>
              {offer.note
                ? <p className="num text-sm text-muted-foreground">{offer.note}</p>
                : null}
              <p className="measure text-pretty leading-relaxed">{offer.who}</p>
              <ul className="flex flex-col gap-1.5">
                {offer.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section id="modalites" title={o.termsTitle}>
        <dl className="flex flex-col">
          {terms.map(([label, value]) => (
            <DataRow key={label} label={label} value={value} />
          ))}
        </dl>
        <p className={`${body} mt-4`}>
          {o.termsNote} {LEGAL.entity}, SIREN{" "}
          <span className="num">{LEGAL.siren}</span>.
        </p>
      </Section>

      <Section id="contact" title={o.contactTitle} lead={o.contactLead}>
        <Contact copy={contact} />
      </Section>

      {lang === "fr" ? <LegalFooter /> : null}
    </Column>
  );
}
