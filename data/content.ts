import type { Shot } from "@/components/scroll/feature-carousel";
/**
 * Source unique de vérité éditoriale du site.
 * Tout fait écrit ici est confirmé dans PRODUCT.md. Rien ne s’invente :
 * pas de témoignage, pas de logo client, pas de chiffre de ROI,
 * pas de seconde référence client.
 */

export const SITE = {
  url: "https://phudyka.github.io",
  name: "Paul Hudyka",
  title: "Paul Hudyka — développeur applications web et mobile",
  description:
    "Je conçois et livre seul des produits, du schéma de données jusqu’au magasin d’applications. En recherche d’un CDI, en télétravail complet. Halfred et PoolCenter en sont les preuves.",
} as const;

export const IDENTITY = {
  name: "Paul Hudyka",
  role: "Entrepreneur individuel — Halfred · PoolCenter",
  headline:
    "Vos équipes passent des heures sur des tâches qu’un agent peut reprendre.",
  guarantee:
    "Le modèle tourne sur vos machines. Aucune de vos données ne part chez un tiers, et ça se démontre en rendez-vous.",
  subhead:
    "J’installe cette automatisation dans vos process, et je construis les logiciels métier qui vont avec.",
  proof:
    "Client : ETS Maria, pisciniste niçois en activité depuis 1937. Agent construit, installation en cours.",
  github: "https://github.com/phudyka",
  // À remplir par Paul. Tant que la chaîne est vide, le bouton correspondant n’est
  // pas rendu : aucun lien mort, aucune promesse non tenue.
  linkedin: "",
  cv: "",
} as const;

export const LEGAL = {
  entity: "Paul Hudyka EI — Halfred",
  siren: "107 717 530",
  siret: "10771753000011",
  ape: "6201Z — Programmation informatique",
  since: "17/07/2026",
  vat: "TVA non applicable, art. 293 B du CGI",
  quoteValidity: "Devis valables 30 jours",
  payment: "Forfait : acompte 30 % à la commande, solde à la livraison",
} as const;

export const POOLCENTER = {
  version: "0.3.0",
  phase: "Bêta fermée — TestFlight et piste fermée du Play Store, saison 2026",
  access: "Vitrine publique, application sur invitation",
  url: "https://poolcenter.app",
  problem:
    "Une entreprise d’entretien de piscines gère des dizaines d’interventions par jour sur autant de sites. Chaque passage exige des relevés sanitaires précis, la trace des produits utilisés et une preuve de passage — dans un cadre réglementaire qui ne pardonne pas.",
  /**
   * La journée d’un intervenant, dans l’ordre où elle arrive. C’est la même
   * matière que `features`, lue dans le temps plutôt qu’en périmètre : le
   * pisciniste reconnaît sa journée avant de lire une liste de fonctions.
   */


  // `span` ne décrit pas le produit : c’est la largeur de la tuile dans la
  // grille bento de /poolcenter/ (1 ou 2 colonnes sur trois).
  features: [
    {
      name: "Planification",
      span: 2,
      body:
        "Calendrier de l’équipe, assignation par intervenant, vue jour de la tournée, code couleur et alertes sur les valeurs hors plage.",
    },
    {
      name: "Saisie terrain",
      span: 1,
      body:
        "Fiche d’entretien structurée : relevés, analyses chimiques, produits utilisés, actions réalisées, photo de fin d’intervention horodatée.",
    },
    {
      name: "Alertes métier",
      span: 1,
      body:
        "pH hors plage 6,9 – 7,7, chlore combiné au-delà de 0,6 mg/l, stabilisant hors plage 20 – 75 mg/l. Seuils surchargeables par entreprise.",
    },
    {
      name: "Optimisation de tournée",
      span: 2,
      body:
        "Regroupement géographique et ordre de passage suggéré sur la tournée du jour.",
    },
    {
      name: "Rapports",
      span: 2,
      body:
        "PDF généré à la clôture du passage, au format attendu par le carnet sanitaire, envoyé au client.",
    },
    {
      name: "Portail client",
      span: 1,
      body:
        "Le propriétaire lit l’historique de sa piscine et retélécharge ses rapports, protégé par code.",
    },
    {
      name: "Hors-ligne",
      span: 1,
      body:
        "Le passage se saisit sans réseau. La synchronisation repart au retour de connexion.",
    },
    {
      name: "Conformité",
      span: 2,
      body:
        "RGPD natif : consentement, portabilité, droit à l’oubli. Code protégé par dépôt e-Soleau à l’INPI.",
    },
  ],
  stack: [
    "Flutter",
    "Dart",
    "Supabase",
    "PostgreSQL",
    "Vercel",
    "Android",
    "iOS",
  ],
} as const;

