---
name: Paul Hudyka — Halfred
description: Site commercial d'un indépendant IA, lu comme un CV dense: colonne unique, lignes chiffrées, un seul orange.
  colors:
    primary: "oklch(0.75 0.17 58)"
    primary-foreground: "oklch(0.2 0.04 50)"
    ring: "oklch(0.75 0.17 58)"
    background: "oklch(0.155 0.006 285)"
    foreground: "oklch(0.965 0.002 285)"
    card: "oklch(0.192 0.007 285)"
    muted: "oklch(0.225 0.008 285)"
    muted-foreground: "oklch(0.685 0.011 285)"
    accent: "oklch(0.235 0.009 285)"
    border: "oklch(0.28 0.009 285)"
    success: "oklch(0.72 0.14 155)"
    destructive: "oklch(0.68 0.17 25)"
    background-light: "oklch(0.995 0.001 285)"
    foreground-light: "oklch(0.17 0.006 285)"
    card-light: "oklch(1 0 0)"
    muted-light: "oklch(0.965 0.002 285)"
    muted-foreground-light: "oklch(0.5 0.011 285)"
    accent-light: "oklch(0.955 0.004 285)"
    border-light: "oklch(0.905 0.004 285)"
    primary-light: "oklch(0.72 0.175 55)"
    primary-foreground-light: "oklch(0.21 0.04 50)"
    ring-light: "oklch(0.55 0.16 45)"
    success-light: "oklch(0.55 0.13 155)"
    destructive-light: "oklch(0.55 0.2 27)"
  typography:
    display:
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize: "3rem"
      fontWeight: 600
      lineHeight: 1.1
      letterSpacing: "-0.035em"
    headline:
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize: "1.65rem"
      fontWeight: 500
      lineHeight: 1.375
      letterSpacing: "-0.018em"
    title:
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize: "1.25rem"
      fontWeight: 600
      lineHeight: 1.4
      letterSpacing: "-0.025em"
    subtitle:
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize: "1.125rem"
      fontWeight: 600
      lineHeight: 1.4
      letterSpacing: "-0.025em"
    body:
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize: "1rem"
      fontWeight: 400
      lineHeight: 1.625
      letterSpacing: "normal"
    small:
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize: "0.875rem"
      fontWeight: 400
      lineHeight: 1.625
      letterSpacing: "normal"
    label:
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize: "0.75rem"
      fontWeight: 500
      lineHeight: 1.5
      letterSpacing: "normal"
    figure:
      fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
      fontSize: "0.875rem"
      fontWeight: 500
      lineHeight: 1.5
      fontFeature: "tnum"
  rounded:
    sm: "6px"
    md: "8px"
    lg: "10px"
    xl: "14px"
    full: "9999px"
  spacing:
    "1.5": "6px"
    "2": "8px"
    "3": "12px"
    "4": "16px"
    "5": "20px"
    "6": "24px"
    "14": "56px"
    "16": "64px"
  components:
    button-primary:
      backgroundColor: "{colors.primary}"
      textColor: "{colors.primary-foreground}"
      rounded: "{rounded.md}"
      padding: "0 16px"
      height: "40px"
      typography: "{typography.small}"
    button-primary-hover:
      backgroundColor: "color-mix(in oklch, {colors.primary} 88%, transparent)"
    button-secondary:
      backgroundColor: "{colors.card}"
      textColor: "{colors.foreground}"
      rounded: "{rounded.md}"
      padding: "0 16px"
      height: "40px"
      typography: "{typography.small}"
    button-secondary-hover:
      backgroundColor: "{colors.accent}"
    chip-link:
      backgroundColor: "{colors.card}"
      textColor: "{colors.foreground}"
      rounded: "{rounded.md}"
      padding: "0 14px"
      height: "40px"
      typography: "{typography.small}"
    tag:
      backgroundColor: "color-mix(in oklch, {colors.muted} 60%, transparent)"
      textColor: "{colors.muted-foreground}"
      rounded: "{rounded.sm}"
      padding: "0 8px"
      height: "24px"
      typography: "{typography.label}"
    input:
      backgroundColor: "{colors.background}"
      textColor: "{colors.foreground}"
      rounded: "{rounded.md}"
      padding: "10px 12px"
      typography: "{typography.small}"
    card:
      backgroundColor: "{colors.card}"
      textColor: "{colors.foreground}"
      rounded: "{rounded.xl}"
      padding: "24px"
    nav-dock:
      backgroundColor: "{colors.background}"
      textColor: "{colors.muted-foreground}"
      rounded: "{rounded.full}"
      padding: "4px"
    nav-dock-active:
      backgroundColor: "{colors.accent}"
      textColor: "{colors.foreground}"
