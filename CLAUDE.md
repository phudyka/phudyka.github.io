# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Vue d'ensemble

Site commercial de Paul Hudyka, publié sur GitHub Pages (`phudyka.github.io`).
Ce n'est plus un portfolio de candidature : il vend deux activités indépendantes
— **Halfred** (agents IA sur-mesure, prestation) et **PoolCenter** (logiciel
métier piscine, produit).

Next.js **App Router** en TypeScript, **Tailwind CSS v4**, export statique
(`output: 'export'`), `next-themes`, `lucide-react`, `motion`. Contenu en
français, vouvoiement.

Quatre routes : `/` (accueil commercial), `/halfred/`, `/poolcenter/`,
`/parcours/` (missions GPI, projets École 42, compétences, langues — tenus à
l'écart du chemin commercial).

## Commandes

Le **Node du système est en v19**, trop ancien pour Next 15 et Tailwind v4.
Utiliser nvm :

```bash
export PATH=$HOME/.nvm/versions/node/v24.18.1/bin:$PATH
npm install
npm run dev            # serveur de développement
npm run build          # build + export statique dans out/
```

`package.json` et `package-lock.json` sont suivis : le dépôt est buildable en
CI. Les scripts d'inspection de `.impeccable/`, eux, restent gitignorés.

Pour inspecter le rendu (aucun navigateur système n'est installé ; Playwright ne
supporte pas cet OS, Puppeteer si) :

```bash
python3 -m http.server 4321 -d out &
node .impeccable/shoot.mjs        # captures desktop + mobile dans .impeccable/shots/
node .impeccable/shoot.mjs states # états du formulaire, focus clavier, bascule de thème
node .impeccable/shoot.mjs audit  # contraste WCAG, débordement, mesure de ligne, révélations bloquées
```

Le script force `availableHoverTypes=2` au lancement de Chrome : headless
annonce `hover: none`, ce qui enferme toutes les variantes `hover:` de Tailwind
dans un `@media` jamais satisfait — sans ce réglage, le dock, les infobulles et
le bouton de devis passent pour inertes.

Pas de tests unitaires, pas de linter configuré.

## Architecture

**`data/content.ts` est la source unique de vérité éditoriale.** Offres, prix,
mentions légales, référence client, fonctionnalités produit, missions,
compétences : tout y vit. Les pages ne contiennent aucune donnée en dur. Pour
changer un prix ou ajouter une offre, éditer ce fichier.

**`PRODUCT.md` fait autorité sur ce que le site a le droit d'affirmer.** Il
liste explicitement les absences à ne jamais combler par invention : aucun
témoignage, aucun logo client, aucun chiffre de ROI, aucune référence au-delà
d'ETS Maria. Le lire avant d'écrire la moindre ligne de copie.

**Le contrat de direction vit dans `app/layout.tsx`**, rendu en commentaire HTML
comme premier nœud du `body` via `dangerouslySetInnerHTML` — les commentaires
JSX (`{/* */}`) ne sont pas émis dans le HTML, c'est pourquoi cette forme est
nécessaire. Il doit survivre au build : après un `npm run build`,
`grep a6507cb4 out/index.html` doit renvoyer un résultat.

**Les tokens de design sont dans `app/globals.css`**, en `@theme` Tailwind v4
plus `:root` et `.dark`. Il n'y a **pas** de `tailwind.config.js` : v4 se
configure en CSS. Le thème sombre est le défaut (`defaultTheme="dark"`,
`enableSystem={false}`) — c'est une décision de direction, pas un oubli.

**`components/ui/kit.tsx`** porte les primitives partagées : `Column` (colonne
de lecture unique `max-w-2xl`), `Hero` (premier écran centré sur une grille de
fond de 24px, avec `HeroActions` et la constante `secondaryButton`), `Section`
(titre + chapô + contenu, avec révélation), `TagRow` (`Tag` reste interne au
module), `DataRow` (libellé à gauche, valeur en chiffres tabulaires à droite).
Toute nouvelle page se compose avec ces briques plutôt que d'inventer ses
propres conteneurs.

**`components/magicui/`** contient les composants empruntés à Magic UI (dock,
curseur, bascule de thème, texte cinétique, bouton de devis, sphère d'icônes).
Chaque fichier porte en tête sa source et l'écart appliqué — les modifications
locales sont volontaires, ne pas les écraser en récupérant la version amont.
`motion` est là pour eux ; ne pas s'en servir ailleurs.

**Les deux bandes de marge** sont la classe `.side-grid` de `app/globals.css`,
posée sur un `div` vide dans `app/layout.tsx` : une peinture de fond au pas de
40 px, masquée sur la colonne de lecture. Elle a remplacé un SVG de six cents
`rect` survolables, un par case. Le masque se referme de lui-même sous 46 rem de
large, donc pas de requête de média à tenir.

**`components/project-pointer.tsx`** associe un curseur à chaque projet de
`/parcours/`. La clé vient du champ `pointer` dans `data/content.ts`.

**La sphère de `/parcours/`** tire ses icônes de `public/stack/*.svg`, servies
par le site lui-même : il n'y a aucune ressource externe. Pour ajouter une
technologie, déposer le SVG au nom du slug Simple Icons correspondant. Les slugs
vivent dans `STACK_ICONS`, et `STACK_ICON_URLS` fige les URL au niveau module —
`IconCloud` a `images` dans ses dépendances d'effet, une liste reconstruite à
chaque rendu la ferait boucler.

**Le mouvement** : `components/blur-fade.tsx` est la grammaire ambiante
(révélation échelonnée à 40 ms). L'animation elle-même est une `@keyframes` CSS
dans `app/globals.css` — le composant se contente de poser l'état
(`data-blur-fade="wait" | "run"`) et de passer ses paramètres en variables
`--bf-*`. Il n'y a pas de bibliothèque d'animation ; ne pas en réintroduire une
pour un fondu. Le respect de `prefers-reduced-motion` est porté par la feuille
de style. Les révélations au chargement partent au montage ; les sections
marquées `reveal` attendent un `IntersectionObserver`, donc du JS :
`npm run build` puis `node .impeccable/shoot.mjs audit` signale toute révélation
restée en attente après un parcours complet de la page. Un seul moment orchestré
existe — la pose du nom en tête d'accueil, plus lente et plus floue. Ne pas en
ajouter d'autres. Les trois titres de premier écran partagent une seule
grammaire, `KineticText` : la lettre survolée s'épaissit et pousse ses voisines.

## Conventions

- **Typographie française** : apostrophe courbe U+2019 (jamais `'` ni `&apos;`),
  espace insécable avant `: ; ! ?` et à l'intérieur des guillemets. Le contenu
  existant respecte la règle ; toute nouvelle chaîne doit s'y conformer.
- **Chiffres** : la classe utilitaire `.num`
  (`font-variant-numeric: tabular-nums`) sur tout prix, date, version, SIREN. La
  mono JetBrains est réservée aux données, jamais décorative.
- **Refusé par le contrat** : dégradés de texte, surcouches de verre
  décoratives, captures d'écran produit (choix explicite du client). La grille
  bento (`Bento`/`BentoCell` dans `kit.tsx`) est admise pour le périmètre
  fonctionnel de PoolCenter, jamais sur le chemin commercial et jamais avec des
  icônes décoratives.

## Déploiement et pièges

- `public/.nojekyll` est **obligatoire** : sans lui, GitHub Pages ignore le
  dossier `_next`.
- `trailingSlash: true` — les liens internes doivent pointer vers `/halfred/`,
  pas `/halfred`.
- `images: { unoptimized: true }` est imposé par l'export statique.
- **Formulaire de contact** : `components/section/contact.tsx` poste vers
  Web3Forms (`https://api.web3forms.com/submit`) avec la clé publique
  `NEXT_PUBLIC_CONTACT_KEY`. Sans cette variable, le formulaire s'affiche dans
  un état « non configuré » explicite, avec repli sur la puce GitHub. Le service
  répond 200 même en cas de refus : c'est `success` dans le corps JSON qui
  tranche. Un champ caché `botcheck` sert de piège à robots. En CI la valeur
  vient de la variable de dépôt `CONTACT_KEY` ; les variables `NEXT_PUBLIC_*`
  sont figées au moment du build, pas lues à l'exécution.
- **Assets** : `public/` ne contient que ce qui est servi —
  `public/paul-hudyka.webp` (19 Ko) et sa variante `@1x` pour l'avatar, plus
  `.nojekyll`. Les anciens `profile-picture.png` (4,3 Mo) et `Background.png`
  (5,4 Mo), que plus aucune page ne référençait, ont été retirés du suivi git.

## Répertoire `phudyka/`

`phudyka/` est un **clone séparé d'un autre dépôt**
(`github.com/phudyka/phudyka`, le README de profil GitHub), non suivi ici. Ne
pas y appliquer de modifications en croyant travailler sur le site, et ne pas le
committer.
