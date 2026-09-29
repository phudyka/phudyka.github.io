import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { KineticText } from "@/components/magicui/kinetic-text";
import { ParticleButton } from "@/components/magicui/particle-button";
import ProjectPointer from "@/components/project-pointer";
import Clock from "@/components/scroll/clock";
import FeatureCarousel from "@/components/scroll/feature-carousel";
import ProductHero from "@/components/scroll/product-hero";
import Topology from "@/components/scroll/topology";
import { secondaryButton, TagRow } from "@/components/ui/kit";
import {
  EDUCATION,
  HIRING,
  IDENTITY,
  MISSIONS,
  POOLCENTER,
  SKILL_GROUPS,
  STACK_ICON_URLS,
  SHOTS,
} from "@/data/content";
import {
  EDUCATION_EN,
  HIRING as HIRING_EN,
  MISSIONS_EN,
  POOLCENTER_EN,
  SHOTS_EN,
  SKILL_GROUPS_EN,
} from "@/data/content.en";

/**
 * Version longue de l'accueil, lue comme un magazine imprimé : des chapitres,
 * des coupes franches entre les fonds, et un seul acte épinglé — le réseau qui
 * se ferme, où le curseur du lecteur devient le paquet.
 *
 * Elle ne remplace pas `/` : les deux disent la même chose, l'une en une page
 * dense, l'autre en six chapitres. Un bouton mène de l'une à l'autre, le dock
 * ramène partout ailleurs.
 *
 * Le contrat « mouvement rare » du site tient toujours : cette page a un seul
 * moment orchestré, comme l'accueil, et c'est l'acte de topologie.
 *
 * Rendue une fois pour `/scroll/` et `/en/scroll/` : seule la copie change,
 * elle vient de `data/content.en.ts` pour tout ce qui est factuel et de `COPY`
 * pour le reste. Les deux pages se répondent par `LANG_PAIRS`.
 */
type Lang = "fr" | "en";

/**
 * Les espaces de tête (« Chapitre », « · Français ») sont voulus : ils gardent
 * le même découpage en nœuds de texte que l'ancien JSX écrit en dur.
 */
