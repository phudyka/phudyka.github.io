# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Visiteur principal :** dirigeant ou décideur de PME/TPE, généralement non
technique, qui découvre Paul Hudyka et cherche à savoir s'il peut lui confier un
chantier. Situation typique : l'entreprise perd du temps sur des tâches
répétitives (e-mails, relances, devis, rendez-vous, saisie entre outils) et veut
savoir ce qui peut s'automatiser, à quel prix. Cas plus rare : elle ne peut pas
laisser ses données partir vers un cloud tiers (réglementation ou exigence d'un
donneur d'ordre).

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
combinent pas : de l'**automatisation et de l'IA appliquée pour TPE et PME**,
jusqu'à l'agent installé au plus près des données du client, et des **produits
SaaS web et mobile complets** menés jusqu'à la mise en production.

**Halfred, depuis le 2026-09-28 :** Paul est **consultant en automatisation et
IA pour TPE et PME**, basé à La Colle-sur-Loup (Alpes-Maritimes), sur place et à
distance. La démarche : il audite d'abord comment l'entreprise travaille, puis
propose la solution adaptée au besoin et à l'infrastructure informatique en
place. Le discours est large — « tout ce qui se répète peut s'automatiser » — et
met en avant les **petits projets qui démarrent vite** : tri des e-mails et
brouillons de réponse, relances clients et factures, formulaire → devis PDF
calculé depuis les règles du client, prise de rendez-vous, rappels des contrats
d'entretien, connexion entre outils existants (mail, tableur, CRM, logiciel
métier), extraction de données de factures et de PDF, petits sites vitrines.
Sans serveur chez le client : hébergement sur un petit VPS avec un abonnement
simple.

Il sait aussi faire plus gros, plus long et plus cher : agent IA branché sur le
backend ou les outils du client, assistant sur les documents de l'entreprise
(RAG), agent 100 % local installé chez le client quand les données ne doivent
pas sortir. Pour ce dernier, la **sécurité par la topologie** reste l'argument :
le modèle n'a aucun chemin réseau pour exfiltrer, ce qui se démontre en
rendez-vous. C'est une réassurance, jamais l'accroche.

Garde-fous affichés sur tout projet : les calculs (prix, remises, stocks) sont
faits par du code vérifiable, jamais par le modèle ; rien ne part sans
validation humaine ; périmètre et critères de recette écrits avant de commencer.

Ces exemples sont des **capacités**, pas des réalisations : le site ne laisse
jamais entendre qu'un client a été livré ou qu'un projet est signé.

## Operating Context

Le site porte **l'identité personnelle de Paul Hudyka en ombrelle**. Deux
activités distinctes vivent dessous, plus une réalisation client :

**Halfred** — entreprise individuelle, exploitant Paul Hudyka. SIREN 107 717
530, SIRET 10771753000011, APE 6201Z (programmation informatique). Début
d'activité 17/07/2026. TVA non applicable, art. 293 B du CGI. Activité : conseil
en automatisation et IA pour TPE et PME, de la petite automatisation à l'agent
local. Grille décidée le 2026-09-28, **tarifs de lancement**, € HT :

| Offre                                                          | Périmètre                                                                                                  | Prix HT                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Échange de cadrage                                             | 30 minutes                                                                                                 | Gratuit                                                   |
| Audit                                                          | Demi-journée sur place ou en visio, restitution écrite (processus, outils, gains rapides possibles), devis | 350 €, déduit si une mission est signée dans les 30 jours |
| Automatisation express                                         | Un processus                                                                                               | À partir de 490 €, en général 490 à 900 €                 |
| Pack d'automatisations                                         | 2 à 4 processus connectés                                                                                  | 1 200 à 2 500 €                                           |
| Agent IA branché sur vos outils ou assistant sur vos documents | Agent sur le backend ou les outils du client, ou RAG sur ses documents                                     | 2 500 à 5 000 €                                           |
| Agent 100 % local                                              | Installé chez le client                                                                                    | Sur devis, à partir de 5 000 € hors matériel              |
| Petit site vitrine                                             | —                                                                                                          | 800 à 1 500 €                                             |
| Hébergement et maintenance                                     | Serveur inclus, mises à jour, surveillance, petites corrections                                            | 39 €/mois (1 ou 2 automatisations), 79 €/mois au-delà     |

Régie : 350 € / jour HT. Acompte de 30 % à la commande. Clés d'API et comptes
ouverts au nom du client. Aucune durée n'est publiée : elles n'ont pas été
fixées. L'ancienne grille (Pilote, Déploiement, Run, Audit & Roadmap, TJM) est
retirée depuis le 2026-09-28 et ne doit réapparaître nulle part.

**PoolCenter** — application métier multi-plateforme de gestion d'interventions
pour les professionnels de l'entretien de piscines (planification, saisie
terrain des fiches d'entretien, optimisation de tournées, rapports PDF au format
carnet sanitaire, portail client, mode hors-ligne). Flutter + Supabase,
production web sur Vercel, mobile Android et iOS. Version 0.3.0, **bêta privée
saison 2026**, utilisée en conditions réelles. Structure en cours
d'immatriculation, code protégé par dépôt e-Soleau (INPI).

**Peep** — outil de devis d'installations de piscines écrit pour ETS Maria
(prospect, non livré) : chaîne de calcul hydraulique en 11 étapes à partir des
dimensions du bassin, association automatique des produits du catalogue, devis
modifiable exportable en PDF.

Le contenu actuellement en ligne (recherche d'alternance Machine Learning,
expériences en vente et manutention, projets scolaires de l'École 42) appartient
à une orientation abandonnée.

## Capabilities and Constraints

- Site **statique** : Next.js App Router et Tailwind CSS v4 avec
  `output: 'export'`, publié sur GitHub Pages. Aucun backend n'est disponible ;
  un formulaire de contact relié à un service tiers exige un endpoint, et les
  variables `NEXT_PUBLIC_*` sont figées au moment du build. Sans endpoint, le
  formulaire compose le message dans la messagerie du visiteur.
- Contenu rédigé en français ; les pages Halfred (`/halfred/`,
  `/halfred/offres/`) ont une traduction anglaise fidèle sous `/en/`.
- Autorisé publiquement, par décision explicite : ETS Maria nommé comme premier
  prospect (jamais comme client), les offres Halfred avec leur périmètre, la
  grille de prix Halfred ci-dessus, les exemples de projets présentés comme
  capacités, l'existence de PoolCenter en bêta privée.
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
- **Ton Halfred :** artisan sérieux, concret, sans bullshit IA. Phrases courtes,
  français clair. Vouvoiement en clientèle.
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
  Prospect : devis 2026-001 émis, 1 000 € (tarif tremplin de lancement, hors
  grille), non signé, rien d'encaissé. Projet proposé : agent local de rédaction
  assistée des mails commerciaux, contraint à ne citer que des montants et
  références réels issus des données de l'entreprise. Peep a été écrit pour eux,
  pas livré.
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

Le `dashboard.md` du dépôt Halfred a longtemps affirmé « signé » ; il indique
désormais « devisé », 0 € signé (vérifié le 2026-09-28). Le devis lui-même
laisse son « Bon pour accord » vide. **Seul le devis fait foi.** Le site a
affirmé « premier client signé » jusqu'au 2026-09-03 à cause de lui.

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
