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
  },
  {
    id: "audit",
    name: "Audit",
    price: "à partir de 350€",
    note: "Selon la taille de l’équipe. Déduit si une mission est signée sous 30 jours",
  },
  {
    id: "express",
    name: "Automatisation express",
    price: "à partir de 490€",
    note: "En général de 490 à 900€",
  },
  {
    id: "pack",
    name: "Pack d’automatisations",
    price: "1 200 à 2 500€",
  },
  {
    id: "agent",
    name: "Agent IA ou assistant sur vos documents",
    price: "2 500 à 5 000€",
  },
  {
    id: "local",
    name: "Agent 100 % local",
    price: "à partir de 5 000€",
    note: "Sur devis, hors matériel",
  },
  {
    id: "site",
    name: "Site vitrine",
    price: "à partir de 1 500€",
  },
  // Sites marchands et applications : planchers calés sur le marché freelance
  // français 2025-2026 (Codeur.com, Fenxi, AMN, Aquilapp, KreaRise), sous les agences.
  {
    id: "shop",
    name: "Site marchand",
    price: "à partir de 3 500€",
    note: "Abonnement à la plateforme et frais de paiement en plus",
  },
  {
    id: "webapp",
    name: "Application web",
    price: "à partir de 8 000€",
    note: "Première version, périmètre fixé ensemble",
  },
  {
    id: "hebergement",
    name: "Suivi et hébergement",
    price: "39€ / mois",
    note: "Après la mise en place, pour 1 ou 2 automatisations ; 79€ / mois au-delà",
  },
];




/**
 * Copie de la landing Halfred (monde « Half-red », spec du 2026-09-29) : trois
 * écrans et un footer, rendus en FR et en EN par `components/section/halfred.tsx`.
 * Les prix restent dans `OFFERS` et `TERMS`. Les exemples sont des
 * **capacités** ; les réalisations réelles sont citées à part (`refs`), sans
 * statut de livraison ni de signature.
 */
/**
 * Morceau d'une phrase de réalisations : du texte, ou un nom survolable avec
 * son aperçu (capture `site-<shot>.webp` facultative, lien facultatif).
 */
export type RefPart = string | { name: string; desc: string; shot?: string; href?: string };