export const MISSIONS = [
  {
    name: "KeyMaster",
    company: "GPI France",
    period: "Mai — Nov. 2025",
    body:
      "Application web de gestion de licences logicielles. Génération et validation des clés par signature ECDSA sur SHA-256, adossée à une API externe.",
    stack: ["Django", "Angular", "PostgreSQL", "ECDSA"],
    // Curseur affiché au survol de la carte (voir components/project-pointer.tsx).
    pointer: "key",
  },
  {
    name: "Remote Monitoring",
    company: "GPI France",
    period: "Mai — Nov. 2025",
    body:
      "POC médical reliant des capteurs Cosinuss° C-MED Alpha à un RAG. Conversion des flux JSON vers openEHR et FHIR, détection temps réel des anomalies vitales.",
    stack: ["Python", "RAG", "openEHR", "FHIR", "IoT"],
    pointer: "pulse",
  },
  {
    name: "Deux workshops internes",
    company: "GPI France",
    period: "Oct. 2025",
    body:
      "Animation et formation des équipes sur deux sujets livrés pendant le stage : l’automatisation de tâches par pipelines n8n, et la génération de licences avec KeyMaster.",
    stack: ["n8n", "KeyMaster", "Formation"],
    pointer: "key",
  },
] as const;

export const SCHOOL_PROJECTS = [
  {
    name: "ft_transcendence",
    body:
      "Pong multijoueur temps réel en microservices : Django et services Node derrière Nginx, socket.io, rendu 3D Three.js, supervision Prometheus et Grafana.",
    stack: ["Django", "Node", "socket.io", "Three.js", "Grafana"],
    href: "https://github.com/phudyka/ft_transcendence",
    pointer: "pong",
  },
  {
    name: "ft_irc",
    body:
      "Serveur IRC conforme à la RFC 1459 : gestion des canaux, messagerie temps réel.",
    stack: ["C++"],
    href: "https://github.com/phudyka/ft_irc",
    pointer: "chat",
  },
  {
    name: "cub3d",
    body:
      "Moteur de rendu 3D par raycasting inspiré de Wolfenstein : armes, portes, textures.",
    stack: ["C"],
    href: "https://github.com/phudyka/cub3d",
    pointer: "raycast",
  },
  {
    name: "minishell",
    body:
      "Shell Unix : pipes, redirections, variables d’environnement, gestion des signaux.",
    stack: ["C", "Bash"],
    href: "https://github.com/phudyka/minishell",
    pointer: "shell",
  },
] as const;

/**
 * Nuage d’icônes de /parcours/. Chaque entrée est un slug Simple Icons, servi
 * depuis `public/stack/` : le site vend l’absence de sortie réseau, il ne peut
 * pas ouvrir trente-quatre connexions vers un CDN tiers sur la page qui prouve
 * son niveau technique. Pour ajouter une technologie, déposer le SVG
 * correspondant dans `public/stack/<slug>.svg`. La teinte de repli des marques
 * dont la couleur officielle est noire — invisibles sur le thème sombre, qui
 * est celui par défaut — est cuite dans le fichier SVG lui-même.
 */
const STACK_ICONS: ReadonlyArray<{ slug: string }> = [
  { slug: "c" },
  { slug: "cplusplus" },
  { slug: "python" },
  { slug: "typescript" },
  { slug: "javascript" },
  { slug: "dart" },
  { slug: "php" },
  { slug: "react" },
  { slug: "nextdotjs" },
  { slug: "angular" },
  { slug: "flutter" },
  { slug: "django" },
  { slug: "nodedotjs" },
  { slug: "tailwindcss" },
  { slug: "postgresql" },
  { slug: "supabase" },
  { slug: "prisma" },
  { slug: "ollama" },
  { slug: "n8n" },
  { slug: "docker" },
  { slug: "nginx" },
  { slug: "vercel" },
  { slug: "git" },
  { slug: "github" },
];

/** Chemins figés ici : IconCloud a `images` dans ses dépendances d’effet, une
 *  liste reconstruite à chaque rendu le ferait boucler. */
export const STACK_ICON_URLS = STACK_ICONS.map(({ slug }) =>
  `/stack/${slug}.svg`
);

