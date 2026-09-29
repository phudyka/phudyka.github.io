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
    "Premier prospect : ETS Maria, pisciniste niçois en activité depuis 1937. Devis émis, agent construit, discussions en cours.",
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

/**
 * Une offre Halfred. `note` précise le prix quand il en a besoin (fourchette,
 * déduction, hors matériel) ; elle est absente sinon, plutôt que remplie pour
 * la symétrie. Le même type sert à la version anglaise.
 */
export type Offer = {
  id: string;
  name: string;
  price: string;
  note?: string;
  who: string;
  included: readonly string[];
};

/**
 * Grille décidée par Paul le 2026-09-28 : tarifs de lancement, en euros hors
 * taxe, franchise de TVA. Elle remplace la grille Pilote / Déploiement / Run.
 * Aucune durée n’est affichée : elles n’ont pas été fixées, on ne les invente
 * pas. L’ordre est celui dans lequel un client les rencontre.
 */
export const OFFERS: readonly Offer[] = [
  {
    id: "cadrage",
    name: "Échange de cadrage",
    price: "Gratuit",
    who:
      "Vous me décrivez ce qui vous prend du temps. Je vous dis si ça s’automatise, et par où commencer.",
    included: ["30 minutes", "Sans engagement"],
  },
  {
    id: "audit",
    name: "Audit",
    price: "350 €",
    note: "Déduit si une mission est signée dans les 30 jours",
    who:
      "Vous voulez savoir quoi automatiser en premier, et ce que ça coûte.",
    included: [
      "Une demi-journée sur place ou en visio",
      "Restitution écrite : processus observés, outils en place, gains rapides possibles",
      "Un devis pour la suite",
    ],
  },
  {
    id: "express",
    name: "Automatisation express",
    price: "à partir de 490 €",
    note: "En général de 490 à 900 €",
    who: "Un processus précis vous fait perdre du temps chaque semaine.",
    included: [
      "Un processus automatisé",
      "Branché sur les outils que vous avez déjà",
      "Périmètre et critères de recette écrits avant de commencer",
    ],
  },
  {
    id: "pack",
    name: "Pack d’automatisations",
    price: "1 200 à 2 500 €",
    who: "Plusieurs tâches se suivent et gagnent à être reliées.",
    included: [
      "2 à 4 processus connectés entre eux",
      "Branchés sur les outils que vous avez déjà",
      "Périmètre et critères de recette écrits avant de commencer",
    ],
  },
  {
    id: "agent",
    name: "Agent IA ou assistant sur vos documents",
    price: "2 500 à 5 000 €",
    who:
      "Vous voulez un agent qui travaille dans vos outils, ou qui répond à partir de vos documents.",
    included: [
      "Un agent IA branché sur votre backend ou vos outils",
      "Ou un assistant sur les documents de l’entreprise (RAG)",
      "Calculs faits par du code, envois validés par vous",
    ],
  },
  {
    id: "local",
    name: "Agent 100 % local",
    price: "à partir de 5 000 €",
    note: "Sur devis, hors matériel",
    who: "Vos données ne doivent pas sortir de chez vous.",
    included: [
      "Un agent installé sur une machine chez vous",
      "Le modèle tourne sur place, la sortie réseau est fermée",
      "Plus long et plus cher : il se décide après l’audit",
    ],
  },
  {
    id: "site",
    name: "Petit site vitrine",
    price: "800 à 1 500 €",
    who: "Vous avez besoin d’une présence en ligne simple et claire.",
    included: ["Conception et mise en ligne"],
  },
  {
    id: "hebergement",
    name: "Hébergement et maintenance",
    price: "39 € / mois",
    note: "Pour 1 ou 2 automatisations ; 79 € / mois au-delà",
    who: "Vous n’avez pas de serveur, ou vous ne voulez pas vous en occuper.",
    included: [
      "Serveur inclus",
      "Mises à jour",
      "Surveillance",
      "Petites corrections",
    ],
  },
];