export type HalfredCopy = {
  home: string;
  hub: { label: string; href: string };
  nav: { label: string; about: string; principle: string; local: string; site: string; pricing: string; contact: string; menu: string };
  /** Titre du hero en soustraction : `top`, puis `minus` en rouge, `before`, le mot qui tourne (`loop`, le premier est lu), `after`. */
  title: { top: string; minus: string; before: string; loop: readonly string[]; after: string };
  lead: string;
  ctaContact: string;
  ctaPricing: string;
  about: {
    /** Deux lignes, coupées au sens ; `accent` (dans la 2e ligne) passe en rouge. */
    title: readonly [string, string];
    accent: string;
    /** Une ligne courte, en petit. */
    halfred: string;
    /**
     * À quoi sert l'automatisation : trois cartes, chacune avec une mini-démo
     * animée (`demo`, données fictives d'illustration), un titre, le concret.
     * Démo 1 : [tâche, rythme] ; démo 2 : [notification, détail, il y a] ; démo 3 :
     * [outil], en-têtes, puis un compteur par ligne.
     */
    gains: ReadonlyArray<{ title: string; body: string; demo: ReadonlyArray<readonly string[]> }>;
  };
  /** Principe d'une automatisation (pour qui, pourquoi, comment, sans intertitres) et schéma à faisceaux. */
  flow: { title: readonly [string, string]; accent: string; points: ReadonlyArray<readonly [string, string]>; chips: readonly [readonly string[], readonly string[], readonly string[]]; mess: readonly string[]; diagram: string };
  /** Parcours au scroll : chaque étape cite ses offres par `id` (prix lus dans `OFFERS`). */
  pricing: {
    /** Sous chaque prix : HT ou TTC (franchise de TVA, donc les deux). */
    vat: string;
    /** Sous le titre : les montants s'ajustent à la taille de l'entreprise. */
    size: string;
    title: string;
    /** Mots du titre passés en rouge ; `\n` sépare les lignes du titre. */
    accents: readonly string[];
    colon: string;
    /** `image` : numéro de l'illustration `step-N.webp`, une par offre quand l'étape en a plusieurs (absente : la suivante sert). `who` : à qui l'étape s'adresse. */
    steps: ReadonlyArray<{ offers: readonly string[]; title: string; body: string; who: string; image: number | readonly number[] }>;
  };
  /** Section « 100 % local » : l'offre `local`, prix lu dans `OFFERS`. */
  local: {
    eyebrow: string; title: readonly [string, string]; accent: string; lead: string; points: readonly string[]; alt: string;
    /** Réalisation citée sous les points : noms survolables (voir `RefText`). */
    ref: readonly RefPart[];
  };
  /** Section « site vitrine », service à côté : l'offre `site`, prix lu dans `OFFERS`. */
  site: {
    eyebrow: string; title: readonly [string, string]; accent: string; body: string;
    /** Une formule par type de site : son offre (`OFFERS`), son texte, ses captures. */
    kinds: readonly { offer: string; body: string; points: readonly string[]; shot: readonly [string, string] }[];
    /** Réalisations, en phrase : noms survolables qui montrent un aperçu. */
    refs: readonly RefPart[];
  };
  /** Formulaire Halfred (envoi Web3Forms via `useWeb3Form`, boîte `business`). */
  contact: {
    title: string;
    accent: string;
    lead: string;
    subject: string;
    direct: string;
    mail: string;
    firstName: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    placeholder: string;
    submit: string;
    submitting: string;
    sentTitle: string;
    sent: string;
    failed: string;
  };
  /** `tagline` : une phrase sous le grand mot-marque, ce qu'est Halfred. */
  footer: { tagline: string; otherLang: { label: string; href: string } };
};