---

# Design System: Paul Hudyka — Halfred

## Overview

**Creative North Star : « Le CV imprimé »**

Le site se lit comme une feuille dense posée sur une table, pas comme une
landing. Une seule colonne de 42rem, des sections empilées sans encadrement
décoratif, des lignes compactes où le libellé tient à gauche et le chiffre à
droite en chiffres tabulaires. La densité est l'argument commercial : le
visiteur obtient les prix, les preuves et les contraintes sans cliquer, comme il
les obtiendrait d'un document.

La matière est neutre et froide : une rampe oklch quasi désaturée sur une teinte
de 285°, un unique orange porteur à 55°, et des bordures de 1px qui font tout le
travail de séparation. Le sombre est le thème par défaut et le clair est un pair
complet, retokenisé ligne à ligne, pas un inverse mécanique. Rien ne brille :
pas de dégradé de texte, pas de verre décoratif, pas de grille de cartes
icône-titre-texte comme structure de page.

Le mouvement est rare au point d'être un événement. Un seul moment orchestré sur
tout le site — le nom qui se pose en tête d'accueil — et une révélation
d'ambiance réservée à la première section sous la ligne de flottaison de chaque
page. Tout le reste est visible d'emblée. Une entrée répétée sur chaque section
n'est pas un moment, c'est un tic.

**Key Characteristics:**

- Colonne unique `max-w-2xl` (42rem), mesure de corps 62ch au bureau, 35ch en
  mobile
- Neutres oklch teinte 285, un seul accent orange (55°), aucun second accent
  décoratif
- Bordures 1px et fonds tonaux : c'est la seule grammaire de séparation
- Inter en corps, JetBrains Mono strictement réservé aux chiffres et références
- Sombre par défaut, préférence système désactivée, clair pair complet
- Deux durées de mouvement en tout, coupées sous `prefers-reduced-motion`

## Colors

Une rampe neutre froide (chroma ≤ 0.011, teinte 285) portée par un seul orange ;
la couleur ne sert jamais à décorer, seulement à hiérarchiser ou à signaler un
état.

### Primary