/** Les conditions, lues en lignes chiffrées sous la grille. */
export const TERMS: ReadonlyArray<readonly [string, string]> = [
  ["Régie", "350 € / jour"],
  ["Acompte", "30 % à la commande"],
  ["Clés et comptes", "À votre nom"],
  ["Validité des devis", "30 jours"],
  ["Régime de TVA", "Non applicable, art. 293 B du CGI"],
];


/** Le seul prospect. Ne jamais en ajouter un deuxième qui n’existe pas, et ne
 * jamais le présenter en client : rien n’est signé. */
export const CLIENT = {
  name: "ETS Maria",
  trade: "Pisciniste, région niçoise",
  since: "1937",
  status: "Devis 2026-001 émis",
  problem:
    "Les commerciaux rédigeaient chaque mail à la main. Les données de l’entreprise étaient éparpillées entre le catalogue Sage 100, la base clients, les devis et l’historique des échanges.",
  /**
   * Statut réel, à ne pas embellir, corrigé le 2026-09-03 : le devis est
   * **émis, pas signé**. Rien n’est encaissé, l’installation n’a pas eu lieu,
   * et le projet avance lentement parce qu’il attend d’ETS Maria sa méthode de
   * chiffrage, jamais formalisée. Écrire « client signé » ou « livré » ici
   * serait la seule affirmation invérifiable du site — celle qui coûterait
   * toutes les autres.
   *
   * Le `dashboard.md` de `Workspace-Halfred/Halfred/` affirme « signé » : il
   * est faux, le devis lui-même a son « Bon pour accord » vide et garde
   * « [À COMPLÉTER] » sur les coordonnées du client. Ne pas s’en servir comme
   * source.
   */
  delivered:
    "Un agent de rédaction assistée des mails commerciaux — réponse client, relance de devis, mail libre — construit pour tourner localement. Contrainte de conception : l’agent ne cite que des montants et des références réels issus des données de l’entreprise, jamais inventés. L’installation sur leurs machines et la formation restent à faire.",
  /**
   * Peep n’est pas nommé : sa publication comme réalisation nommée reste une
   * décision non tranchée dans PRODUCT.md. Il est décrit par sa fonction, ce
   * qui est autorisé, et le restera tant que Paul n’aura pas tranché.
   */
  second:
    "Un second outil construit dans la foulée, interne à l’entreprise : à partir des dimensions du bassin, il déroule la chaîne de calcul hydraulique en onze étapes, associe les produits du catalogue et sort un devis modifiable en PDF.",
  /** Lignes chiffrées du bloc de preuve. Chaque valeur est vérifiable. */
  facts: [
    { label: "Secteur", value: "Pisciniste" },
    { label: "En activité depuis", value: "1937" },
    { label: "Statut commercial", value: "Devis 2026-001 émis" },
    { label: "Outils construits", value: "2" },
    { label: "Installation", value: "Locale — à venir" },
  ],
} as const;

type Item = { name: string; body: string };

/**
 * Toute la copie des pages Halfred, dans une langue. Les deux pages
 * (`/halfred/` et `/halfred/offres/`) et leurs doublons anglais se rendent par
 * les mêmes composants (`components/section/halfred.tsx`) : une seule mise en
 * page, deux textes — les versions ne peuvent pas diverger sur la structure.
 */
export type HalfredCopy = {
  home: string;
  offersHref: string;
  tagline: string;
  intro: string;
  ctaContact: string;
  ctaOffers: string;
  approach: { title: string; lead: string; steps: readonly Item[] };
  quick: {
    title: string;
    lead: string;
    items: readonly string[];
    hosting: string;
  };
  bigger: { title: string; lead: string; items: readonly Item[] };
  safeguards: { title: string; lead: string; items: readonly Item[] };
  /** Preuve publique : un dépôt ouvert qui applique ces garde-fous. */
  example: { text: string; label: string; href: string };
  client: {
    title: string;
    lead: string;
    facts: ReadonlyArray<{ label: string; value: string }>;
    paragraphs: readonly string[];
    stack: readonly string[];
  };
  toOffers: [string, string, string];
  offers: {
    title: string;
    tagline: string;
    intro: string;
    ctaContact: string;
    ctaBack: string;
    listTitle: string;
    listLead: string;
    termsTitle: string;
    termsNote: string;
    contactTitle: string;
    contactLead: string;
  };
};

