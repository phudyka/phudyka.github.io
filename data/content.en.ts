import type { Shot } from "@/components/scroll/feature-carousel";
/**
 * Contenu de la version anglaise du site.
 *
 * Ce n'est **pas** la traduction de `content.ts`. Le site français vend une
 * prestation à des PME françaises ; la version anglaise s'adresse à un
 * employeur qui recrute. Traduire l'accroche commerciale mot pour mot aurait
 * donné une page qui propose des agents IA à un recruteur — c'est-à-dire une
 * page qui ne s'adresse à personne.
 *
 * Halfred et PoolCenter y restent, mais comme preuves de compétence : ce qui a
 * été conçu, livré, mis en production, et sur quelles technologies. Seule
 * exception : les pages `/en/halfred/`, qui traduisent fidèlement l'offre
 * (`HALFRED_EN`, `OFFERS_EN`), parce que Halfred travaille aussi à distance.
 *
 * Les faits sont ceux de `cv/profil.md` dans le dépôt de recherche d'emploi, et
 * de nulle part ailleurs. La section « Limites » de ce fichier fait autorité sur
 * ce qui ne doit jamais être revendiqué.
 */

import type { HalfredCopy, Offer } from "./content";

export const SITE_EN = {
  url: "https://phudyka.github.io/en/",
  name: "Paul Hudyka",
  title: "Paul Hudyka — web & mobile developer, AI automation",
  description:
    "Web and mobile developer. I ship products on my own, from the data schema to the store. Open to permanent, fully remote roles worldwide.",
} as const;

export const HIRING = {
  role: "Web & mobile developer — AI automation",
  headline: "I ship products on my own, from the data schema to the store.",
  subhead:
    "Two six-month placements, a field-service application running on three platforms, and a habit of delivering on stacks I did not know when I started.",
  proof:
    "PoolCenter is in real-world use by pool professionals; KeyMaster runs on hospital sites with no internet access at all.",
  availability: "Available from 10 November 2026",
} as const;

/** Ce que je cherche, en lignes chiffrées plutôt qu'en paragraphe. */
export const LOOKING_FOR = [
  { label: "Contract", value: "Permanent, full-time or part-time" },
  { label: "Location", value: "Fully remote, worldwide" },
  { label: "Working hours", value: "09:00–18:00 Paris time" },
  { label: "Available from", value: "10 November 2026" },
  { label: "Languages", value: "French, English, Spanish" },
] as const;

/** Les réalisations, dans l'ordre où un recruteur veut les lire. */
export const SHIPPED = [
  {
    slug: "poolcenter",
    href: "/en/poolcenter/",
    name: "PoolCenter",
    kind: "Product · placement",
    figure: "v0.3.0",
    summary:
      "Field-service application for professional pool maintenance: scheduling, on-site data entry, water-quality alerts, PDF compliance reports, customer portal, offline mode.",
    detail:
      "One Flutter codebase for web, Android and iOS on Supabase. Continuous integration runs static analysis, Flutter, Deno and SQL test suites, OSV software composition analysis, DAST and backups verified by restore. In closed beta on TestFlight and the Play Store closed track, in real-world use.",
    stack: ["Flutter", "Supabase", "Deno", "PostgreSQL", "Codemagic"],
  },
  {
    slug: "keymaster",
    href: "/en/experience/",
    name: "KeyMaster",
    kind: "GPI France · placement",
    figure: "2025",
    summary:
      "Software licence management for an international medical software vendor: issuing, revoking and administering the entire customer catalogue, replacing a costly third-party product the company did not own.",
    detail:
      "ECDSA over SHA-256 was chosen to enable offline authentication: a hospital validates its licence with no network access, while authenticity, integrity and the validity of every purchased module are carried in a single key.",
    stack: ["Django", "Angular", "PostgreSQL", "ECDSA"],
  },
  {
    slug: "halfred",
    href: "/en/halfred/",
    name: "Halfred",
    kind: "Independent activity",
    figure: "2026",
    summary:
      "Bespoke AI agents deployed as close to the customer as possible, the model running on their own machine under Ollama.",
    detail:
      "Pricing is computed by a deterministic script and never by the model — natural language stays at the edges, which is what neutralises prompt injection. Docker, n8n, Ollama and PostgreSQL, self-hostable on customer premises.",
    stack: ["Docker", "n8n", "Ollama", "PostgreSQL"],
  },
] as const;