/**
 * Chaque ligne est adossée à un projet public ou livré. Rien ne s’ajoute ici
 * sans réalisation à l’appui : un CV qui annonce une technologie s’effondre à
 * la première question technique et emporte le crédit du reste avec lui.
 * Référence : `cv/profil.md` du dépôt de recherche d’emploi, section Limites.
 */
export const SKILL_GROUPS = [
  {
    name: "Langages",
    items: [
      "C",
      "C++",
      "Python",
      "JavaScript",
      "TypeScript",
      "Dart",
      "PHP",
      "SQL",
      "ASM x86-64",
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
    name: "Temps réel et 3D",
    items: ["socket.io", "WebSocket", "Three.js", "WebGL", "glTF"],
  },
  {
    name: "Backend et données",
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
    name: "IA et automatisation",
    items: ["n8n", "RAG", "Ollama", "Open WebUI", "openEHR", "FHIR"],
  },
  {
    name: "Sécurité",
    items: ["ECDSA", "SHA-256", "RLS", "Vault", "DAST", "SCA OSV"],
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
    name: "Observabilité",
    items: ["Prometheus", "Grafana", "Alertmanager", "PostHog"],
  },
] as const;

export const LANGUAGES = [
  { name: "Français", level: "Langue maternelle" },
  { name: "Anglais", level: "Professionnel" },
  { name: "Espagnol", level: "Professionnel" },
  { name: "Russe", level: "Notions" },
  { name: "Mandarin", level: "Bases" },
] as const;

/* ------------------------------------------------------------------------ *
 * Recherche d'emploi — la matière de l'accueil.
 *
 * L'accueil ne vend plus la prestation : il présente un candidat. Le chemin
 * commercial n'a pas disparu, il vit sur halfred.pages.dev, où
 * quelqu'un qui cherche un prestataire arrive par le lien ou par la recherche.
 * Mélanger les deux forçait un recruteur à lire un argumentaire de vente pour
 * savoir sur quelles technologies je travaille.
 *
 * Les faits viennent de `cv/profil.md`, dans le dépôt de recherche d'emploi.
 * ------------------------------------------------------------------------ */

export const HIRING = {
  role: "Développeur applications web et mobile — automatisation IA",
  headline:
    "Je conçois et livre seul des produits, du schéma de données jusqu’au magasin d’applications.",
  subhead:
    "Deux stages de six mois, une application métier utilisée en conditions réelles sur trois plateformes, et l’habitude de livrer sur des technologies que je ne connaissais pas en arrivant.",
  proof:
    "PoolCenter tourne chez des professionnels de la piscine ; KeyMaster tourne dans des hôpitaux sans aucun accès à Internet.",
  availability: "Disponible à partir du 10 novembre 2026",
} as const;

export const LOOKING_FOR = [
  { label: "Contrat", value: "CDI, temps plein ou temps partiel" },
  { label: "Lieu", value: "Télétravail complet, partout dans le monde" },
  { label: "Horaires", value: "9 h – 18 h, heure de Paris" },
  { label: "Disponible à partir du", value: "10 novembre 2026" },
  { label: "Langues", value: "Français, anglais, espagnol" },
] as const;

/** Les réalisations, dans l'ordre où un recruteur veut les lire. */
export const SHIPPED = [
  {
    slug: "poolcenter",
    href: "/poolcenter/",
    name: "PoolCenter",
    kind: "Produit · stage",
    figure: "v0.3.0",
    summary:
      "Application métier de gestion d’interventions pour les professionnels de l’entretien de piscines : planning, saisie terrain, alertes sanitaires, rapports PDF, portail client, mode hors-ligne.",
    detail:
      "Une base Flutter unique pour le web, Android et iOS sur Supabase. L’intégration continue enchaîne analyse statique, tests Flutter, Deno et SQL, analyse de composition logicielle OSV, DAST et sauvegarde vérifiée par restauration. En bêta fermée, utilisée en conditions réelles.",
    stack: ["Flutter", "Supabase", "Deno", "PostgreSQL", "Codemagic"],
  },
  {
    slug: "keymaster",
    href: "/parcours/",
    name: "KeyMaster",
    kind: "GPI France · stage",
    figure: "2025",
    summary:
      "Gestion des licences logicielles d’un éditeur international de logiciels médicaux : génération, révocation et administration de tout le catalogue client, en remplacement d’une solution tierce coûteuse dont l’entreprise n’était pas propriétaire.",
    detail:
      "La signature ECDSA sur SHA-256 permet l’authentification hors ligne : un hôpital valide sa clé sans aucun accès réseau, l’authenticité, l’intégrité et la validité de tous les modules achetés tenant dans une clé unique.",
    stack: ["Django", "Angular", "PostgreSQL", "ECDSA"],
  },
  {
    slug: "halfred",
    href: "https://halfred.pages.dev/",
    name: "Halfred",
    kind: "Activité indépendante",
    figure: "2026",
    summary:
      "Agents IA sur-mesure déployés au plus près du client, le modèle tournant sur sa machine sous Ollama.",
    detail:
      "Le chiffrage est confié à un script déterministe et jamais au modèle — le langage naturel reste aux extrémités, ce qui neutralise l’injection de prompt. Docker, n8n, Ollama et PostgreSQL, auto-hébergeable chez le client.",
    stack: ["Docker", "n8n", "Ollama", "PostgreSQL"],
  },
] as const;

export const EDUCATION = [
  {
    school: "École 42 Nice",
    title: "Concepteur développeur de solutions informatiques",
    period: "2022 – 2027, en cours",
    body:
      "Titre RNCP niveau 6, option applications web et mobile. Tronc commun achevé au niveau 14.25, 49 projets validés sur 66. Pédagogie par les pairs, sans cours ni professeur. Exam Rank 04, 05 et 06 validés à 100/100, les trois examens chronométrés du tronc commun.",
  },
  {
    school: "Université Côte d’Azur",
    title: "Langues Étrangères Appliquées",
    period: "2018 – 2022",
    body:
      "Anglais et espagnol, option russe. Cursus interrompu en troisième année pour 42 : diplôme non obtenu.",
  },
] as const;

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/parcours/", label: "Parcours" },
  { href: "/poolcenter/", label: "PoolCenter" },
  { href: "https://halfred.pages.dev/", label: "Halfred" },
] as const;