- **Orange porteur** (`oklch(0.75 0.17 58)` en sombre, `oklch(0.72 0.175 55)` en
  clair) : l'action « Demander un devis », l'anneau de focus, et la sélection de
  texte (à 28% d'opacité). Nulle part ailleurs. Sur une page complète il occupe
  un bouton et un liseré de focus.

### Neutral

- **Fond de page** : la surface sur laquelle tout repose ; c'est aussi le fond
  de la pastille du dock et des champs de formulaire, pour qu'ils se lisent
  comme des trous et non comme des reliefs.
- **Carte** : le seul niveau au-dessus du fond, un cran plus clair en sombre et
  blanc pur en clair. Il porte les blocs d'offres, de missions et les puces de
  contact.
- **Muted / Accent** : deux crans intermédiaires réservés aux étiquettes
  (`muted`) et au survol des surfaces interactives (`accent`). Ils ne servent
  jamais de fond de section.
- **Texte secondaire** (`muted-foreground`) : tout le corps explicatif. Le texte
  pleine force est réservé aux titres, aux valeurs chiffrées et à la garantie.
- **Bordure** : 1px, utilisée comme séparateur de lignes (`border-b`,
  `divide-y`), contour de carte, et filet vertical de citation client.

### Feedback

- **Succès** (`oklch(0.72 0.14 155)`) : la coche des inclusions d'une offre et
  la confirmation d'envoi du formulaire. Uniquement sur un pictogramme ou une
  ligne d'état.
- **Erreur** (`oklch(0.68 0.17 25)`) : le message d'échec d'envoi. Rien d'autre.

### Named Rules

**La règle de l’orange unique.** Un seul accent existe. Une surface qui a besoin
d'un second accent a en réalité besoin d'une hiérarchie typographique. Le succès
et l'erreur ne sont pas des accents : ce sont des états, et ils ne colorent
jamais un fond, seulement un glyphe ou une ligne de texte.

**La règle du filet 1px.** Toute séparation est une bordure de 1px à la couleur
de bordure du thème. Pas de filet coloré, pas de barre épaisse, pas d'ombre en
guise de séparateur.

## Typography

**Display / Body Font :** Inter (auto-hébergée via `next/font`, repli
`ui-sans-serif, system-ui`) **Figure / Mono Font :** JetBrains Mono (repli
`ui-monospace, SFMono-Regular`)

**Character :** Inter en variantes stylistiques `cv02 cv03 cv04 cv11` — un
grotesque neutre au dessin plus sec que par défaut, qui tient la densité sans
devenir bruyant. JetBrains Mono n'apparaît que là où des chiffres doivent
s'aligner en colonne.

### Hierarchy

- **Display** (600, 2.25rem → 3rem à ≥640px, `tracking-[-0.035em]`) : le nom en
  tête d'accueil et le titre de chaque page. Un seul par page.
- **Headline** (500, 1.5rem → 1.65–1.7rem, interligne serré, `text-balance`) :
  la phrase de résultat métier sous le titre.
- **Garantie** (500, 1.125rem, pleine force, `max-w-[60ch]`) : l'argument de
  topologie. Elle se distingue par le poids et la couleur, jamais par un filet
  ni un encadré.
- **Title** (600, 1.25rem, `tracking-tight`, `text-balance`) : le titre de
  section (`h2`).
- **Subtitle** (600, 1.125rem, `tracking-tight`) : le nom d'une offre, d'une
  mission, d'une activité (`h3`).
- **Body** (400, 1rem, interligne 1.625, `text-pretty`, couleur secondaire) :
  les chapôs de section et le corps explicatif. Mesure 62ch au bureau, 35ch en
  mobile.
- **Small** (400, 0.875rem) : le contenu des lignes de données, des cartes et
  des formulaires — la densité de la page vit à ce corps.
- **Label** (500, 0.75rem, couleur secondaire) : les étiquettes de compétence.
- **Figure** (500, mono ou `.num`, 0.75–1.125rem, chiffres tabulaires) : prix,
  dates, SIREN, versions, durées.

### Named Rules

**La règle du mono chiffré.** JetBrains Mono et l'utilitaire `.num` ne servent
qu'aux chiffres, aux références légales et aux dates. Un mot en mono est une
faute.

**La règle du chiffre à droite.** Toute paire libellé/valeur s'écrit sur une
ligne : libellé à gauche en corps secondaire, valeur alignée à droite en
chiffres tabulaires, alignée sur la ligne de base. C'est la forme canonique de
l'offre — pas la carte.

**La règle sans chapeau.** Aucun sur-titre, aucun kicker, aucune ligne
capitalisée au-dessus d'un titre. Un titre commence par lui-même.

## Layout

Colonne unique centrée `max-w-2xl` (42rem), gouttières latérales de 20px, haut
de page 64px (96px à ≥640px), bas de page 128px pour laisser passer le dock
flottant. Aucune grille multi-colonnes au niveau page ; les seuls sous-grilles
sont deux paires de champs de formulaire à ≥640px et le vis-à-vis nom/photo du
premier écran, qui passe en pile inversée sous 640px.

Rythme vertical : 56px entre sections (64px à ≥640px), 20px entre le titre de
section et son contenu, 24px à l'intérieur du premier écran. À l'intérieur des
blocs, l'échelle utilisée est 6 / 8 / 12 / 16 / 20 / 24px. Les cartes de liste
ont 20px de rembourrage (24px à ≥640px) ; les lignes de données 10px de haut en
bas.

Un seul point de rupture porte tout le responsive : 640px (`sm`). En dessous,
tout retombe en pile, la mesure descend à 35ch et les corps display reculent
d'un cran.

**La règle de la colonne unique.** Aucune surface nouvelle n'introduit une
seconde colonne de lecture. Un contenu qui ne tient pas dans 42rem se découpe en
lignes, pas en colonnes.

## Elevation & Depth

Le système est plat. La profondeur vient de la superposition tonale (fond →
carte → accent) et des bordures 1px, pas de l'ombre. Deux exceptions
structurelles seulement : le dock flottant, qui doit se détacher du texte qu'il
recouvre, et le bouton primaire, dont l'ombre est une réponse d'état.

### Shadow Vocabulary

- **Dock flottant**
  (`box-shadow: 0 2px 8px -2px rgba(0,0,0,0.14), 0 14px 36px -14px rgba(0,0,0,0.45)`)
  : la seule ombre permanente du site. Elle accompagne une pastille opaque,
  doublée d'un dégradé vertical vers la couleur de fond qui occulte franchement
  la copie en dessous.
- **Appui primaire** (`0 1px 2px rgba(0,0,0,0.25)` au repos,
  `0 3px 12px -3px color-mix(in oklch, var(--primary) 60%, transparent)` au
  survol, aucune à l'appui) : réservé au bouton d'action principal.

### Named Rules

**La règle du plat par défaut.** Une surface est plate au repos. L'ombre
n'apparaît que pour répondre à un état ou pour assumer un chevauchement réel de
contenu.

**La règle de l'occultation franche.** Un élément qui flotte au-dessus du texte
est opaque et pose un dégradé vers la couleur de fond. Aucun flou de verre,
aucune translucidité qui laisse la copie transparaître.

## Shapes

Rayon de base 10px, décliné en quatre crans : 6px pour les étiquettes, 8px pour
les champs et le focus, 14px pour les conteneurs de listes, et le cercle complet
pour le dock, la photo et les deux boutons d'action — primaire et secondaire
partagent le rayon plein pour se lire comme une paire. Les listes de cartes sont
un seul conteneur bordé subdivisé par `divide-y` : les coins ne sont arrondis
qu'aux deux extrémités, jamais autour de chaque ligne. La citation client est un
filet vertical de 1px avec 20px de retrait, sans fond ni rayon.

## Components

### Boutons

- **Forme :** rayon plein, hauteur fixe 40px, rembourrage horizontal 24px
  (primaire) et 20px (secondaire).
- **Primaire :** fond orange porteur, texte du même orange très sombre, graisse
  600, ombre d'appui 1px, pictogramme de curseur 16px en fin de libellé. Survol
  : opacité 88% du fond plus l'ombre colorée. Appui : descente de 1px,
  suppression de l'ombre, et six particules qui partent du centre. Désactivé :
  opacité 50%.
- **Secondaire :** fond carte, bordure 1px, graisse 500. Survol : fond accent et
  bordure à 25% de la couleur de texte. Même appui à 1px.
- **Un seul composant pour « Demander un devis »** : l'ancre en tête de page et
  l'envoi du formulaire sont le même bouton. Deux traitements d'un même libellé
  sur une même page avaient été relevés en revue.
- **Transitions :** 150ms sur fond, ombre et transformée uniquement.

### Puces de contact (chips)

- Lien à hauteur 40px, fond carte, bordure 1px, rayon 8px, pictogramme SVG 16px
  en couleur secondaire, libellé en 0.875rem/500. Les liens sortants portent une
  flèche montante 14px qui se décale d'1px en diagonale au survol.

### Étiquettes (tags)

- Puce non interactive : hauteur 24px, rayon 6px, fond `muted` à 60%, bordure
  1px, texte secondaire 0.75rem/500. Toujours en ligne enroulée, écart 6px.

### Cartes / Conteneurs de liste

- Conteneur unique : fond carte, bordure 1px, rayon 14px, lignes séparées par
  `divide-y`. Rembourrage 20px (24px à ≥640px).
- Une ligne cliquable prend le fond accent à 60% au survol et révèle une flèche
  montante 16px, opacité 0 → 1 avec décalage de 2px sur 200ms.
- Aucune ombre, jamais.

### Champs de formulaire

- Fond de page (plus sombre que la carte), bordure 1px de la couleur `input`,
  rayon 8px, rembourrage 12px × 10px, texte 0.875rem. Placeholder à 70% de la
  couleur secondaire. Focus : la bordure passe à la couleur d'anneau, sans halo
  ; le contour global `:focus-visible` (2px, décalage 2px, rayon 4px) reste la
  garantie clavier. Désactivé : opacité 60% et curseur interdit.
- Étiquette au-dessus du champ, 0.875rem/500, écart 6px. Jamais de libellé
  flottant.

### Navigation — le dock

- Barre flottante centrée en bas de fenêtre, pastille pleinement arrondie, fond
  opaque, bordure 1px, rembourrage 4px, ombre de dock. Le conteneur est
  transparent aux événements ; seule la pastille les reçoit.
- Élément au repos : texte secondaire, 13px/500 (0.875rem à ≥640px). Survol :
  texte pleine force. Actif : fond accent, texte pleine force,
  `aria-current="page"`.
- Un filet vertical de 1px sépare la navigation du bouton de thème (pictogramme
  SVG 16px dans une cible ronde de 36px).
- Le dock respecte `env(safe-area-inset-bottom)` et ne change pas de forme en
  mobile ; seuls les rembourrages horizontaux se resserrent.

### Ligne de données (composant signature)

La forme canonique de l'offre : libellé à gauche en 0.875rem secondaire, valeur
à droite en chiffres tabulaires 0.875rem/500, alignés sur la ligne de base,
séparés par une bordure basse à 70% d'opacité, supprimée sur la dernière ligne.
Hauteur 10px de part et d'autre. C'est ce composant qui remplace la grille de
cartes tarifaires.

### Révélation (BlurFade)

Primitive de mouvement unique. Deux réglages seulement :

- **Moment** (flou 12px, décalage 10px, 0.7s) : la pose du nom en tête
  d'accueil, avec des retards échelonnés de 0.06 à 0.38s sur les éléments du
  premier écran.
- **Ambiance** (flou 4px, décalage 4px, 0.35s, au premier passage dans la vue) :
  réservée à la première section sous la ligne de flottaison de chaque page.
  Courbe unique `cubic-bezier(0.16, 1, 0.3, 1)`, retard plancher de 0.04s. Sous
  `prefers-reduced-motion`, le composant rend directement l'état final, sans
  transition.

## Do's and Don'ts

### Do:

- **Do** écrire toute paire libellé/valeur comme une ligne : libellé à gauche,
  chiffre aligné à droite en `.num`, séparateur 1px.
- **Do** garder la lecture dans une colonne de 42rem et le corps sous 62ch.
- **Do** réserver JetBrains Mono aux chiffres, références légales et dates.
- **Do** hiérarchiser par le poids et la couleur de texte avant d'ajouter une
  surface.
- **Do** retokeniser le thème clair ligne à ligne quand une couleur est ajoutée
  : le clair est un pair complet, pas un inverse calculé.
- **Do** rendre l'état final sous `prefers-reduced-motion` plutôt que
  d'accélérer l'animation.
- **Do** rendre opaque tout élément qui flotte au-dessus du texte, et le doubler
  d'un dégradé vers la couleur de fond.

### Don't:

- **Don't** utiliser une grille de cartes icône-titre-texte comme structure de
  page.
- **Don't** poser un sur-titre, un kicker ou une ligne capitalisée au-dessus
  d'un titre.
- **Don't** appliquer de dégradé sur du texte, ni de surcouche de verre
  décorative.
- **Don't** introduire un second accent chromatique ; le succès et l'erreur
  restent des états de texte ou de pictogramme, jamais des fonds.
- **Don't** épaissir un séparateur au-delà de 1px, ni le colorer — y compris le
  filet vertical des citations client.
- **Don't** ajouter une ombre à une carte ou à une section ; l'ombre appartient
  au dock et à l'état du bouton primaire.
- **Don't** répéter la révélation d'ambiance sur plus d'une section par page.
- **Don't** utiliser de pictogramme en police de glyphes ni d'émoji ; les
  pictogrammes sont des SVG de 14 à 16px en couleur secondaire.

## Couche interactive (révision d’août 2026)

Le contrat d’origine tenait le mouvement pour un événement rare. Cette révision
en ajoute une couche, à la demande explicite du client, empruntée à la
bibliothèque Magic UI. Les composants sont vendus dans `components/magicui/`,
chacun portant en tête sa source et l’écart appliqué. `motion` est désormais une
dépendance du projet — elle sert au dock, au curseur et à rien d’autre ; un
fondu reste une `@keyframes` CSS.

- **Dock** (`magicui/dock.tsx`, `components/dock-nav.tsx`) : la barre du bas est
  passée des libellés aux icônes, avec grossissement au curseur et étiquette au
  survol. Les libellés vivent dans `aria-label` : le nom accessible n’a pas
  bougé.
- **Bascule de thème** (`magicui/animated-theme-toggler.tsx`) : révélation par
  `clip-path` via l’API View Transitions. Utilisée en mode contrôlé —
  `next-themes` reste propriétaire de la persistance. Le fondu croisé par défaut
  est neutralisé dans `globals.css`, et l’ensemble est coupé sous
  `prefers-reduced-motion`.
- **Nom cinétique** (`magicui/kinetic-text.tsx`) : la lettre survolée s’épaissit
  et entraîne ses voisines. Pur CSS, aucune classe d’animation. C’est la seule
  grammaire de titre du site — les trois premiers écrans du chemin commercial la
  partagent, après le retrait d’un titre matriciel et d’une bascule 3D qui
  faisaient trois traitements différents pour un même geste.
- **Bouton de devis** (`magicui/particle-button.tsx`) : six particules partent
  du centre au clic. Trajectoires fixes plutôt que tirées au hasard — le hasard
  au rendu séparerait le HTML du serveur de celui du client. Se rend en lien
  quand l’action est une ancre, en `button[type=submit]` dans le formulaire, et
  la rafale est coupée sous `prefers-reduced-motion`.
- **Premier écran** (`ui/kit.tsx`, `Hero`) : contenu centré sur une grille de
  fond de 24px peinte en `background-image`, titre à 48/60px, rangée d’actions
  centrée, flèche de bas d’écran. Appliqué aux trois pages du chemin commercial,
  jamais à `/parcours/`.
- **Grilles de marge** (`.side-grid`, `globals.css`) : deux bandes au pas de
  40px dans les marges de la colonne de lecture, peintes en `background-image`
  sur un seul nœud vide. Le masque les éteint sur la colonne et les fait
  disparaître sous 46rem de large. Elles ne s’allument plus au survol : cet
  effet coûtait six cents `rect` SVG et autant de gestionnaires d’évènement.
- **Curseurs de projet** (`magicui/pointer.tsx`,
  `components/project-pointer.tsx`) : un motif par projet sur `/parcours/`. Sans
  survol, sur mobile, rien ne se déclenche.
- **Sphère de technologies** (`magicui/icon-cloud.tsx`) : canvas alimenté par
  `public/stack/*.svg`, servis par le site. Aucune ressource externe ; les
  marques dont la couleur officielle est noire reçoivent une teinte de repli
  cuite dans le fichier, sans quoi elles disparaîtraient sur le thème sombre.
- **Grille bento** (`ui/kit.tsx`) : réservée au périmètre fonctionnel de
  PoolCenter. Pas d’icône, pas de chiffre décoratif, aucun usage sur le chemin
  commercial.

Contrôle : Chrome headless annonce `hover: none`, ce qui enferme toutes les
variantes `hover:` de Tailwind dans un `@media` jamais satisfait. `shoot.mjs`
force désormais `availableHoverTypes=2` dans ses trois modes — sans quoi la
moitié de cette couche passerait pour inerte.
