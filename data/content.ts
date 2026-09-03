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
      "Mobile, tablette et navigateur depuis une seule base Flutter, mode hors-ligne compris. En bêta fermée pour la saison 2026, utilisée en conditions réelles.",
    marks: ["Flutter", "Supabase", "Bêta 2026"],
    figure: { value: "v0.2.0", label: "bêta fermée, saison 2026" },
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
    { label: "Encaissé", value: "0 €" },
  ],
} as const;

export const POOLCENTER = {
  version: "0.2.0",
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
  { name: "Anglais", level: "Professionnel — licence LEA" },
  { name: "Espagnol", level: "Professionnel — licence LEA" },
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
    figure: "v0.2.0",
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
      "Titre RNCP niveau 6, option applications web et mobile. Tronc commun achevé au niveau 14.25, 49 projets validés sur 66. Pédagogie par les pairs, sans cours ni professeur. Exam Rank 04, 05 et 06 validés à 100/100 — les trois examens chronométrés du tronc commun, sans accès à Internet ni assistance d’aucune sorte.",
  },
  {
    school: "Université Côte d’Azur",
    title: "Licence Langues Étrangères Appliquées",
    period: "2018 – 2022",
    body: "Anglais et espagnol, option russe.",
  },
] as const;

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/parcours/", label: "Parcours" },
  { href: "/poolcenter/", label: "PoolCenter" },
  { href: "/halfred/", label: "Halfred" },
] as const;
