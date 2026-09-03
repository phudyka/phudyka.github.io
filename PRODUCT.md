# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Visiteur principal :** dirigeant ou décideur de PME/TPE, généralement non
technique, qui découvre Paul Hudyka et cherche à savoir s'il peut lui confier un
chantier. Situation typique : l'entreprise perd du temps sur des tâches métier
répétitives et, dans les cas qui justifient l'intervention, ne peut pas laisser
ses données partir vers un cloud tiers (réglementation ou exigence d'un donneur
d'ordre).

**Audience secondaire :** profils techniques qui évaluent le niveau réel via les
dépôts GitHub.

Le site est ouvert à tous, sans filtre d'audience. Il n'a **plus** d'objectif de
recrutement : la recherche d'alternance affichée dans le contenu actuel est
périmée et ne reflète plus l'orientation de Paul.

## Product Purpose

Vitrine unique de l'activité indépendante de Paul Hudyka. Elle sert à
transformer un visiteur en conversation commerciale.

Quatre issues valent succès, toutes retenues : une prise de contact directe, le
téléchargement du CV, une visite du GitHub ou du LinkedIn, et — à défaut
d'action immédiate — un profil mémorisé.

## Positioning

Paul Hudyka conçoit et déploie deux choses que la plupart des indépendants ne
combinent pas : de l'**IA appliquée installée au plus près des données du
client**, et des **produits SaaS web et mobile complets** menés jusqu'à la mise
en production.

Le différenciateur de l'activité IA (Halfred) est la **sécurité par la
topologie** : le modèle n'a aucun chemin réseau pour exfiltrer, ce qui est
démontrable en rendez-vous. « Vos données restent chez vous » cesse d'être un
slogan pour devenir une propriété vérifiable. C'est un argument de réassurance,
jamais l'accroche : on ouvre sur le résultat business, la topologie prouve.

## Operating Context

Le site porte **l'identité personnelle de Paul Hudyka en ombrelle**. Deux
activités distinctes vivent dessous, plus une réalisation client :

**Halfred** — entreprise individuelle, exploitant Paul Hudyka. SIREN 107 717
530, SIRET 10771753000011, APE 6201Z (programmation informatique). Début
d'activité 17/07/2026. TVA non applicable, art. 293 B du CGI. Activité :
conception et déploiement de solutions d'IA sur-mesure pour entreprises — agents
conversationnels et automatisation de tâches métier. Trois piliers : Conseil
(audit, cadrage), Formation (montée en compétence), Délégation (fait-pour-vous).
Quatre offres :

| Offre                     | Périmètre                                                                   | Durée / modèle          | Prix HT                                                |
| ------------------------- | --------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------ |
| Pilote                    | Cadrage, 1 process automatisé, POC local sur données réelles, démo          | ~1 semaine (5-7 j)      | 3 000 €                                                |
| Déploiement               | Agent en production, sécurité par topologie, intégrations, formation        | ~2-4 semaines (12-18 j) | 8 000 €                                                |
| Run                       | Maintenance, supervision, évolutions mineures, support                      | Abonnement mensuel      | 500 € / mois                                           |
| Audit & Roadmap agentique | Cartographie des process, scoring des opportunités, estimation ROI, roadmap | ~2-4 jours              | 1 500 €, créditable sur un Déploiement signé sous 30 j |

TJM de référence : 500 € / jour HT. Forfaits : acompte 30 % à la commande, solde
à la livraison.

**PoolCenter** — application métier multi-plateforme de gestion d'interventions
pour les professionnels de l'entretien de piscines (planification, saisie
terrain des fiches d'entretien, optimisation de tournées, rapports PDF au format
carnet sanitaire, portail client, mode hors-ligne). Flutter + Supabase,
production web sur Vercel, mobile Android et iOS. Version 0.3.0, **bêta privée
saison 2026**, utilisée en conditions réelles. Structure en cours
d'immatriculation, code protégé par dépôt e-Soleau (INPI).

**Peep** — outil interne de devis d'installations de piscines livré à ETS Maria
: chaîne de calcul hydraulique en 11 étapes à partir des dimensions du bassin,
association automatique des produits du catalogue, devis modifiable exportable
en PDF.