/**
 * Positionnement décidé par Paul le 2026-09-28 : consultant en automatisation
 * et IA pour TPE et PME. Le discours est large — tout ce qui se répète —, les
 * exemples sont des **capacités**, jamais des réalisations : aucun client n’est
 * livré ni signé. Le seul nom cité reste ETS Maria, avec son statut réel.
 */
export const HALFRED: HalfredCopy = {
  home: "/halfred/",
  offersHref: "/halfred/offres/",
  tagline: "Tout ce qui se répète dans votre entreprise peut s’automatiser.",
  intro:
    "Je suis consultant en automatisation et en IA pour les TPE et les PME. Basé à La Colle-sur-Loup, dans les Alpes-Maritimes, j’interviens sur place et à distance.",
  ctaContact: "Parler de votre besoin",
  ctaOffers: "Offres et tarifs",
  approach: {
    title: "D’abord, comprendre comment vous travaillez",
    lead:
      "Je ne vends pas un outil tout fait. Je regarde vos tâches, vos outils et votre informatique. Ensuite, on décide ensemble quoi automatiser et comment.",
    steps: [
      {
        name: "Audit",
        body:
          "J’observe vos processus et les outils en place, sur place ou en visio. Vous recevez une restitution écrite et un devis.",
      },
      {
        name: "Proposition",
        body:
          "Je propose la solution adaptée à votre besoin et à votre informatique. On part de ce que vous avez déjà.",
      },
      {
        name: "Cadrage écrit",
        body:
          "Le périmètre et les critères de recette sont écrits avant de commencer. Vous savez ce que vous recevez, et comment on vérifie que ça marche.",
      },
      {
        name: "Mise en service",
        body:
          "Je livre et je vous montre. Si vous n’avez pas de serveur, j’héberge la solution avec un abonnement simple.",
      },
    ],
  },
  quick: {
    title: "Des petits projets qui démarrent vite",
    lead:
      "Le temps perdu se cache souvent dans des tâches simples, refaites à la main chaque semaine. Quelques exemples de ce qui s’automatise :",
    items: [
      "Trier les e-mails entrants et préparer des brouillons de réponse",
      "Relancer les clients et les factures",
      "Transformer un formulaire en devis PDF, calculé selon vos propres règles",
      "Prendre les rendez-vous",
      "Rappeler les échéances des contrats d’entretien",
      "Relier les outils que vous avez déjà : mail, tableur, CRM, logiciel métier",
      "Extraire les données des factures et des PDF",
      "Créer un petit site vitrine",
    ],
    hosting:
      "Pas de serveur chez vous ? Ce n’est pas un problème : j’héberge sur un petit serveur (VPS), avec un abonnement mensuel simple.",
  },
  bigger: {
    title: "Et plus gros, quand le besoin est là",
    lead:
      "Ces projets prennent plus de temps et coûtent plus cher. Ils se décident après l’audit, pas avant.",
    items: [
      {
        name: "Un agent IA branché sur vos outils",
        body:
          "Il travaille avec votre backend, votre logiciel métier ou votre CRM : il lit, prépare et propose, là où vous travaillez déjà.",
      },
      {
        name: "Un assistant sur vos documents",
        body:
          "Il répond à partir de vos procédures, fiches produits ou contrats (RAG).",
      },
      {
        name: "Un agent 100 % local",
        body:
          "Installé sur une machine chez vous, quand vos données ne doivent pas sortir. Le modèle tourne sur place et la sortie réseau est fermée : ça se vérifie en rendez-vous.",
      },
    ],
  },
  safeguards: {
    title: "Trois garde-fous, sur chaque projet",
    lead: "Petit ou gros, un projet suit les mêmes règles.",
    items: [
      {
        name: "Les calculs passent par du code",
        body:
          "Prix, remises, stocks : ils sont calculés par du code vérifiable, jamais par le modèle. Une phrase glissée dans un document peut changer une tournure, pas un chiffre.",
      },
      {
        name: "Rien ne part sans vous",
        body:
          "Un e-mail, un devis ou une relance attend votre validation avant d’être envoyé.",
      },
      {
        name: "Tout est écrit avant de commencer",
        body:
          "Le périmètre et les critères de recette sont fixés par écrit. Pas de surprise à la livraison.",
      },
    ],
  },
  example: {
    text: "Un exemple que vous pouvez lire et lancer vous-même : un agent qui rédige des brouillons d'e-mails commerciaux, tourne entièrement sur une machine, ne peut rien envoyer seul, et dont la démo d'injection de prompt est documentée, échecs compris.",
    label: "Voir le code sur GitHub",
    href: "https://github.com/phudyka/halfred-agent-template",
  },
  client: {
    title: "Premier prospect",
    lead:
      "ETS Maria, pisciniste niçois depuis 1937. Deux outils construits sur ses propres données.",
    facts: CLIENT.facts,
    paragraphs: [CLIENT.problem, CLIENT.delivered, CLIENT.second],
    stack: ["Docker", "n8n", "Ollama", "PostgreSQL", "TypeScript", "Prisma"],
  },
  toOffers: ["Les prix sont publics : ", "offres et tarifs", "."],
  offers: {
    title: "Offres",
    tagline: "Des prix publics, pour commencer petit.",
    intro:
      "On commence par un échange gratuit de 30 minutes, puis un audit si ça vaut le coup. Tarifs de lancement, en euros hors taxe : la TVA n’est pas applicable.",
    ctaContact: "Demander un devis",
    ctaBack: "La démarche",
    listTitle: "Le détail",
    listLead:
      "Chaque projet démarre par un périmètre écrit. Les fourchettes se précisent après l’audit.",
    termsTitle: "Modalités",
    termsNote:
      "Tarifs de lancement. Les clés d’API et les comptes ouverts pour vous le sont à votre nom : vous gardez la main. Les documents commerciaux portent la mention",
    contactTitle: "Le premier échange est un cadrage, pas un argumentaire",
    contactLead:
      "Dites-moi ce que vos équipes refont à la main. Je vous dis si ça vaut le coup de l’automatiser, et ce que ça coûte.",
  },
};


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
      "Animation et formation des équipes sur deux sujets livrés pendant le stage : l’automatisation de tâches par pipelines n8n, et la génération de licences avec KeyMaster.",
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
 * commercial n'a pas disparu, il vit sous /halfred/ et /halfred/offres/, où
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

