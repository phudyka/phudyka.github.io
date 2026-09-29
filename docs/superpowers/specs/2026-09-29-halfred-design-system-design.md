# Halfred : design system et landing `/halfred/`

Date : 2026-09-29. Statut : spec à valider par Paul avant le plan
d'implémentation.

## 1. Objet

Donner à Halfred un monde visuel propre, le premier des « mondes de marque » du
hub à avoir son design system écrit, et l'appliquer à une landing courte qui
remplace `/halfred/` et absorbe `/halfred/offres/`.

C'est la première brique d'un écosystème : PoolCenter, puis l'accueil du hub,
puis Paul Point Virgule recevront chacun leur propre refonte sur le même
principe (un monde par activité, un hub qui les relie).

## 2. Public, mode, résultat

- **Visiteur** : dirigeant de TPE ou PME, non technique, arrivé depuis le hub ou
  un lien direct. Il veut savoir en trente secondes ce qu'est Halfred, qui est
  derrière et combien ça coûte.
- **Mode** : Persuade. La page vend une conversation.
- **Action principale** : « Parler de votre besoin », qui mène au formulaire du
  footer.
- **Action secondaire** : lire la grille de prix.
- **Preuves admises** : la grille publique, les trois garde-fous, le SIREN, le
  visage de Paul. Rien d'autre (voir `PRODUCT.md`, « Absences à ne jamais
  combler par invention »). Pas de bandeau de logos, pas d'avis, pas de chiffre
  de ROI.

## 3. Le monde Halfred

### 3.1 Concept : « Half-red »

Halfred, c'est Alfred de Batman, l'homme à tout faire. C'est aussi *half red* :
à moitié rouge. Le concept est purement visuel.

**Règle de la moitié.** Chaque composant du monde Halfred est coupé en deux :
une moitié rouge, une moitié noire ou blanche. La coupure est nette, jamais un
fondu. Elle peut être horizontale, verticale ou diagonale selon le composant,
mais elle est toujours à 50 %.

### 3.2 Palette

Trois couleurs, et rien d'autre. **L'orange est interdit sur tout le monde
Halfred** : il est réservé à l'identité de Paul.

| Rôle            | Valeur                  | Usage                                                   |
| --------------- | ----------------------- | ------------------------------------------------------- |
| Rouge Halfred   | `#d02232`               | Moitié rouge des composants, lumière des formes, liens. |
| Rouge lumière   | `#ff3b4e` (vers 60 %)   | Cœur des lueurs et des arcs uniquement, jamais en texte. |
| Rouge profond   | `#5a0b12`               | Bords des lueurs, ombres colorées.                      |
| Noir            | `#050506`               | Fond de page.                                           |
| Noir carte      | `#0e0e10`               | Moitié noire des cartes et des boutons.                 |
| Graphite        | `#292930`               | Bordures fines, séparateurs.                            |
| Blanc           | `#f0f4ff`               | Texte, moitié blanche des boutons secondaires.          |
| Blanc atténué   | `#f0f4ff` à 64 %        | Texte secondaire.                                       |

Contraste : le blanc `#f0f4ff` sur `#d02232` tient 4,8:1 ; le rouge `#d02232` sur
noir tient 3,8:1 et reste réservé aux textes de 24 px et plus. Tout texte
courant est blanc ou blanc atténué.

**Sombre uniquement.** Le monde Halfred ignore la bascule de thème : ses jetons
s'appliquent sur `body:has(main[data-brand="halfred"])`, avec ou sans `.dark`.
La bascule est masquée sur la page.

### 3.3 Typographie

- **Display** : grotesque serrée, dans l'esprit de la référence Ranvel.
  Candidate : General Sans (Fontshare), auto-hébergée en `woff2` dans
  `public/fonts/`, graisses 500 et 600. Le choix final se fait au build par
  comparaison au rendu ; aucune police de la liste « défauts » d'impeccable.
- **Corps** : Inter, déjà chargée par le site.
- **Chiffres** : `.num` (chiffres tabulaires) sur tous les prix. Pas de mono
  décorative.
- Titre du hero : environ 72 px sur desktop, interlettrage −0,04 em, deux
  lignes maximum.

### 3.4 Matières et lumière

- **Arcs d'éclipse** : lueur rouge qui borde un disque noir, comme l'horizon
  d'une planète éclipsant son soleil. Faits en CSS : dégradés radiaux
  superposés, flou, `mix-blend-mode: screen`. Zéro image.
- **Formes 3D** : anneaux et rubans rouges, générés par Paul (prompts en
  section 7) et intégrés en AVIF + WebP.
- **Glossy** : les boutons portent un reflet haut (dégradé linéaire blanc 18 %
  vers transparent) et un halo rouge au survol.
- **Grain** : bruit très léger (SVG `feTurbulence` en fond, opacité 4 %) sur
  toute la page, pour que les dégradés ne bandent pas.
- **Texte dégradé** : autorisé dans ce monde (exception au contrat global),
  uniquement sous la forme « half-red » : coupure nette à 50 %.