Le contenu actuellement en ligne (recherche d'alternance Machine Learning,
expériences en vente et manutention, projets scolaires de l'École 42) appartient
à une orientation abandonnée.

## Capabilities and Constraints

- Site **statique** : Next.js App Router et Tailwind CSS v4 avec
  `output: 'export'`, publié sur GitHub Pages. Aucun backend n'est disponible ;
  un formulaire de contact relié à un service tiers exige un endpoint, et les
  variables `NEXT_PUBLIC_*` sont figées au moment du build. Sans endpoint, le
  formulaire compose le message dans la messagerie du visiteur.
- Contenu rédigé en français.
- Autorisé publiquement, par décision explicite : ETS Maria nommé comme client,
  les offres Halfred avec leur périmètre et leur durée, la grille de prix
  Halfred ci-dessus, l'existence de PoolCenter en bêta privée.
- Canaux de contact retenus : formulaire sans adresse exposée, adresse
  contact.halfred@gmail.com, LinkedIn ou prise de rendez-vous, GitHub
  (github.com/phudyka) comme preuve technique.

**Décisions ouvertes, à ne pas trancher à la place de Paul :**

- Le formulaire « sans mail exposé » et l'affichage de contact.halfred@gmail.com
  ont tous deux été retenus ; l'arbitrage entre les deux reste à faire.
- Le compte contact.halfred@gmail.com reste à créer selon le dépôt Halfred.
- Aucune URL LinkedIn ni de lien de prise de rendez-vous n'a été fournie.
- La publication de Peep comme réalisation nommée n'a pas été tranchée.

## Brand Commitments

- **Nom porteur :** Paul Hudyka. Halfred et PoolCenter apparaissent comme
  réalisations sous cette ombrelle, pas comme marques concurrentes du nom.
- **Ton Halfred :** artisan sérieux, concret, sans bullshit IA. Vouvoiement en
  clientèle.
- **Ordre d'argumentation imposé :** le résultat business ouvre, la garantie
  technique prouve. Jamais l'inverse.
- **Direction visuelle retenue :** le standard de la catégorie, joué droit. Paul
  a explicitement écarté les mondes visuels alternatifs proposés et choisi la
  convention, assumée sans ironie ni détournement. Barre de finition à atteindre
  : Linear, Vercel, Stripe.
- **Assets existants :** logo Halfred (`~/Halfred/entreprise/halfred-logo.png`)
  et la photo de profil, servie en `public/paul-hudyka.webp`. L'image de fond de
  l'ancien site a été supprimée du dépôt : la direction retenue ne s'en sert
  pas.

## Evidence on Hand

- **ETS Maria** — pisciniste de la région niçoise, en activité depuis 1937.
  Devis 2026-001 signé, 1 000 € (tarif tremplin de lancement, hors grille).
  Déploiement d'un agent local de rédaction assistée des mails commerciaux,
  contraint à ne citer que des montants et références réels issus des données de
  l'entreprise. Outil Peep également livré.
- **PoolCenter** v0.3.0 en bêta privée, utilisée en conditions réelles par des
  professionnels.
- **Missions GPI France citables** : KeyMaster (gestion de licences logicielles,
  Django / Angular / PostgreSQL, signature ECDSA + SHA-256) et Remote Monitoring
  (POC médical, capteurs Cosinuss° C-MED Alpha vers un RAG, conversion JSON →
  openEHR/FHIR).
- **Dépôts GitHub publics** : github.com/phudyka (ft_transcendence, ft_irc,
  cub3d, minishell).
- **CV PDF** existant en local, à rendre public (actuellement gitignoré).

**Absences à ne jamais combler par invention :** aucun témoignage client, aucun
logo client, aucun chiffre de ROI documenté, aucune référence client, aucun
encaissement. **Aucun client signé à ce jour** — corrigé le 2026-09-03 : ETS
Maria est un prospect, son devis 2026-001 est émis et n'a jamais été retourné
signé, et le projet attend d'eux leur méthode de chiffrage, jamais formalisée.

Le `dashboard.md` du dépôt Halfred affirme le contraire — « signé », « 1 000 €
signé ». Il est faux : le devis lui-même laisse son « Bon pour accord » vide et
garde « [À COMPLÉTER] » sur les coordonnées du client. **Ne jamais le prendre
pour source.** Le site a affirmé « premier client signé » jusqu'au 2026-09-03 à
cause de lui.

## Product Principles

1. **Le résultat business ouvre, la technique prouve.** L'argument de sécurité,
   la stack et l'architecture ne sont jamais l'accroche.
2. **Une ombrelle, deux activités lisibles.** Un visiteur doit comprendre en un
   coup d'œil que Halfred et PoolCenter sont deux choses différentes portées par
   la même personne.
3. **Rien qui ne soit dans Evidence on Hand.** Sans client signé, la crédibilité
   vient de la précision des preuves réelles, pas du volume.
4. **La contrainte statique est structurante.** Toute fonctionnalité proposée
   doit tenir sans backend propre.
5. **Chaque section ramène au contact.** Le site vend une conversation, pas un
   produit en libre-service.
