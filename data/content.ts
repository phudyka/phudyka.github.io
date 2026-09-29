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
    price: "350€",
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
    price: "à partir de 490€",
    note: "En général de 490 à 900€",
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
    price: "1 200 à 2 500€",
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
    price: "2 500 à 5 000€",
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
    price: "à partir de 5 000€",
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
    name: "Site vitrine",
    price: "à partir de 1 500€",
    who: "Vous avez besoin d’une présence en ligne simple et claire.",
    included: ["Conception et mise en ligne"],
  },
  // Sites marchands et applications : planchers calés sur le marché freelance
  // français 2025-2026 (Codeur.com, Fenxi, AMN, Aquilapp, KreaRise), sous les agences.
  {
    id: "shop",
    name: "Site marchand",
    price: "à partir de 3 500€",
    note: "Abonnement à la plateforme et frais de paiement en plus",
    who: "Vous voulez vendre en ligne.",
    included: ["Catalogue, panier, paiement, gestion des commandes"],
  },
  {
    id: "webapp",
    name: "Application web",
    price: "à partir de 8 000€",
    note: "Première version, périmètre fixé ensemble",
    who: "Il vous faut un outil métier sur mesure.",
    included: ["Comptes, base de données, tableau de bord"],
  },
  {
    id: "hebergement",
    name: "Hébergement et maintenance",
    price: "39€ / mois",
    note: "Pour 1 ou 2 automatisations ; 79€ / mois au-delà",
    who: "Vous n’avez pas de serveur, ou vous ne voulez pas vous en occuper.",
    included: [
      "Serveur inclus",
      "Mises à jour",
      "Surveillance",
      "Petites corrections",
    ],
  },
];

/** Les conditions, lues en lignes chiffrées sous le parcours. */
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

/**
 * Copie de la landing Halfred (monde « Half-red », spec du 2026-09-29) : trois
 * écrans et un footer, rendus en FR et en EN par `components/section/halfred.tsx`.
 * Les prix restent dans `OFFERS` et `TERMS`. Les exemples sont des
 * **capacités**, jamais des réalisations : aucun client n’est livré ni signé.
 */
export type HalfredCopy = {
  home: string;
  hub: { label: string; href: string };
  nav: { label: string; about: string; principle: string; pricing: string; local: string; site: string; contact: string; menu: string };
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
    /** Nom, puis rôle ; le bloc mène au portfolio (`hub.href`). */
    paul: readonly [string, string];
    portraitAlt: string;
    safeguardsTitle: string;
    safeguards: readonly string[];
  };
  /** Principe d'une automatisation (pour qui, pourquoi, comment, sans intertitres) et schéma à faisceaux. */
  flow: { title: readonly [string, string]; accent: string; points: ReadonlyArray<readonly [string, string]>; diagram: string };
  /** Parcours au scroll : chaque étape cite ses offres par `id` (prix lus dans `OFFERS`). */
  pricing: {
    /** Sous chaque prix : HT ou TTC (franchise de TVA, donc les deux). */
    vat: string;
    title: string;
    /** Mots du titre passés en rouge ; `\n` sépare les lignes du titre. */
    accents: readonly string[];
    colon: string;
    /** `image` : numéro de l'illustration `step-N.webp`. `who` : à qui l'étape s'adresse. */
    steps: ReadonlyArray<{ offers: readonly string[]; title: string; body: string; who: string; image: number }>;
  };
  /** Section « 100 % local » : l'offre `local`, prix lu dans `OFFERS`. */
  local: { eyebrow: string; title: readonly [string, string]; accent: string; points: readonly string[]; alt: string };
  /** Section « site vitrine », service à côté : l'offre `site`, prix lu dans `OFFERS`. */
  site: {
    eyebrow: string; title: readonly [string, string]; accent: string; body: string;
    /** Une formule par type de site : son offre (`OFFERS`), son texte, ses captures. */
    kinds: readonly { offer: string; body: string; points: readonly string[]; shot: readonly [string, string] }[];
    credit: string;
  };
  /** Formulaire Halfred (envoi Web3Forms via `useWeb3Form`, boîte `business`). */
  contact: {
    title: string;
    accent: string;
    lead: string;
    subject: string;
    facts: readonly string[];
    direct: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    need: string;
    needs: readonly string[];
    message: string;
    placeholder: string;
    submit: string;
    submitting: string;
    sentTitle: string;
    sent: string;
    failed: string;
    privacy: string;
  };
  footer: { otherLang: { label: string; href: string } };
};

