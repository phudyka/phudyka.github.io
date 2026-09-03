import type { Metadata } from "next";
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
import { IDENTITY, STACK_ICON_URLS } from "@/data/content";
import {
  EDUCATION_EN,
  HIRING,
  MISSIONS_EN,
  POOLCENTER_EN,
  SKILL_GROUPS_EN,
} from "@/data/content.en";

export const metadata: Metadata = {
  title: "The long read",
  description:
    "The same file, read like a magazine: an application in production, a network that closes under the cursor, a career.",
  alternates: {
    canonical: "/en/scroll/",
    languages: { fr: "/scroll/", en: "/en/scroll/" },
  },
};

/**
 * Version anglaise de `/scroll/`. Même structure, mêmes composants, même acte
 * épinglé : seule la copie change, et elle vient de `data/content.en.ts` pour
 * tout ce qui est factuel. Les deux pages se répondent par `LANG_PAIRS`.
 */

/**
 * The application's screens, in the order of a working day. Five on the desk,
 * four on the phone, taken on the demonstration account — the pools and the
 * addresses are fictional.
 */
const SHOTS = [
  {
    src: "/scroll-media/app/web-planning.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "The month’s schedule",
    alt: "Monthly schedule: five pools as rows, September working days as columns, one dot per visit planned, done or missed.",
  },
  {
    src: "/scroll-media/app/tel-planning.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "The day’s round, in the field",
    alt: "Phone view of the schedule: the day’s visits, the time, the town and the assigned technician.",
  },
  {
    src: "/scroll-media/app/web-piscines.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "The pool estate",
    alt: "Pools as cards, with town, address and an alert on the one whose last reading is out of range.",
  },
  {
    src: "/scroll-media/app/web-fiche.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "One pool’s record",
    alt: "Pool record: surface, volume, siting, location, contacts and equipment, with the Route, Water and History tabs.",
  },
  {
    src: "/scroll-media/app/tel-fiche-eau.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "The same record, poolside",
    alt: "Phone view of the record: the pool banner, water within range, characteristics and contacts.",
  },
  {
    src: "/scroll-media/app/web-contacts.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "Contacts, pool by pool",
    alt: "Contacts grouped by pool, each with their role and access to the portal and the reports.",
  },
  {
    src: "/scroll-media/app/web-portails.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "The portal handed to the client",
    alt: "Client portal: one card per shared pool, with the access link to pass on.",
  },
  {
    src: "/scroll-media/app/tel-piscines.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "The estate, in a pocket",
    alt: "Phone view of the pool estate, with the bottom navigation bar.",
  },
  {
    src: "/scroll-media/app/tel-accueil.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "What is still outstanding",
    alt: "Phone view of the home screen: the day’s progress, missed visits, pools to watch.",
  },
] as const;