export const MISSIONS_EN = [
  {
    name: "KeyMaster",
    company: "GPI France",
    period: "May — Nov. 2025",
    body:
      "Web application for software licence management. Key generation and validation through ECDSA signatures over SHA-256, backed by an external API.",
    stack: ["Django", "Angular", "PostgreSQL", "ECDSA"],
    pointer: "key",
  },
  {
    name: "Remote Monitoring",
    company: "GPI France",
    period: "May — Nov. 2025",
    body:
      "Medical proof of concept linking Cosinuss° C-MED Alpha sensors to a RAG. JSON streams translated into openEHR and FHIR, real-time detection of vital-sign anomalies.",
    stack: ["Python", "RAG", "openEHR", "FHIR", "IoT"],
    pointer: "pulse",
  },
  {
    name: "Two internal workshops",
    company: "GPI France",
    period: "Oct. 2025",
    body:
      "Ran and taught two sessions on work delivered during the placement: automating tasks with n8n pipelines, and generating licences with KeyMaster.",
    stack: ["n8n", "KeyMaster", "Teaching"],
    pointer: "key",
  },
] as const;

export const SCHOOL_PROJECTS_EN = [
  {
    name: "ft_transcendence",
    body:
      "Real-time multiplayer Pong on a microservice architecture: Django and Node services behind Nginx, socket.io, Three.js 3D rendering, Prometheus and Grafana supervision.",
    stack: ["Django", "Node", "socket.io", "Three.js", "Grafana"],
    href: "https://github.com/phudyka/ft_transcendence",
    pointer: "pong",
  },
  {
    name: "ft_irc",
    body:
      "IRC server conforming to RFC 1459: channel management, real-time messaging.",
    stack: ["C++"],
    href: "https://github.com/phudyka/ft_irc",
    pointer: "chat",
  },
  {
    name: "cub3d",
    body:
      "Wolfenstein-inspired raycasting 3D renderer: weapons, doors, textures.",
    stack: ["C"],
    href: "https://github.com/phudyka/cub3d",
    pointer: "raycast",
  },
  {
    name: "minishell",
    body:
      "Unix shell: pipes, redirections, environment variables, signal handling.",
    stack: ["C", "Bash"],
    href: "https://github.com/phudyka/minishell",
    pointer: "shell",
  },
] as const;

export const SKILL_GROUPS_EN = [
  {
    name: "Languages",
    items: [
      "C",
      "C++",
      "Python",
      "JavaScript",
      "TypeScript",
      "Dart",
      "PHP",
      "SQL",
      "x86-64 assembly",
    ],
  },
  {
    name: "Mobile",
    items: ["Flutter", "Riverpod", "go_router", "React Native", "Expo"],
  },
  {
    name: "Web",
    items: [
      "Next.js",
      "React",
      "Angular",
      "Redux",
      "TanStack Query",
      "Tailwind CSS",
      "Vite",
      "Webpack",
    ],
  },
  {
    name: "Real-time and 3D",
    items: ["socket.io", "WebSockets", "Three.js", "WebGL", "glTF"],
  },
  {
    name: "Backend and data",
    items: [
      "PostgreSQL",
      "Supabase",
      "Deno",
      "Node.js",
      "Express",
      "Django",
      "Prisma",
      "Hive",
    ],
  },
  {
    name: "AI and automation",
    items: ["n8n", "RAG", "Ollama", "Open WebUI", "openEHR", "FHIR"],
  },
  {
    name: "Security",
    items: [
      "ECDSA",
      "SHA-256",
      "Row-level security",
      "Vault",
      "DAST",
      "OSV SCA",
    ],
  },
  {
    name: "Infrastructure",
    items: [
      "Docker",
      "Docker Compose",
      "GitHub Actions",
      "nginx",
      "Vercel",
      "Codemagic",
      "Cloudflare R2",
    ],
  },
  {
    name: "Observability",
    items: ["Prometheus", "Grafana", "Alertmanager", "PostHog"],
  },
] as const;

export const LANGUAGES_EN = [
  { name: "French", level: "Native" },
  { name: "English", level: "Professional" },
  { name: "Spanish", level: "Professional" },
  { name: "Russian", level: "Elementary" },
  { name: "Mandarin", level: "Basics" },
] as const;

export const EDUCATION_EN = [
  {
    school: "École 42 Nice",
    title: "Concepteur développeur de solutions informatiques",
    period: "2022 – 2027, in progress",
    body:
      "French RNCP level 6 qualification, comparable to a bachelor’s degree, web & mobile specialisation. Common core completed at level 14.25, 49 of 66 projects validated. Peer-to-peer learning, no lectures and no teaching staff. Exam Rank 04, 05 and 06 all passed at 100/100, the three timed common-core examinations.",
  },
  {
    school: "Université Côte d’Azur",
    title: "Applied Foreign Languages",
    period: "2018 – 2022",
    body:
      "English and Spanish, Russian option. Left in the final year for 42: no degree awarded.",
  },
] as const;

