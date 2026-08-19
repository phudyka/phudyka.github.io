/**
 * Source unique de vérité éditoriale du site.
 * Tout fait écrit ici est confirmé dans PRODUCT.md. Rien ne s’invente :
 * pas de témoignage, pas de logo client, pas de chiffre de ROI,
 * pas de seconde référence client.
 */

export const SITE = {
  url: "https://phudyka.github.io",
  name: "Paul Hudyka",
  title: "Paul Hudyka — agents IA sur-mesure & logiciel métier",
  description:
    "J’installe des agents IA dans les process des PME, sur leurs machines, et je construis des logiciels métier de bout en bout. Halfred et PoolCenter.",
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
    "Premier client livré : ETS Maria, pisciniste niçois en activité depuis 1937.",
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

/** Les deux activités, telles qu’elles apparaissent sur l’accueil. */
export const ACTIVITIES = [
  {
    slug: "halfred",
    href: "/halfred",
    name: "Halfred",
    kind: "Prestation",
    summary:
      "Conception et déploiement d’agents IA sur-mesure : rédaction assistée, automatisation de tâches métier, exploitation de vos propres données.",
    detail:
      "L’installation est la plus locale possible. Le modèle tourne chez vous et n’a aucun chemin réseau vers l’extérieur — c’est une propriété de l’installation, vérifiable en rendez-vous, pas une clause de contrat.",
    marks: ["Conseil", "Délégation", "Run"],
    figure: { value: "3 000 €", label: "à partir de, forfait Pilote" },
  },
  {
    slug: "poolcenter",
    href: "/poolcenter",
    name: "PoolCenter",
    kind: "Produit",
    summary:
      "Application métier de gestion d’interventions pour les professionnels de l’entretien de piscines : planning, saisie terrain, rapports sanitaires, portail client.",
    detail:
      "Mobile, tablette et navigateur depuis une seule base Flutter, mode hors-ligne compris. En bêta privée pour la saison 2026, utilisée en conditions réelles.",
    marks: ["Flutter", "Supabase", "Bêta 2026"],
    figure: { value: "v1.1.0", label: "bêta privée, saison 2026" },
  },
] as const;

/** Les trois piliers Halfred. Formation reste annoncée telle quelle : elle arrive plus tard. */
export const PILLARS = [
  {
    name: "Conseil",
    body:
      "Audit des process, cartographie de ce qui est automatisable, estimation du gain, roadmap priorisée.",
  },
  {
    name: "Délégation",
    body:
      "On prend l’automatisation en charge de bout en bout. Vous récupérez un système en production, pas une démo.",
  },
  {
    name: "Formation",
    body:
      "Montée en compétence de vos équipes sur les outils déployés. Ce pilier ouvre après les premiers déploiements.",
  },
] as const;

export const OFFERS = [
  {
    id: "audit",
    name: "Audit & Roadmap agentique",
    price: "1 500 €",
    priceNote: "créditable à 100 % sur un Déploiement signé sous 30 jours",
    duration: "2 à 4 jours",
    model: "Forfait",
    who:
      "Vous voulez savoir où l’IA vous ferait gagner du temps avant d’engager un budget de build.",
    included: [
      "Cadrage et cartographie des process",
      "Identification et scoring des opportunités",
      "Estimation du gain sur les process prioritaires",
      "Rapport d’audit et roadmap priorisée",
    ],
    excluded: ["Le build lui-même, qui relève de la Délégation"],
  },
  {
    id: "pilote",
    name: "Pilote",
    price: "3 000 €",
    priceNote: "fourchette 2 500 – 3 500 € selon le process",
    duration: "1 semaine (5 à 7 jours)",
    model: "Forfait",
    who:
      "Vous voulez la preuve de la valeur sur un seul process avant d’investir.",
    included: [
      "Cadrage du besoin",
      "Un process automatisé",
      "POC local sur vos données réelles",
      "Démonstration et note de recommandations",
    ],
    excluded: [
      "Mise en production durcie",
      "Intégrations multiples",
      "Maintenance",
    ],
  },
  {
    id: "deploiement",
    name: "Déploiement",
    price: "8 000 €",
    priceNote: "fourchette 6 000 – 12 000 € selon le périmètre",
    duration: "2 à 4 semaines (12 à 18 jours)",
    model: "Forfait",
    who:
      "Le Pilote est validé, ou le besoin est déjà clair, et vous voulez la mise en production.",
    included: [
      "Agent en production",
      "Sécurité par la topologie : RAG, interface locale, sortie réseau contrôlée",
      "Intégration à vos données et à vos outils",
      "Formation des utilisateurs et transfert",
      "Documentation",
    ],
    excluded: ["Évolutions post-livraison, qui relèvent du Run"],
  },
  {
    id: "run",
    name: "Run",
    price: "500 € / mois",
    priceNote: "fourchette 300 – 800 € selon le périmètre supervisé",
    duration: "Abonnement mensuel, terme à échoir",
    model: "Abonnement",
    who: "Votre système est en production et vous voulez le faire vivre.",
    included: [
      "Maintenance et supervision",
      "Évolutions mineures",
      "Support",
      "Point mensuel",
    ],
    excluded: ["Nouveau process ou gros chantier, qui repart en Déploiement"],
  },
] as const;

export const RATE = {
  value: "500 € / jour",
  note:
    "TJM de référence, base de chiffrage des forfaits et du conseil en régie.",
} as const;

/** La seule référence client. Ne jamais en ajouter une deuxième qui n’existe pas. */
export const CLIENT = {
  name: "ETS Maria",
  trade: "Pisciniste, région niçoise",
  since: "1937",
  status: "Devis 2026-001 signé",
  problem:
    "Les commerciaux rédigeaient chaque mail à la main. Les données de l’entreprise étaient éparpillées entre le catalogue Sage 100, la base clients, les devis et l’historique des échanges.",
  delivered:
    "Un agent de rédaction assistée des mails commerciaux — réponse client, relance de devis, mail libre — installé localement. Contrainte de conception : l’agent ne cite que des montants et des références réels issus des données de l’entreprise, jamais inventés.",
  /**
   * Peep n’est pas nommé : sa publication comme réalisation nommée reste une
   * décision non tranchée dans PRODUCT.md. Il est décrit par sa fonction, ce
   * qui est autorisé, et le restera tant que Paul n’aura pas tranché.
   */
  second:
    "Un second outil livré dans la foulée, interne à l’entreprise : à partir des dimensions du bassin, il déroule la chaîne de calcul hydraulique en onze étapes, associe les produits du catalogue et sort un devis modifiable en PDF.",
  /** Lignes chiffrées du bloc de preuve. Chaque valeur est vérifiable. */
  facts: [
    { label: "Secteur", value: "Pisciniste" },
    { label: "En activité depuis", value: "1937" },
    { label: "Statut commercial", value: "Devis 2026-001 signé" },
    { label: "Outils livrés", value: "2" },
    { label: "Installation", value: "Locale, sur leurs machines" },
  ],
} as const;

export const POOLCENTER = {
  version: "1.1.0",
  phase: "Bêta privée — tests terrain saison 2026",
  access: "Vitrine publique, application sur invitation",
  url: "https://poolcenter.app",
  problem:
    "Une entreprise d’entretien de piscines gère des dizaines d’interventions par jour sur autant de sites. Chaque passage exige des relevés sanitaires précis, la trace des produits utilisés et une preuve de passage — dans un cadre réglementaire qui ne pardonne pas.",
  /**
   * La journée d’un intervenant, dans l’ordre où elle arrive. C’est la même
   * matière que `features`, lue dans le temps plutôt qu’en périmètre : le
   * pisciniste reconnaît sa journée avant de lire une liste de fonctions.
   */
  day: [
    {
      time: "07 h 30",
      title: "La tournée du jour tombe",
      body:
        "Le planning est déjà assigné, regroupé par secteur, avec l’ordre de passage suggéré.",
    },
    {
      time: "09 h 10",
      title: "Premier bassin",
      body:
        "Relevés, analyses chimiques, produits utilisés, actions réalisées. La fiche est structurée, pas un champ libre.",
    },
    {
      time: "09 h 14",
      title: "Le pH sort de la plage",
      body:
        "L’alerte tombe pendant la saisie, pas le soir au bureau : pH hors 6,9 – 7,7, chlore combiné au-delà de 0,6 mg/l.",
    },
    {
      time: "14 h 00",
      title: "Zone blanche",
      body:
        "Le passage se saisit sans réseau. La synchronisation repart toute seule au retour de connexion.",
    },
    {
      time: "18 h 45",
      title: "Le rapport part",
      body:
        "PDF au format attendu par le carnet sanitaire, généré à la clôture, envoyé au propriétaire. Il le retrouve dans son portail.",
    },
  ],

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
] as const;

export const SCHOOL_PROJECTS = [
  {
    name: "ft_transcendence",
    body:
      "Jeu de Pong multijoueur temps réel : chat, authentification OAuth, profils.",
    stack: ["TypeScript", "React", "PostgreSQL"],
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
export const STACK_ICONS: ReadonlyArray<{ slug: string }> = [
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
  { slug: "fastapi" },
  { slug: "nodedotjs" },
  { slug: "tailwindcss" },
  { slug: "postgresql" },
  { slug: "supabase" },
  { slug: "sqlite" },
  { slug: "prisma" },
  { slug: "firebase" },
  { slug: "redis" },
  { slug: "ollama" },
  { slug: "huggingface" },
  { slug: "n8n" },
  { slug: "docker" },
  { slug: "kubernetes" },
  { slug: "ansible" },
  { slug: "nginx" },
  { slug: "googlecloud" },
  { slug: "vercel" },
  { slug: "gitlab" },
  { slug: "git" },
  { slug: "github" },
  { slug: "sonarqubeserver" },
];

/** Chemins figés ici : IconCloud a `images` dans ses dépendances d’effet, une
 *  liste reconstruite à chaque rendu le ferait boucler. */
export const STACK_ICON_URLS = STACK_ICONS.map(({ slug }) =>
  `/stack/${slug}.svg`
);

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
      "ASM",
    ],
  },
  {
    name: "Frameworks",
    items: [
      "Next.js",
      "React",
      "Angular",
      "Flutter",
      "Django",
      "FastAPI",
      "Node.js",
      "Tailwind CSS",
    ],
  },
  {
    name: "Données",
    items: ["PostgreSQL", "Supabase", "SQLite", "Prisma", "Firebase", "Redis"],
  },
  {
    name: "IA",
    items: ["RAG", "Ollama", "HuggingFace", "openEHR", "FHIR", "n8n"],
  },
  {
    name: "Infrastructure",
    items: [
      "Docker",
      "Kubernetes",
      "Ansible",
      "nginx",
      "GCP",
      "Vercel",
      "GitLab CI",
      "SonarQube",
    ],
  },
] as const;

export const LANGUAGES = [
  { name: "Français", level: "Langue maternelle" },
  { name: "Anglais", level: "Bilingue" },
  { name: "Espagnol", level: "Avancé" },
  { name: "Russe", level: "Débutant" },
  { name: "Chinois", level: "Débutant" },
] as const;

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/halfred/", label: "Halfred" },
  { href: "/poolcenter/", label: "PoolCenter" },
  { href: "/parcours/", label: "Parcours" },
] as const;