### 3.5 Composants

| Composant            | Moitié rouge                                    | Autre moitié                         |
| -------------------- | ----------------------------------------------- | ------------------------------------ |
| Bouton principal     | Moitié gauche `#d02232`                         | Moitié droite noir carte, texte blanc à cheval |
| Bouton secondaire    | Liseré bas rouge                                | Fond blanc, texte noir               |
| Badge pilule         | Pastille gauche rouge (« IA »)                  | Libellé sur graphite                 |
| Carte de prix        | Moitié haute : bandeau rouge sombre + lueur     | Moitié basse noir carte              |
| Titre du hero        | Moitié basse des lettres en rouge               | Moitié haute en blanc                |
| Portrait             | Moitié droite passée en duotone rouge           | Moitié gauche en noir et blanc       |
| Mot-marque footer    | « Half » en blanc                               | « red » en rouge                     |
| Lien                 | Soulignement rouge                              | Texte blanc                          |
| Focus clavier        | Anneau 2 px `#ff3b4e`, décalé de 3 px           | —                                    |

Rayons : pilules pour les boutons et badges, 20 px pour les cartes. Aucune
ombre grise : les ombres sont des halos rouges ou rien.

Les composants 21st.dev que Paul fournira remplacent ces versions à leur
arrivée, repeints aux jetons Halfred et coupés selon la règle de la moitié.

### 3.6 Mouvement

Une seule chorégraphie :

1. Au chargement, les arcs du hero s'allument (la lueur monte en 1,2 s), puis le
   titre et les boutons apparaissent en fondu flouté (grammaire `BlurFade`
   existante).
2. Au scroll, les sections se révèlent avec la même grammaire.
3. Au survol d'une carte de prix, la moitié rouge monte de quelques pixels et sa
   lueur s'intensifie.

`prefers-reduced-motion` : tout est visible d'emblée, sans animation. Pas de
bibliothèque d'animation ajoutée : CSS uniquement.

## 4. Structure de la page

Trois écrans et un footer. Une barre de navigation propre à Halfred ; le dock
du hub est masqué sur `/halfred/`.

### Nav

Logo Halfred + « Halfred » à gauche. Ancres au centre : Halfred · Tarifs ·
Contact. Bouton principal « Parler de votre besoin » à droite. Lien discret
« Paul Hudyka ↗ » vers le hub. Barre fixe, fond transparent qui devient noir
flouté après 40 px de scroll. Sur mobile : logo + bouton, ancres dans un menu.

### Écran 1 — Hero

- Arc d'éclipse rouge en haut (large courbe qui descend du coin droit), arc
  plus petit en bas à droite. Référence Ranvel, première capture.
- Badge : [IA] Automatisation pour TPE et PME.
- Titre (choisi par Paul le 2026-09-29) : « Votre entreprise, moins les tâches
  répétitives. »
- Phrase : « Consultant en automatisation et IA pour les TPE et les PME. Audit
  d'abord, puis la solution adaptée à vos outils. »
- Boutons : « Parler de votre besoin » (principal), « Voir les tarifs »
  (secondaire, ancre `#tarifs`).
- Sous les boutons, à la place du bandeau de logos : « La Colle-sur-Loup · sur
  place et à distance ».

### Écran 2 — Quoi et qui (`#halfred`)

- Bande pleine largeur : image des anneaux 3D rouges (image A).
- Halfred en deux lignes : ce que ça automatise (e-mails, relances, devis,
  rendez-vous, liaison entre outils) et jusqu'où ça va (agent IA, agent 100 %
  local).
- Paul en deux lignes, avec portrait half-red : qui, où, sur place et à
  distance.
- Les trois garde-fous, une ligne chacun :
  - Les calculs passent par du code, jamais par le modèle.
  - Rien ne part sans votre validation.
  - Tout est écrit avant de commencer.

### Écran 3 — Tarifs (`#tarifs`)

- Titre : « Des prix publics, pour commencer petit. »
- Les huit offres de `OFFERS` (`data/content.ts`) en cartes half-red : nom,
  prix en chiffres tabulaires, note éventuelle, une phrase « pour qui ». Les
  listes « inclus » sont repliables pour garder l'écran léger.
- Grille : 4 colonnes desktop, 2 tablette, 1 mobile. L'échange de cadrage
  gratuit ouvre la grille.
- Une ligne de modalités sous la grille : régie 350 € / jour, acompte 30 % à la
  commande, tarifs de lancement en € HT, TVA non applicable, art. 293 B du
  CGI.

### Footer (`#contact`)

- Forme rouge fluide en fond (image B), qui monte depuis le bas.
- Titre : « Dites-moi ce que vos équipes refont à la main. »
- Formulaire court (nom, e-mail, besoin) branché sur la clé Web3Forms Halfred
  existante (`NEXT_PUBLIC_CONTACT_KEY_HALFRED`, via
  `components/section/contact.tsx`), et l'adresse contact.halfred@gmail.com en
  clair dessous.