export const POOLCENTER_EN = {
  version: "0.3.0",
  phase: "Closed beta — TestFlight and Play Store closed track, 2026 season",
  url: "https://poolcenter.app",
  problem:
    "A pool maintenance company runs dozens of visits a day across as many sites. Every visit requires precise water readings, a record of the products used and proof of attendance — under regulations that do not forgive.",
  role:
    "Design, development and deployment, on my own. The project is the formal subject of my placement at Piscine Center, approved by École 42.",
  engineering: [
    {
      title: "One codebase, three platforms",
      body:
        "Flutter for web, Android and iOS on Supabase: PostgreSQL with row-level security, Auth, Storage, Edge Functions in Deno, Realtime, Vault. Riverpod, go_router, offline mode on Hive. Photos served from Cloudflare R2. Web production deployed on Vercel.",
    },
    {
      title: "Continuous integration that actually gates",
      body:
        "Static analysis, Flutter and Deno test suites, SQL tests, OSV software composition analysis, DAST, and automated PostgreSQL backups verified by a restore test. Mobile builds through Codemagic.",
    },
    {
      title: "Bug intake automated end to end",
      body:
        "The in-app “Report a bug” button creates the Jira ticket with its screenshot, through a PostgreSQL trigger calling an Edge Function. Google Play has no TestFlight equivalent, so this single channel covers all three platforms; TestFlight feedback is imported into the same table by script, and screenshots are pulled down automatically at the start of each working session.",
    },
    {
      title: "Working method",
      body:
        "Jira as the single source of truth, every commit carrying its ticket key. Keep a Changelog release notes, SemVer versioning, and every fix backed by a test that is mutation-checked to fail without the fix. 1,422 commits.",
    },
  ],
  stack: [
    "Flutter",
    "Dart",
    "Supabase",
    "PostgreSQL",
    "Deno",
    "Vercel",
    "Codemagic",
    "Jira",
  ],
} as const;

/**
 * Halfred, en anglais : ici, et ici seulement, c’est une traduction fidèle de
 * `HALFRED` et `OFFERS` (`content.ts`). Même positionnement, mêmes prix, mêmes
 * limites — un client à distance lit la même offre qu’un client local.
 */
export const OFFERS_EN: readonly Offer[] = [
  {
    id: "cadrage",
    name: "Scoping call",
    price: "Free",
    who:
      "You tell me what takes up your time. I tell you whether it can be automated, and where to start.",
    included: ["30 minutes", "No commitment"],
  },
  {
    id: "audit",
    name: "Audit",
    price: "€350",
    note: "Deducted if a project is signed within 30 days",
    who: "You want to know what to automate first, and what it costs.",
    included: [
      "Half a day on site or by video call",
      "Written report: processes observed, tools in place, possible quick wins",
      "A quote for the next step",
    ],
  },
  {
    id: "express",
    name: "Express automation",
    price: "from €490",
    note: "Usually €490 to €900",
    who: "One specific process costs you time every week.",
    included: [
      "One automated process",
      "Connected to the tools you already use",
      "Scope and acceptance criteria written before work starts",
    ],
  },
  {
    id: "pack",
    name: "Automation pack",
    price: "€1,200 to €2,500",
    who: "Several tasks follow one another and are worth linking up.",
    included: [
      "2 to 4 connected processes",
      "Connected to the tools you already use",
      "Scope and acceptance criteria written before work starts",
    ],
  },
  {
    id: "agent",
    name: "AI agent or document assistant",
    price: "€2,500 to €5,000",
    who:
      "You want an agent that works inside your tools, or that answers from your documents.",
    included: [
      "An AI agent connected to your backend or your tools",
      "Or an assistant over the company’s documents (RAG)",
      "Calculations done by code, anything sent approved by you",
    ],
  },
  {
    id: "local",
    name: "Fully local agent",
    price: "from €5,000",
    note: "Quoted per project, hardware not included",
    who: "Your data must not leave your premises.",
    included: [
      "An agent installed on a machine at your site",
      "The model runs on site, outbound network access is closed",
      "Longer and more expensive: decided after the audit",
    ],
  },
  {
    id: "site",
    name: "Business website",
    price: "from €1,500",
    who: "You need a simple, clear presence online.",
    included: ["Design and launch"],
  },
  {
    id: "shop",
    name: "Online shop",
    price: "from €3,500",
    note: "Platform subscription and payment fees extra",
    who: "You want to sell online.",
    included: ["Catalog, cart, payment, order management"],
  },
  {
    id: "webapp",
    name: "Web application",
    price: "from €8,000",
    note: "First version, scope agreed together",
    who: "You need a custom business tool.",
    included: ["Accounts, database, dashboard"],
  },
  {
    id: "hebergement",
    name: "Hosting and maintenance",
    price: "€39 / month",
    note: "For 1 or 2 automations; €79 / month beyond that",
    who: "You have no server, or you would rather not look after one.",
    included: ["Server included", "Updates", "Monitoring", "Small fixes"],
  },
];