/**
 * Heures données pour l'heure d'hiver de Paris (CET, UTC+1), celle qui vaut à
 * la date de disponibilité. Chaque zone est nommée, parce qu'une heure sans son
 * fuseau est fausse la moitié de l'année.
 */
export const OVERLAP = {
  base: "de 9 h à 18 h, heure de Paris (CET)",
  note:
    "L’heure d’été européenne décale chaque ligne d’une heure, de fin mars à fin octobre.",
  rows: [
    { zone: "Côte ouest des États-Unis (PST)", hours: "00:00–09:00" },
    { zone: "Côte est des États-Unis (EST)", hours: "03:00–12:00" },
    { zone: "Brésil (BRT)", hours: "05:00–14:00" },
    { zone: "Inde (IST)", hours: "13:30–22:30" },
    { zone: "Japon (JST)", hours: "17:00–02:00" },
    { zone: "Sydney (AEDT)", hours: "19:00–04:00" },
  ],
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
    href: "/halfred/",
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
      "Anglais et espagnol, option russe. Cursus interrompu en troisième année pour 42 : diplôme non obtenu.",
  },
] as const;

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/parcours/", label: "Parcours" },
  { href: "/poolcenter/", label: "PoolCenter" },
  { href: "/halfred/", label: "Halfred" },
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

