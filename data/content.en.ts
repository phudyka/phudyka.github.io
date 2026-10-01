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
 * été conçu, livré, mis en production, et sur quelles technologies. L'offre
 * Halfred traduite vit sur son propre site (halfred.pages.dev/en/).
 *
 * Les faits sont ceux de `cv/profil.md` dans le dépôt de recherche d'emploi, et
 * de nulle part ailleurs. La section « Limites » de ce fichier fait autorité sur
 * ce qui ne doit jamais être revendiqué.
 */


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
    href: "https://halfred.pages.dev/en/",
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

export const NAV_EN = [
  { href: "/en/", label: "Home" },
  { href: "https://halfred.pages.dev/en/", label: "Halfred" },
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