export const TERMS_EN: ReadonlyArray<readonly [string, string]> = [
  ["Time and materials", "€350 / day"],
  ["Deposit", "30% on order"],
  ["Keys and accounts", "In your name"],
  ["Quote validity", "30 days"],
  ["VAT", "Not applicable, art. 293 B of the French tax code"],
];

export const HALFRED_EN: HalfredCopy = {
  home: "/en/halfred/",
  hub: { label: "Paul Hudyka", href: "/en/" },
  nav: { label: "Halfred navigation", about: "Approach", principle: "How it works", pricing: "Pricing", local: "On-premises", site: "Websites", contact: "Contact", menu: "Menu" },
  title: { top: "Your business", minus: "minus", before: "the ", loop: ["repetitive", "manual", "time-consuming", "tedious"], after: " tasks." },
  lead: "Automation and AI consultant for SMBs.",
  ctaContact: "Talk about your needs",
  ctaPricing: "See pricing",
  about: {
    title: ["Automate what repeats,", "without changing your tools."],
    accent: "without changing",
    halfred: "Emails sorted, customers followed up, quotes calculated: it all runs itself.",
    paul: ["Paul Hudyka", "Independent consultant · French Riviera"],
    portraitAlt: "Paul Hudyka",
    safeguardsTitle: "Three safeguards, on every project",
    safeguards: [
      "Calculations run through code, never through the model.",
      "Nothing goes out without your approval.",
      "Everything is written down before we start.",
    ],
  },
  flow: {
    title: ["A message comes in,", "the rest follows on its own."],
    accent: "on its own",
    points: [
      ["Copying, chasing, scheduling…", "The same steps, every week, in small businesses."],
      ["Time given back", "It goes back to your trade, with fewer typing errors."],
      ["You approve", "The automation reads, files and prepares. Nothing goes out without you."],
    ],
    diagram: "Diagram: emails, WhatsApp messages and forms go through Halfred, which files them into your spreadsheets, calendar and documents.",
  },
  pricing: {
    title: "How does it work?\nWhat does it cost?",
    accents: ["work", "cost"],
    vat: "No VAT charged (art. 293 B of the French tax code)",
    colon: ": ",
    steps: [
      {
        offers: ["cadrage"],
        title: "Needs assessment",
        body: "A 30-minute call to spot what is costing you time.",
        who: "To know where to start.",
        image: 1,
      },
      {
        offers: ["audit"],
        title: "Process audit",
        body: "Half a day watching how you work, then a written report and a quote.",
        who: "To get a costed plan before investing.",
        image: 2,
      },
      {
        offers: ["express", "pack"],
        title: "Task automation",
        body: "Emails sorted, customers followed up, quotes calculated, wired into your current tools.",
        who: "For teams repeating the same steps every week.",
        image: 3,
      },
      {
        offers: ["agent"],
        title: "Custom AI agent",
        body: "An assistant that reads your documents, drafts and answers. You approve every send.",
        who: "For businesses buried in written requests.",
        image: 4,
      },
      {
        offers: ["hebergement"],
        title: "Hosting and maintenance",
        body: "Server, updates and monitoring: everything keeps running without you.",
        who: "So you never have to handle the technical side.",
        image: 6,
      },
    ],
  },
  local: {
    eyebrow: "100% on-premises",
    title: ["Your data", "never leaves you."],
    accent: "Ever.",
    points: [
      "The AI model runs on a machine installed at your premises.",
      "Outbound network access is closed: nothing is sent to a provider.",
      "For sensitive data: customers, health, legal, finance.",
    ],
    alt: "A closed black block crossed by a glowing red slit.",
  },
  site: {
    eyebrow: "On the side",
    title: ["Websites and web apps,", "made to measure."],
    accent: "made to measure",
    body: "Unrelated to automation, but often asked for.",
    kinds: [
      {
        offer: "site",
        body: "A few pages that look like you, so people find and contact you: custom design, mobile-ready, search-friendly.",
        points: ["3 to 6 pages, custom design", "Mobile-ready, easy to find on Google", "Contact form, launch included"],
        shot: ["halfred", "Halfred · my work"],
      },
      {
        offer: "shop",
        body: "A shop ready to sell: your catalog online, cart, secure payment and order tracking.",
        points: ["Catalog and product pages", "Cart and secure card payment", "Order and stock tracking"],
        shot: ["nikki", "Nikki Beach furniture · my work"],
      },
      {
        offer: "webapp",
        body: "A custom business tool: user accounts, database, dashboard and your workflows.",
        points: ["User accounts and access rights", "Database and dashboard", "Your business workflows, made to measure"],
        shot: ["poolcenter", "PoolCenter · my work"],
      },
    ],
    credit: "All shown sites are my own work: Halfred, Nikki Beach, PoolCenter.",
  },
  contact: {
    title: "Let’s talk about your needs.",
    accent: "needs",
    lead: "Describe your need in a few lines. I’ll tell you whether it’s worth automating, and what it costs.",
    subject: "Halfred — new request",
    facts: ["Reply within 48 working hours", "First call free, 30 minutes", "On site on the French Riviera, or remote"],
    direct: "Or straight by email",
    name: "Name",
    company: "Company (optional)",
    email: "Email",
    phone: "Phone (optional)",
    need: "What you need",
    needs: ["Automate a task", "AI agent", "100% local agent", "Not sure yet"],
    message: "Your message",
    placeholder: "What your team redoes by hand every week, the tools you use, how much time it takes.",
    submit: "Send my request",
    submitting: "Sending…",
    sentTitle: "Message received.",
    sent: "I’ll reply within 48 working hours, from contact.halfred@gmail.com.",
    failed: "That did not go through. Try again, or email me directly at contact.halfred@gmail.com.",
    privacy: "These details are used only to answer your request. They are neither sold nor reused.",
  },
  footer: { otherLang: { label: "Français", href: "/halfred/" } },
};