export const HALFRED: HalfredCopy = {
  home: "/halfred/",
  hub: { label: "À propos", href: "/" },
  nav: { label: "Navigation Halfred", about: "Approche", principle: "Principe", pricing: "Tarifs", local: "100% local", site: "Sites web", contact: "Contact", menu: "Menu" },
  title: { top: "Votre entreprise", minus: "moins", before: "les tâches ", loop: ["répétitives", "manuelles", "chronophages", "fastidieuses"], after: "." },
  lead: "Consultant en Automatisations et IA pour TPE/PME.",
  ctaContact: "Parler de votre besoin",
  ctaPricing: "Voir les tarifs",
  about: {
    title: ["Automatiser ce qui se répète,", "sans changer vos outils."],
    accent: "sans changer",
    halfred: "E-mails triés, clients relancés, devis calculés : tout tourne seul.",
    paul: ["Paul", "Consultant indépendant · Alpes‑Maritimes"],
    portraitAlt: "Paul",
    safeguardsTitle: "Trois garde-fous, sur chaque projet",
    safeguards: [
      "Les calculs passent par du code, jamais par le modèle.",
      "Rien ne part sans votre validation.",
      "Tout est écrit avant de commencer.",
    ],
  },
  flow: {
    title: ["Un message arrive,", "le reste suit tout seul."],
    accent: "tout seul",
    points: [
      ["Recopier, relancer, planifier…", "Les mêmes gestes, chaque semaine, dans les TPE et PME."],
      ["Du temps rendu", "Il revient à votre métier, avec moins d’erreurs de saisie."],
      ["Vous validez", "L’automatisation lit, range et prépare. Rien ne part sans vous."],
    ],
    diagram: "Schéma : les e-mails, messages WhatsApp et formulaires passent par Halfred, qui les range dans vos tableurs, votre agenda et vos documents.",
  },
  pricing: {
    vat: "Prix HT = TTC · TVA non applicable, art. 293 B du CGI",
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
        image: 3,
      },
      {
        offers: ["agent"],
        title: "Agent IA sur mesure",
        body: "Un assistant qui lit vos documents, rédige et répond. Vous validez chaque envoi.",
        who: "Pour les PME qui croulent sous les demandes écrites.",
        image: 4,
      },
      {
        offers: ["hebergement"],
        title: "Hébergement et maintenance",
        body: "Serveur, mises à jour et surveillance : tout reste en marche sans vous.",
        who: "Pour ne pas avoir à gérer la technique.",
        image: 6,
      },
    ],
  },
  local: {
    eyebrow: "100% local",
    title: ["Vos données", "ne vous quittent pas."],
    accent: "Jamais.",
    points: [
      "Le modèle d’IA tourne sur une machine installée chez vous.",
      "La sortie réseau est fermée : rien n’est envoyé à un fournisseur.",
      "Pour les données sensibles : clients, santé, juridique, finances.",
    ],
    alt: "Un bloc noir fermé, traversé d’une fente rouge lumineuse.",
  },
  site: {
    eyebrow: "À côté",
    title: ["Sites et applications", "web, sur mesure."],
    accent: "sur mesure",
    body: "Sans rapport avec l’automatisation, mais souvent demandé.",
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
    credit: "Tous les sites présentés sont mes réalisations : Halfred, Nikki Beach, PoolCenter.",
  },
  contact: {
    title: "Parlons de votre besoin.",
    accent: "besoin",
    lead: "Décrivez votre besoin en quelques lignes. Je vous dis si ça vaut le coup de l’automatiser, et ce que ça coûte.",
    subject: "Halfred — nouvelle demande",
    facts: ["Réponse sous 48 heures ouvrées", "Premier échange gratuit, 30 minutes", "Sur place dans les Alpes-Maritimes, ou à distance"],
    direct: "Ou directement par e-mail",
    name: "Nom",
    company: "Entreprise (facultatif)",
    email: "E-mail",
    phone: "Téléphone (facultatif)",
    need: "Votre besoin",
    needs: ["Automatiser une tâche", "Agent IA", "Agent 100 % local", "Je ne sais pas encore"],
    message: "Votre message",
    placeholder: "Ce que vos équipes refont à la main chaque semaine, les outils que vous utilisez, le temps que ça prend.",
    submit: "Envoyer ma demande",
    submitting: "Envoi…",
    sentTitle: "Message reçu.",
    sent: "Je vous réponds sous 48 heures ouvrées, depuis contact.halfred@gmail.com.",
    failed: "L’envoi n’a pas abouti. Réessayez, ou écrivez-moi directement à contact.halfred@gmail.com.",
    privacy: "Ces informations servent uniquement à répondre à votre demande. Elles ne sont ni revendues, ni réutilisées.",
  },
  footer: { otherLang: { label: "English", href: "/en/halfred/" } },
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