- Mentions : Halfred, EI Paul Hudyka, SIREN 107 717 530, La Colle-sur-Loup.
- Liens : hub Paul Hudyka, GitHub (github.com/phudyka), version anglaise.
- Grand mot-marque « Halfred » coupé half-red, en pied de page.

## 5. Architecture et fichiers

Rien ne change hors du monde Halfred.

| Fichier                                         | Changement                                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `app/globals.css`                               | Section Halfred réécrite : jetons sombres forcés, arcs, grain, règle de la moitié en classes utilitaires. |
| `components/halfred/`                           | Nouveau dossier : `nav.tsx`, `hero.tsx`, `about.tsx`, `pricing.tsx`, `footer.tsx`, primitives `half.tsx` (bouton, badge, carte). |
| `components/section/halfred.tsx`                | Remplacé par la composition des sections ci-dessus, prop `lang` conservée.                             |
| `data/content.ts`, `data/content.en.ts`         | `HALFRED` réduit à la copie des nouvelles sections ; `OFFERS` et `TERMS` inchangés.                     |
| `app/layout.tsx` / `components/dock-nav.tsx`    | Dock et bascule de thème masqués sur les routes Halfred.                                                 |
| `app/halfred/offres/page.tsx` (+ EN)            | Page de redirection statique vers `/halfred/#tarifs` (`<meta http-equiv="refresh">` + lien canonique). |
| `public/fonts/`                                 | Police display auto-hébergée.                                                                           |
| `public/halfred/`                               | Images A, B, C en AVIF et WebP.                                                                         |
| `CLAUDE.md`                                     | Exception monde Halfred (dégradés, glossy, police propre, sombre seul, dock masqué).                    |
| `PRODUCT.md`                                    | Direction visuelle de Halfred : monde Half-red choisi par Paul le 2026-09-29.                           |
| `DESIGN.md`                                     | Section Halfred écrite à la fin du build, depuis le rendu réel.                                         |

Contraintes conservées : export statique, aucune dépendance d'animation
ajoutée, contenu dans `data/`, typographie française (apostrophe U+2019,
espaces insécables), FR et EN strictement parallèles.

## 6. Accessibilité et performance

- Contraste AA sur tout texte ; le rouge n'est jamais la seule porteuse d'une
  information.
- Ordre de tabulation : nav, hero, cartes, formulaire. Focus visible partout.
- Images décoratives en `alt=""` ; images A et B en `loading="lazy"` (le hero,
  au-dessus de la ligne de flottaison, est en CSS).
- Budget : moins de 350 Ko d'images au total, police display en sous-ensemble
  latin.
- Vérification : `npm run lint`, `npm run build`, puis
  `node .impeccable/shoot.mjs` et `node .impeccable/shoot.mjs audit` (contraste,
  débordement, révélations bloquées), desktop et mobile.

## 7. Images à générer (Paul)

Format de livraison : PNG ou WebP au plus haut rendu disponible, je convertis.
Fond noir pur, aucun texte, aucun logo, aucune signature. Rouge carmin proche de
`#d02232`, sans aucune dérive vers l'orange.

**Image A — anneaux 3D (écran 2), 21:9, 2560×1097 minimum**

Abstract 3D render, four thick glossy torus rings interlocking in a gentle diagonal row across the lower two thirds of the frame, deep crimson red (#d02232) with bright red specular highlights and dark burgundy shadows, subsurface glow as if lit from inside, smooth ceramic-glass material, soft studio rim light from the top left, pure black background (#050506), heavy falloff into darkness at the edges, cinematic, minimal, ultra detailed, 8k, no orange, no yellow, no text, no logo.

**Image B — ruban liquide (footer), 21:9, 2560×1097 minimum**

Abstract 3D render, a single flowing liquid ribbon of glossy crimson red (#d02232) rising from the bottom edge and curling into a wide wave, silky fluid surface with sharp white-red specular reflections and deep burgundy folds, pure black background (#050506), the upper half of the frame left completely empty and dark, cinematic lighting, minimal, ultra detailed, 8k, no orange, no yellow, no text, no logo.

**Image C — partage social (OG), 1200×630**

Cosmic eclipse horizon, a vast black planet curve occupying the bottom right, its edge rimmed with an intense glowing crimson red atmosphere (#d02232) fading into deep burgundy, pure black starless sky, the left half of the frame empty and dark for a title, minimal, cinematic, smooth gradients, no noise banding, no orange, no yellow, no text, no logo.

Si un rendu tire vers l'orange, ajouter en tête : « strictly monochrome red
palette, cool crimson hue ». Chaque image livrée garde son prompt en métadonnée
(`impeccable embed-prompt`).

## 8. Hors périmètre

- Section avis : ajoutée quand de vrais avis existeront.
- Thème clair Halfred.
- Refontes PoolCenter, accueil du hub, Paul Point Virgule : chacune sa propre
  spec.
- Migration vers Cloudflare Pages : le site reste sur GitHub Pages.

## 9. Décisions ouvertes

- Police display : General Sans par défaut, confirmée au build.
- Composants 21st.dev : intégrés à leur arrivée, sans bloquer le build.