export const NAV_EN = [
  { href: "/en/", label: "Home" },
  { href: "/en/halfred/", label: "Halfred" },
  { href: "/en/poolcenter/", label: "PoolCenter" },
  { href: "/en/experience/", label: "Experience" },
] as const;

/**
 * Correspondance des pages entre les deux langues. Le bouton de bascule s'en
 * sert pour rester sur la même page en changeant de langue, plutôt que de
 * renvoyer tout le monde à l'accueil.
 */
export const LANG_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/", "/en/"],
  ["/halfred/", "/en/halfred/"],
  ["/halfred/offres/", "/en/halfred/offres/"],
  ["/poolcenter/", "/en/poolcenter/"],
  ["/parcours/", "/en/experience/"],
  ["/scroll/", "/en/scroll/"],
];

/**
 * The application's screens, in the order of a working day. Five on the desk,
 * four on the phone, taken on the demonstration account — the pools and the
 * addresses are fictional.
 */
export const SHOTS_EN: readonly Shot[] = [
  {
    src: "/scroll-media/app/web-planning.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "The month’s schedule",
    alt:
      "Monthly schedule: five pools as rows, September working days as columns, one dot per visit planned, done or missed.",
  },
  {
    src: "/scroll-media/app/tel-planning.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "The day’s round, in the field",
    alt:
      "Phone view of the schedule: the day’s visits, the time, the town and the assigned technician.",
  },
  {
    src: "/scroll-media/app/web-piscines.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "The pool estate",
    alt:
      "Pools as cards, with town, address and an alert on the one whose last reading is out of range.",
  },
  {
    src: "/scroll-media/app/web-fiche.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "One pool’s record",
    alt:
      "Pool record: surface, volume, siting, location, contacts and equipment, with the Route, Water and History tabs.",
  },
  {
    src: "/scroll-media/app/tel-fiche-eau.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "The same record, poolside",
    alt:
      "Phone view of the record: the pool banner, water within range, characteristics and contacts.",
  },
  {
    src: "/scroll-media/app/web-contacts.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "Contacts, pool by pool",
    alt:
      "Contacts grouped by pool, each with their role and access to the portal and the reports.",
  },
  {
    src: "/scroll-media/app/web-portails.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "The portal handed to the client",
    alt:
      "Client portal: one card per shared pool, with the access link to pass on.",
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
    alt:
      "Phone view of the home screen: the day’s progress, missed visits, pools to watch.",
  },
] as const;