const LOGOS: Record<string, string> = {
  "GPI France": "/logos/gpi-france.webp",
  "École 42 Nice": "/logos/ecole-42.webp",
  "Université Côte d’Azur": "/logos/uca.webp",
};

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
  { n, title, children }: {
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
              Chapter {n}
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

export default function ScrollPageEn() {
  return (
    <main id="contenu" className="pb-32">
      {/* ── Title page ─────────────────────────────────────────────────── */}
      <header className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-8 px-5 pb-32 pt-24">
        <BlurFade duration={0.7} blur="12px" yOffset={10}>
          <KineticText
            text={IDENTITY.name}
            className="text-5xl tracking-[-0.035em] sm:text-6xl"
          />
        </BlurFade>
        <BlurFade delay={0.12}>
          <p className="text-balance text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-3xl">
            I ship on my own, all the way to production.
            <br />
            <span className="text-primary">
              From the data schema to the app store.
            </span>
          </p>
        </BlurFade>
        <BlurFade delay={0.2}>
          <Clock lang="en" />
        </BlurFade>
        <BlurFade delay={0.28}>
          <div className="flex flex-col gap-4">
            <p className="num text-xs uppercase tracking-wide text-muted-foreground">
              {HIRING.availability} · French, English, Spanish
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ParticleButton href="#contact">Get in touch</ParticleButton>
              <Link href="/en/" className={secondaryButton}>
                Read the short version
              </Link>
            </div>
          </div>
        </BlurFade>
      </header>

      {/* ── I · PoolCenter ─────────────────────────────────────────────── */}
      <section className="w-full border-t border-border py-20 sm:py-28">
        <ProductHero
          src="/scroll-media/pc-site.webp"
          alt="The poolcenter.app home page: the product name, a mockup of the maintenance report in a browser and a water-analysis sheet on a phone."
          kicker="Chapter I"
          title="An application in production, carried alone."
          lead="PoolCenter is the formal subject of my placement at Piscine Center, approved by École 42 and by the company: a field-service application for pool maintenance professionals."
          href="https://poolcenter.app"
          caption="poolcenter.app, in production — open the site. The product is French, and so is every screen below."
        />
      </section>

      <section className="w-full pb-20 sm:pb-28">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5">
          <BlurFade inView>
            <div className="flex flex-col gap-5">
              <p className="measure text-pretty leading-relaxed text-muted-foreground">
                Flutter for web, Android and iOS on Supabase: PostgreSQL with
                row-level security, Auth, Storage, Edge Functions in Deno,
                Realtime, Vault. Offline mode, PDF reports in the regulatory
                logbook format, client portal, scheduling.
              </p>
              <p className="measure text-pretty leading-relaxed text-muted-foreground">
                Around it: continuous integration with static analysis,
                Flutter, Deno and SQL test suites, software composition
                analysis, DAST, automated PostgreSQL backups verified by a
                restore test. Every fix is backed by a test whose mutation
                proves it fails without it.
              </p>
            </div>
          </BlurFade>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-4 px-5">
          <BlurFade inView>
            <FeatureCarousel shots={SHOTS} label="PoolCenter screens" />
          </BlurFade>
          <BlurFade inView>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Demonstration account: the pools, the addresses and the contacts
              are fictional.
            </p>
          </BlurFade>
        </div>

        <div className="mx-auto mt-10 w-full max-w-2xl px-5">
          <BlurFade inView>
            <dl className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card px-5 sm:px-6">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Version</dt>
                <dd className="num text-sm font-medium">
                  {POOLCENTER_EN.version}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Platforms</dt>
                <dd className="num text-sm font-medium">web, Android, iOS</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Release</dt>
                <dd className="text-sm font-medium">
                  closed beta, in real-world use
                </dd>
              </div>
            </dl>
          </BlurFade>
        </div>
      </section>

      {/* ── II · Topology, the only pinned act ─────────────────────────── */}
      <section className="w-full border-t border-border">
        <div className="mx-auto w-full max-w-5xl px-5">
          <Topology lang="en" />
        </div>
      </section>

      <section className="w-full py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5">
          <BlurFade inView>
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              Same principle at GPI France: KeyMaster licences are validated{" "}
              <strong className="font-medium text-foreground">offline</strong>
              {" "}
              through ECDSA signatures, because a teaching hospital deploys with
              no internet access. And inside PoolCenter: row-level security,
              Vault, DAST, offline mode. Three settings, one speciality:
              software under security constraints, often in closed environments.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── III · Track record ─────────────────────────────────────────── */}
      <Chapter
        n="III"
        title="Two six-month placements, one course, one company."
      >
        <BlurFade inView>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {MISSIONS_EN.map((m) => (
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
            {EDUCATION_EN.map((e) => (
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

      {/* ── IV · The sphere ────────────────────────────────────────────── */}
      <Chapter n="IV" title="What I have actually practised.">
        <BlurFade inView>
          <div className="flex flex-col gap-6">
            <p className="measure text-pretty leading-relaxed text-muted-foreground">
              The sphere turns on its own and can be caught with the mouse. The
              list underneath says the same thing, legibly. Nothing is on it
              without a project behind it.
            </p>
            <IconCloud
              label="Sphere of the technologies used"
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
              <p className="text-pretty text-xl leading-snug">
                I am looking for a developer role, fully remote, on Paris hours.
                If your team needs someone who ships on their own and writes
                secure software by construction, write to me.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <ParticleButton href="/en/#contact">
                  Get in touch
                </ParticleButton>
                <Link href="/en/experience/" className={secondaryButton}>
                  The full track record
                </Link>
              </div>
              <p className="measure text-sm leading-relaxed text-muted-foreground">
                Everything written here can be checked: public repositories,
                placement agreements, a filmed defence.
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
                alt="Portrait of Paul Hudyka."
                className="w-full rounded-2xl border border-border object-cover"
              />
              <figcaption className="text-xs leading-relaxed text-muted-foreground">
                Generated from photographs, not a photograph.
              </figcaption>
            </figure>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