export const HALFRED: HalfredCopy = {
  home: "/halfred/",
  hub: { label: "À propos", href: "/" },
  nav: { label: "Navigation Halfred", about: "Pourquoi", principle: "Comment", local: "IA locale", site: "Sites web", pricing: "Tarifs", contact: "Contact", menu: "Menu" },
  title: { top: "Votre entreprise", minus: "moins", before: "les tâches ", loop: ["répétitives", "manuelles", "chronophages", "fastidieuses"], after: "." },
  lead: "Consultant en automatisations et IA pour les TPE et PME, sur place ou à distance.",
  ctaContact: "Parler de votre besoin",
  ctaPricing: "Voir les tarifs",
  about: {
    title: ["Chaque semaine,", "les mêmes tâches reviennent."],
    accent: "reviennent",
    halfred: "Recopier, relancer, chercher une info : autant de temps pris à votre métier, et d’erreurs qui s’installent.",
    gains: [
      {
        title: "Des heures qui filent",
        body: "Tri des e-mails, saisie, rapports : les mêmes gestes, chaque semaine, grignotent les journées de vos équipes.",
        demo: [["Tri des e-mails", "Chaque matin"], ["Saisie des factures", "À réception"], ["Relances clients", "J+7"], ["Prise de rendez-vous", "En continu"], ["Mise à jour du tableur", "Chaque soir"], ["Rapport de la semaine", "Le lundi"]],
      },
      {
        title: "Des oublis qui coûtent",
        body: "Un devis pas relancé, un rendez-vous oublié, une facture qui traîne : quand tout repose sur la mémoire, quelque chose finit par passer.",
        demo: [
          ["Devis sans réponse", "Aucune relance depuis 12 jours", "2 min"],
          ["Rendez-vous non confirmé", "Demain 9 h, client pas prévenu", "15 min"],
          ["Facture impayée", "Échue depuis 30 jours", "1 h"],
          ["Contrat expiré", "Renouvellement oublié", "3 h"],
        ],
      },
      {
        title: "Des outils qui ne se parlent pas",
        body: "Le même client recopié du mail au tableur, puis au logiciel : chaque ressaisie prend du temps et crée des erreurs.",
        demo: [["Tableur"], ["À faire à la main", "Semaine", "Écart"], ["Ressaisies mail vers tableur"], ["Relances à faire"], ["Devis à recalculer"], ["Doublons clients"], ["Factures à rapprocher"], ["Commandes à recopier"], ["Fiches clients à compléter"], ["Rendez-vous à confirmer"]],
      },
    ],
  },
  flow: {
    title: ["Un message arrive,", "le reste suit tout seul."],
    accent: "tout seul",
    points: [
      ["C’est la pagaille", "E-mails, messages, formulaires : tout arrive en même temps, dans le désordre, et s’empile. Un échange puis un audit, sur place si besoin, pour voir ce qui se répète et ce que ça vous coûte."],
      ["J’arrive, je remets de l’ordre", "Je trie ce qui arrive et je branche les outils que vous avez déjà, sans changer de logiciel. Hébergé en Europe ou 100 % local : vous choisissez. Si un logiciel n’a pas de passerelle, je la construis."],
      ["Tout s’enchaîne, proprement", "Chaque message ressort rangé au bon endroit : tableur, agenda, documents. Les calculs passent par du code, rien ne part sans votre validation, et j’en réponds."],
    ],
    // Étiquettes qui circulent, par entrée → sortie (e-mail → tableur, WhatsApp → agenda, formulaire → documents).
    // Bulles d'erreur de la pagaille, autour du PC.
    mess: ["Erreur", "Doublon", "Oublié ?", "Hors ligne"],
    chips: [["Facture 318", "420 €", "Relance J+7"], ["RDV 14h30", "Mardi 9h", "Rappel"], ["Devis #204", "1 250 €", "Contrat"]],
    diagram: "Schéma : les e-mails, messages WhatsApp et formulaires passent par Halfred, qui les range dans vos tableurs, votre agenda et vos documents.",
  },
  pricing: {
    vat: "Prix HT = TTC · TVA non applicable, art. 293 B du CGI",
    size: "Montants de départ pour une petite équipe : ils s’ajustent au nombre de personnes et d’outils concernés.",
    title: "Combien ça coûte ?\nComment ça marche ?",
    accents: ["marche", "coûte"],
    colon: " : ",
    steps: [
      {
        offers: ["cadrage"],
        title: "Diagnostic du besoin",
        body: "30 minutes au téléphone pour repérer ce qui vous fait perdre du temps.",
        who: "Pour savoir par où commencer.",
        image: 1,
      },
      {
        offers: ["audit"],
        title: "Audit des processus",
        body: "Une demi-journée à observer votre façon de travailler, puis un rapport écrit et un devis.",
        who: "Pour avoir un plan chiffré avant d’investir.",
        image: 2,
      },
      {
        offers: ["express", "pack"],
        title: "Automatisation des tâches",
        body: "E-mails triés, clients relancés, devis calculés, branchés sur vos outils actuels.",
        who: "Pour les équipes qui refont les mêmes gestes chaque semaine.",
        image: [7, 3],
      },
      {
        offers: ["agent"],
        title: "Agent IA sur mesure",
        body: "Un assistant réglé sur vos documents et vos règles : il lit, rédige et répond. Les calculs passent par le code, vous validez chaque envoi. Le modèle adapté à chaque tâche, sur votre propre compte.",
        who: "Pour les PME qui croulent sous les demandes écrites.",
        image: 4,
      },
      {
        offers: ["hebergement"],
        title: "Suivi et hébergement",
        body: "Hébergé en Europe, conforme au RGPD : mises à jour, surveillance et ajustements. Tout reste en marche sans vous.",
        who: "Pour ne pas avoir à gérer la technique.",
        image: 6,
      },
    ],
  },
  local: {
    eyebrow: "100% local",
    title: ["Vos données", "ne vous quittent pas."],
    accent: "Jamais.",
    lead: "Un assistant IA qui tourne chez vous, pas dans le cloud d’un fournisseur.",
    points: [
      "J’installe une machine dédiée dans vos locaux, avec le modèle d’IA dessus.",
      "L’agent travaille sur vos documents et vos outils, sans connexion vers l’extérieur.",
      "Pour les données sensibles : clients, santé, juridique, finances.",
    ],
    alt: "Un bloc noir fermé, traversé d’une fente rouge lumineuse.",
    ref: [
      "Réalisation : l’agent local d’",
      { name: "ETS Maria", desc: "Les données ne sortent pas de l’entreprise, et les devis sont calculés par le code, jamais par le modèle.", href: "https://www.ets-maria.com/" },
      ", pisciniste depuis 1937, sur un ",
      { name: "Mac mini M5 Pro", desc: "La configuration utilisée : CPU 15 cœurs, GPU 16 cœurs, 64 Go de mémoire unifiée, SSD 512 Go, Ethernet 2,5 Gb/s.", href: "https://www.apple.com/fr/mac-mini/specs/" },
      ".",
    ],
  },
  site: {
    eyebrow: "À côté",
    title: ["Sites et applications", "web, sur mesure."],
    accent: "sur mesure",
    body: "Vitrine, boutique ou outil métier, branchés sur vos automatisations : un écosystème, pas des logiciels isolés.",
    kinds: [
      {
        offer: "site",
        body: "Quelques pages à votre image pour être trouvé et contacté : design sur mesure, adapté au mobile, bien référencé.",
        points: ["3 à 6 pages, design sur mesure", "Adapté au mobile, bien référencé sur Google", "Formulaire de contact, mise en ligne comprise"],
        shot: ["halfred", "Halfred · réalisation"],
      },
      {
        offer: "shop",
        body: "Une boutique prête à vendre : votre catalogue en ligne, panier, paiement sécurisé et suivi des commandes.",
        points: ["Catalogue et fiches produits", "Panier et paiement sécurisé par carte", "Suivi des commandes et des stocks"],
        shot: ["nikki", "Nikki Beach mobilier · réalisation"],
      },
      {
        offer: "webapp",
        body: "Un outil métier sur mesure : comptes utilisateurs, base de données, tableau de bord et vos processus.",
        points: ["Comptes utilisateurs et droits d’accès", "Base de données et tableau de bord", "Vos processus métier, sur mesure"],
        shot: ["poolcenter", "PoolCenter · réalisation"],
      },
    ],
    refs: [
      "Réalisations : ",
      { name: "PoolCenter", desc: "Le logiciel d’interventions de Piscine Center, sur le web, Android et iOS.", shot: "poolcenter" },
      " pour Piscine Center, le catalogue ",
      { name: "Nikki Beach", desc: "Catalogue bilingue du mobilier, vue 3D, demande de devis.", shot: "nikki" },
      " et ce site, ",
      { name: "Halfred", desc: "Conception, animations et mise en ligne.", shot: "halfred" },
      ".",
    ],
  },

  contact: {
    title: "Parlons de votre futur agent.",
    accent: "agent",
    lead: "Dites-moi ce qui vous fait perdre du temps : je vous indique ce qui vaut la peine d’être automatisé, à quel coût, puis je m’occupe du reste.",
    subject: "Halfred — nouvelle demande",
    direct: "Ou directement par e-mail",
    mail: "Écrire par e-mail",
    firstName: "Prénom",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone (facultatif)",
    message: "Votre message",
    placeholder: "Ce que vos équipes refont à la main chaque semaine, les outils que vous utilisez, le temps que ça prend.",
    submit: "Envoyer ma demande",
    submitting: "Envoi…",
    sentTitle: "Message reçu.",
    sent: "Je vous réponds sous 48 heures ouvrées, depuis contact.halfred@gmail.com.",
    failed: "L’envoi n’a pas abouti. Réessayez, ou écrivez-moi directement à contact.halfred@gmail.com.",
  },
  footer: {
    tagline: "Automatisations et IA sur mesure pour TPE/PME.",
    otherLang: { label: "English", href: "/en/halfred/" },
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
 * commercial n'a pas disparu, il vit sous /halfred/, où
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
      "Anglais et espagnol, option russe. Cursus interrompu en troisième année pour 42 : diplôme non obtenu.",
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