const COPY = {
  fr: {
    hiring: HIRING,
    poolcenter: POOLCENTER,
    shots: SHOTS,
    missions: MISSIONS,
    education: EDUCATION,
    skills: SKILL_GROUPS,
    chapter: "Chapitre ",
    tagline: "Je livre seul, jusqu’en production.",
    taglineAccent: "Du schéma de données au magasin d’applications.",
    languages: " · Français, anglais, espagnol",
    contact: "Me contacter",
    home: "/",
    short: "Lire la version courte",
    heroAlt:
      "Page d’accueil de poolcenter.app : le titre du produit, une maquette du rapport d’entretien sur navigateur et une fiche d’analyses chimiques sur téléphone.",
    heroTitle: "Une application en production, portée seul.",
    heroLead:
      "PoolCenter est le sujet même de mon stage chez Piscine Center, certifié par 42 et par l’entreprise : un logiciel métier pour les professionnels de l’entretien de piscines.",
    heroCaption: "poolcenter.app, en production — ouvrir le site.",
    stack:
      "Flutter sur le web, Android et iOS, sur Supabase : PostgreSQL avec politiques RLS, Auth, Storage, Edge Functions en Deno, Realtime, Vault. Mode hors-ligne, rapports PDF au format carnet sanitaire, portail client, planning.",
    quality:
      "Autour : intégration continue avec analyse statique, tests Flutter, Deno et SQL, analyse de composition logicielle, DAST, sauvegarde PostgreSQL automatisée et test de restauration. Chaque correctif est adossé à un test dont la mutation vérifie qu’il échoue sans lui.",
    screens: "Écrans de PoolCenter",
    demo:
      "Compte de démonstration : les bassins, les adresses et les contacts sont fictifs.",
    platforms: "Plateformes",
    release: "Diffusion",
    releaseValue: "bêta fermée, en conditions réelles",
    offline: [
      "Même principe chez GPI France : les licences KeyMaster se valident",
      "hors ligne",
      "par signature ECDSA, parce qu’un CHU déploie sans accès Internet. Et dans PoolCenter : RLS, Vault, DAST, mode hors-ligne. Trois contextes, une même spécialité : le logiciel sous contrainte de sécurité, souvent en environnement fermé.",
    ],
    trackTitle: "Deux stages de six mois, un cursus, une entreprise.",
    stackTitle: "Ce que j’ai réellement pratiqué.",
    sphere:
      "La sphère tourne seule et se laisse attraper à la souris. La liste en dessous dit la même chose, en lisible. Rien n’y figure sans un projet derrière.",
    sphereLabel: "Sphère des technologies employées",
    pitch:
      "Je cherche un poste de développeur, en remote, aux heures de Paris. Si votre équipe a besoin de quelqu’un qui livre seul et code sûr par construction, écrivez-moi.",
    contactHref: "/#contact",
    detailHref: "/parcours/",
    detail: "Le parcours détaillé",
    proof:
      "Tout ce qui est écrit ici est vérifiable : dépôts publics, conventions de stage, soutenance filmée.",
    portraitAlt: "Portrait de Paul Hudyka.",
    portraitCaption: "Image générée à partir de photos, pas une photographie.",
  },
  en: {
    hiring: HIRING_EN,
    poolcenter: POOLCENTER_EN,
    shots: SHOTS_EN,
    missions: MISSIONS_EN,
    education: EDUCATION_EN,
    skills: SKILL_GROUPS_EN,
    chapter: "Chapter ",
    tagline: "I ship on my own, all the way to production.",
    taglineAccent: "From the data schema to the app store.",
    languages: " · French, English, Spanish",
    contact: "Get in touch",
    home: "/en/",
    short: "Read the short version",
    heroAlt:
      "The poolcenter.app home page: the product name, a mockup of the maintenance report in a browser and a water-analysis sheet on a phone.",
    heroTitle: "An application in production, carried alone.",
    heroLead:
      "PoolCenter is the formal subject of my placement at Piscine Center, approved by École 42 and by the company: a field-service application for pool maintenance professionals.",
    heroCaption:
      "poolcenter.app, in production — open the site. The product is French, and so is every screen below.",
    stack:
      "Flutter for web, Android and iOS on Supabase: PostgreSQL with row-level security, Auth, Storage, Edge Functions in Deno, Realtime, Vault. Offline mode, PDF reports in the regulatory logbook format, client portal, scheduling.",
    quality:
      "Around it: continuous integration with static analysis, Flutter, Deno and SQL test suites, software composition analysis, DAST, automated PostgreSQL backups verified by a restore test. Every fix is backed by a test whose mutation proves it fails without it.",
    screens: "PoolCenter screens",
    demo:
      "Demonstration account: the pools, the addresses and the contacts are fictional.",
    platforms: "Platforms",
    release: "Release",
    releaseValue: "closed beta, in real-world use",
    offline: [
      "Same principle at GPI France: KeyMaster licences are validated",
      "offline",
      "through ECDSA signatures, because a teaching hospital deploys with no internet access. And inside PoolCenter: row-level security, Vault, DAST, offline mode. Three settings, one speciality: software under security constraints, often in closed environments.",
    ],
    trackTitle: "Two six-month placements, one course, one company.",
    stackTitle: "What I have actually practised.",
    sphere:
      "The sphere turns on its own and can be caught with the mouse. The list underneath says the same thing, legibly. Nothing is on it without a project behind it.",
    sphereLabel: "Sphere of the technologies used",
    pitch:
      "I am looking for a developer role, fully remote, on Paris hours. If your team needs someone who ships on their own and writes secure software by construction, write to me.",
    contactHref: "/en/#contact",
    detailHref: "/en/experience/",
    detail: "The full track record",
    proof:
      "Everything written here can be checked: public repositories, placement agreements, a filmed defence.",
    portraitAlt: "Portrait of Paul Hudyka.",
    portraitCaption: "Generated from photographs, not a photograph.",
  },
} as const;