/**
 * Les écrans de l'application, dans l'ordre d'une journée de travail : le
 * planning, le parc, la fiche d'un bassin, les contacts, le portail que le
 * client reçoit. Cinq au poste de travail, quatre sur le téléphone, pris sur
 * le compte de démonstration — les bassins et les adresses sont fictifs.
 */
export const SHOTS: readonly Shot[] = [
  {
    src: "/scroll-media/app/web-planning.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "Le planning du mois",
    alt:
      "Planning mensuel : cinq piscines en lignes, les jours ouvrés de septembre en colonnes, une pastille par passage prévu, fait ou manqué.",
  },
  {
    src: "/scroll-media/app/tel-planning.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "La tournée du jour, sur le terrain",
    alt:
      "Vue téléphone du planning : les passages du jour, l’heure, la ville et le technicien assigné.",
  },
  {
    src: "/scroll-media/app/web-piscines.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "Le parc de bassins",
    alt:
      "Liste des piscines en cartes, avec la ville, l’adresse et une alerte sur celle dont le dernier relevé sort des seuils.",
  },
  {
    src: "/scroll-media/app/web-fiche.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "La fiche d’un bassin",
    alt:
      "Fiche piscine : surface, volume, emplacement, localisation, contacts et matériel, avec les onglets Parcours, Eau et Historique.",
  },
  {
    src: "/scroll-media/app/tel-fiche-eau.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "La même fiche, au bord du bassin",
    alt:
      "Vue téléphone de la fiche : bandeau du bassin, état de l’eau conforme, caractéristiques et contacts.",
  },
  {
    src: "/scroll-media/app/web-contacts.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "Les contacts, par bassin",
    alt:
      "Contacts groupés par piscine, chacun avec son rôle et l’accès au portail et aux rapports.",
  },
  {
    src: "/scroll-media/app/web-portails.webp",
    device: "web",
    width: 1600,
    height: 950,
    label: "Le portail remis au client",
    alt:
      "Portail client : une carte par bassin partagé, avec le lien d’accès à transmettre.",
  },
  {
    src: "/scroll-media/app/tel-piscines.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "Le parc, en poche",
    alt: "Vue téléphone du parc de bassins, avec la barre de navigation basse.",
  },
  {
    src: "/scroll-media/app/tel-accueil.webp",
    device: "phone",
    width: 780,
    height: 1688,
    label: "Ce qui reste à traiter",
    alt:
      "Vue téléphone de l’accueil : avancement du jour, passages manqués, bassins à surveiller.",
  },
] as const;