/**
 * Un logo par employeur et par école, servi par le site. Les marques restent
 * hors de `data/content.ts` : elles n'ont de sens que sur cette page.
 */
const LOGOS: Record<string, string> = {
  "GPI France": "/logos/gpi-france.webp",
  "École 42 Nice": "/logos/ecole-42.webp",
  "Université Côte d’Azur": "/logos/uca.webp",
};

/** Vignette de marque, ou rien du tout plutôt qu'un carré vide. */
function Logo({ name }: { name: string }) {
  const src = LOGOS[name];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={128}
      height={128}
      loading="lazy"
      alt=""
      aria-hidden
      className="size-8 shrink-0 object-contain"
    />
  );
}

function Chapter(
  { label, n, title, children }: {
    label: string;
    n: string;
    title: string;
    children: React.ReactNode;
  },
) {
  return (
    <section className="w-full border-t border-border py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5">
        <BlurFade inView>
          <div className="flex flex-col gap-3">
            <span className="num text-xs uppercase tracking-wide text-primary">
              {label}{n}
            </span>
            <h2 className="text-pretty text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
              {title}
            </h2>
          </div>
        </BlurFade>
        {children}
      </div>
    </section>
  );
}

export function ScrollBody({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <main id="contenu" className="pb-32">
      {/* ── Page de titre ──────────────────────────────────────────────── */}
      {
        /* Le dock flotte en bas de fenêtre : le premier écran se centre et
          garde 8 rem sous lui, sinon les boutons passent dessous. */
      }
      <header className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-8 px-5 pb-32 pt-24">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <KineticText
            text={IDENTITY.name}
            className="text-5xl tracking-[-0.035em] sm:text-6xl"
          />
        </BlurFade>
        <BlurFade delay={0.12}>
          {
            /* Les retours à la ligne sont écrits, pas laissés à l'équilibrage :
              une promesse coupée en deux se lit comme une coquille. */
          }
          <p className="text-balance text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-3xl">
            {t.tagline}
            <br />
            <span className="text-primary">{t.taglineAccent}</span>
          </p>
        </BlurFade>
        <BlurFade delay={0.2}>
          <Clock lang={lang} />
        </BlurFade>
        <BlurFade delay={0.28}>
          <div className="flex flex-col gap-4">
            <p className="num text-xs uppercase tracking-wide text-muted-foreground">
              {t.hiring.availability}{t.languages}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ParticleButton href="#contact">{t.contact}</ParticleButton>
              <Link href={t.home} className={secondaryButton}>
                {t.short}
              </Link>
            </div>
          </div>
        </BlurFade>
      </header>

      {/* ── I · PoolCenter ─────────────────────────────────────────────── */}
      <section className="w-full border-t border-border py-20 sm:py-28">
        <ProductHero
          src="/scroll-media/pc-site.webp"
          alt={t.heroAlt}
          kicker={`${t.chapter}I`}
          title={t.heroTitle}
          lead={t.heroLead}
          href="https://poolcenter.app"
          caption={t.heroCaption}
        />
      </section>

      <section className="w-full pb-20 sm:pb-28">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5">
          <BlurFade inView>
            <div className="flex flex-col gap-5">
              <p className="measure text-pretty leading-relaxed text-muted-foreground">
                {t.stack}
              </p>
              <p className="measure text-pretty leading-relaxed text-muted-foreground">
                {t.quality}
              </p>
            </div>
          </BlurFade>
        </div>

        {
          /* Le carrousel sort de la colonne de lecture : une capture d’écran
            réduite à 672 px ne montre plus rien de ce qu’elle prouve. */
        }
        <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-4 px-5">
          <BlurFade inView>
            <FeatureCarousel shots={t.shots} label={t.screens} />
          </BlurFade>
          <BlurFade inView>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.demo}
            </p>
          </BlurFade>
        </div>

        <div className="mx-auto mt-10 w-full max-w-2xl px-5">
          <BlurFade inView>
            <dl className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card px-5 sm:px-6">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Version</dt>
                <dd className="num text-sm font-medium">
                  {t.poolcenter.version}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">{t.platforms}</dt>
                <dd className="num text-sm font-medium">web, Android, iOS</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">{t.release}</dt>
                <dd className="text-sm font-medium">{t.releaseValue}</dd>
              </div>
            </dl>
          </BlurFade>
        </div>
      </section>

      {/* ── II · Topologie, le seul acte épinglé ───────────────────────── */}
      {
        /* Pleine largeur, pas la colonne de lecture : le schéma est le pic de
          la page, et à 672 px il se lisait comme une vignette. */
      }
      <section className="w-full border-t border-border">
        <div className="mx-auto w-full max-w-5xl px-5">
          <Topology lang={lang} />
        </div>
      </section>

      <section className="w-full py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5">
          <BlurFade inView>
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              {t.offline[0]}{" "}
              <strong className="font-medium text-foreground">
                {t.offline[1]}
              </strong>{" "}
              {t.offline[2]}
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── III · Parcours ────────────────────────────────────────────── */}
      <Chapter label={t.chapter} n="III" title={t.trackTitle}>
        <BlurFade inView>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {t.missions.map((m) => (
              <article
                key={m.name}
                className="relative flex flex-col gap-3 p-5 sm:p-6"
              >
                <ProjectPointer kind={m.pointer} />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Logo name={m.company} />
                    <h3 className="text-lg font-semibold tracking-tight">
                      {m.name}
                    </h3>
                  </div>
                  <span className="num shrink-0 text-sm text-muted-foreground">
                    {m.period}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {m.company}
                </p>
                <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                  {m.body}
                </p>
                <TagRow items={m.stack} />
              </article>
            ))}
          </div>
        </BlurFade>

        <BlurFade inView>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {t.education.map((e) => (
              <article
                key={e.school}
                className="relative flex flex-col gap-3 p-5 sm:p-6"
              >
                <ProjectPointer kind="school" />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Logo name={e.school} />
                    <h3 className="text-lg font-semibold tracking-tight">
                      {e.school}
                    </h3>
                  </div>
                  <span className="num shrink-0 text-sm text-muted-foreground">
                    {e.period}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {e.title}
                </p>
                <p className="measure text-pretty text-sm leading-relaxed text-muted-foreground">
                  {e.body}
                </p>
              </article>
            ))}
          </div>
        </BlurFade>
      </Chapter>

      {/* ── Technologies : la sphère du portfolio ──────────────────────── */}
      <Chapter label={t.chapter} n="IV" title={t.stackTitle}>
        <BlurFade inView>
          <div className="flex flex-col gap-6">
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              {t.sphere}
            </p>
            <IconCloud label={t.sphereLabel} images={STACK_ICON_URLS} />
            {t.skills.map((group) => (
              <div key={group.name} className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {group.name}
                </h3>
                <TagRow items={group.items} />
              </div>
            ))}
          </div>
        </BlurFade>
      </Chapter>

      {/* ── Colophon ───────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="w-full border-t border-border py-24 sm:py-32"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between">
          <BlurFade inView>
            <div className="flex flex-col gap-5">
              <p className="text-pretty text-xl leading-snug">{t.pitch}</p>
              <div className="flex flex-wrap items-center gap-3">
                <ParticleButton href={t.contactHref}>{t.contact}</ParticleButton>
                <Link href={t.detailHref} className={secondaryButton}>
                  {t.detail}
                </Link>
              </div>
              <p className="measure text-sm leading-relaxed text-muted-foreground">
                {t.proof}
              </p>
            </div>
          </BlurFade>
          <BlurFade inView>
            <figure className="flex w-40 shrink-0 flex-col gap-3 sm:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/scroll-media/portrait.webp"
                width={720}
                height={720}
                loading="lazy"
                alt={t.portraitAlt}
                className="w-full rounded-2xl border border-border object-cover"
              />
              <figcaption className="text-xs leading-relaxed text-muted-foreground">
                {t.portraitCaption}
              </figcaption>
            </figure>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
