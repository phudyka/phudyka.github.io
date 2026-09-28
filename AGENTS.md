# AGENTS.md — phudyka.github.io

Site commercial de Paul Hudyka, publié sur GitHub Pages. Il vend deux activités
indépendantes — **Halfred** (agents IA sur-mesure, prestation) et **PoolCenter**
(logiciel métier piscine, produit) — et porte la route `/scroll/`, lecture
longue destinée aux recruteurs. Next.js App Router (TypeScript), Tailwind CSS
v4, export statique, `next-themes`, `lucide-react`, `motion`. Contenu en
français, vouvoiement ; doublon anglais sous `/en/`.

CLAUDE.md est conservé pour Claude Code ; ce fichier fait foi pour Codex.

## Méthode de travail ici

- Lire `PRODUCT.md` avant d'écrire la moindre ligne de copie : il fait autorité
  sur ce que le site a le droit d'affirmer et liste les absences à ne jamais
  combler (aucun témoignage, aucun logo client, aucun chiffre de ROI, aucune
  référence au-delà d'ETS Maria).
- Tout fait sur Paul (parcours, projets, Halfred) vient de
  `../emploi/perso/cv/profil.md` ; rien ne s'invente.
- Toute donnée éditoriale (offres, prix, mentions légales, référence client,
  fonctionnalités, missions, compétences) vit dans `data/content.ts` : les pages
  ne contiennent aucune donnée en dur. Pour changer un prix, éditer ce fichier,
  pas la page.
- Vérifier `node -v` avant de diagnostiquer : le Node système (v19) casse Next
  15 et Tailwind v4 ; sélectionner
  `export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH`.
- Après tout changement : `npm run build`, puis `grep a6507cb4 out/index.html`
  doit renvoyer un résultat (le contrat de direction, rendu en commentaire HTML
  depuis `app/layout.tsx`, doit survivre au build), puis
  `node .impeccable/shoot.mjs audit`.
- Vérifier dans quel dépôt on est (`git -C . remote get-url origin` →
  `phudyka/phudyka.github.io`) ; `repos/portfolio/` est l'ancien site, pas
  celui-ci.

## Commandes

```bash
export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH
npm install
npm run dev            # serveur de développement
npm run build          # build + export statique dans out/
npm run lint           # eslint . (eslint.config.mjs), seul contrôle automatique ; pas de tests unitaires
```

Inspection du rendu (aucun navigateur système ; Playwright non supporté sur cet
OS, Puppeteer oui) :

```bash
python3 -m http.server 4321 -d out &
node .impeccable/shoot.mjs        # captures desktop + mobile dans .impeccable/shots/
node .impeccable/shoot.mjs states # états du formulaire, focus clavier, bascule de thème
node .impeccable/shoot.mjs audit  # contraste WCAG, débordement, mesure de ligne, révélations bloquées
```

`shoot.mjs` force `availableHoverTypes=2` : sans cela, headless annonce
`hover: none` et toutes les variantes `hover:` de Tailwind paraissent inertes.
`.impeccable/` est gitignoré ; `package.json` et `package-lock.json` sont suivis
(buildable en CI).

Déploiement automatique : push sur `main` déclenche
`.github/workflows/deploy.yml` (Node 24, `npm ci`, `npm run build`, Pages).

## Invariants

- `data/content.ts` : source unique de vérité éditoriale.
- `PRODUCT.md` : autorité sur ce que le site affirme.
- `app/layout.tsx` : contrat de direction en commentaire HTML via
  `dangerouslySetInnerHTML` (les commentaires JSX ne sont pas émis) ; verrou
  `grep a6507cb4 out/index.html` après build.
- `app/globals.css` : tokens de design en `@theme` Tailwind v4 plus `:root` et
  `.dark`. Pas de `tailwind.config.js` — v4 se configure en CSS. Thème sombre
  par défaut (`defaultTheme="dark"`, `enableSystem={false}`) : décision de
  direction, pas un oubli.
- `components/ui/kit.tsx` : primitives partagées (`Column` `max-w-2xl`, `Hero`
  - `HeroActions` + `secondaryButton`, `Section`, `TagRow`, `DataRow`). Toute
    nouvelle page se compose avec ces briques.
- `components/magicui/` : composants empruntés à Magic UI, chaque fichier porte
  sa source et l'écart appliqué ; ne pas les écraser par la version amont.
  `motion` n'est là que pour eux : ne pas s'en servir ailleurs.
- `components/blur-fade.tsx` : grammaire de mouvement ambiante, animation en
  `@keyframes` CSS dans `app/globals.css`, état `data-blur-fade`, paramètres
  `--bf-*`. Aucune bibliothèque d'animation pour un fondu.
  `prefers-reduced-motion` est porté par la feuille de style. Les sections
  `reveal` attendent un `IntersectionObserver` : `shoot.mjs audit` signale
  celles restées en attente.
- Un seul moment orchestré sur le site : la pose du nom en tête d'accueil. Ne
  pas en ajouter. Les trois titres de premier écran partagent `KineticText`.
- `.side-grid` (`app/globals.css`) sur un `div` vide de `app/layout.tsx` :
  bandes de marge peintes en fond, masque refermé sous 46 rem, pas de media
  query à tenir.
- `components/project-pointer.tsx` : curseur par projet de `/parcours/`, clé
  `pointer` dans `data/content.ts`.
- Sphère de `/parcours/` : icônes dans `public/stack/*.svg` au nom du slug
  Simple Icons, listées dans `STACK_ICONS` ; `STACK_ICON_URLS` figées au niveau
  module (une liste reconstruite à chaque rendu fait boucler `IconCloud`).
- `public/.nojekyll` obligatoire (sinon Pages ignore `_next`) ;
  `trailingSlash: true` (liens internes en `/halfred/`, pas `/halfred`) ;
  `images: { unoptimized: true }` imposé par l'export statique.
- Formulaire de contact `components/section/contact.tsx` → Web3Forms avec
  `NEXT_PUBLIC_CONTACT_KEY` (variable de dépôt `CONTACT_KEY` en CI, figée au
  build). Sans clé : état « non configuré » explicite avec repli GitHub. Le
  service répond 200 même en refus : c'est `success` du JSON qui tranche ; champ
  caché `botcheck` anti-robots.
- `public/` ne contient que ce qui est servi (`paul-hudyka.webp` et sa variante
  `@1x`, `.nojekyll`, `stack/`, `logos/`, `scroll-media/`).

## Conventions

- Typographie française : apostrophe U+2019 (jamais `'` ni `&apos;`), espace
  insécable avant `: ; ! ?` et à l'intérieur des guillemets.
- Classe `.num` (`tabular-nums`) sur tout prix, date, version, SIREN ; la mono
  JetBrains est réservée aux données.
- Refusé par le contrat : dégradés de texte, surcouches de verre décoratives,
  captures d'écran produit sur le chemin commercial. `Bento`/`BentoCell` admis
  seulement pour le périmètre fonctionnel de PoolCenter, jamais avec des icônes
  décoratives.
- Seule exception aux captures produit : la route `/scroll/` (lecteur =
  recruteur, l'écran réel est la preuve). Le refus reste entier sur `/`,
  `/halfred/`, `/poolcenter/`, `/parcours/`.

## La route `/scroll/`

- `app/scroll/page.tsx` et `app/en/scroll/page.tsx` : mêmes faits que l'accueil,
  quatre chapitres, un seul acte épinglé ; `LANG_PAIRS` bascule la langue sans
  repasser par `/`.
- Aucun système de design parallèle : mêmes jetons, dock, primitives, plus
  `KineticText` et `IconCloud`. Pièces propres dans `components/scroll/` :
  `topology.tsx`, `clock.tsx`, `frames.tsx`, `feature-carousel.tsx`,
  `product-hero.tsx`.
- `topology` et `clock` prennent `lang` ; leur copie vit dans une table `COPY`
  en tête de fichier. Les identifiants réels (`net_internal`, `egress-proxy`,
  `FilterDefaultDeny`) ne se traduisent jamais.
- `public/logos/` (GPI France, 42 Nice, UCA) ne sert qu'à cette route ; table
  `LOGOS` dans la page, extraits des sources locales, pas téléchargés.
- Acte épinglé : progression publiée en `--p`, tout mouvement en CSS
  (`app/globals.css`, section « Acte épinglé ») ; le JS ne pilote que le paquet
  ; `IntersectionObserver` arrête la boucle hors écran.
- Le mur du schéma est **plein** : aucune porte, aucune sortie ; seule route
  `hermes` → `ollama`, en interne (la seule affirmation que `profil.md` autorise
  au présent). **Ne jamais y remettre `api.mistral.ai`** (sortie de MariaAgent,
  tests seulement). Deux `<svg>` paysage/portrait, bascule à 767 px, données `D`
  et `M` partagées. `cursor: none` sur le schéma, `aria-hidden` dessus.
- `feature-carousel.tsx` : neuf écrans (cinq poste, quatre téléphone) dans une
  seule piste, un seul jeu de contrôles ; la vignette active s'élargit.
- `product-hero.tsx` publie `--h` : mouvement d'échelle, pas un second acte
  épinglé.
- `public/scroll-media/` : captures réelles de `poolcenter.app` sur le compte de
  démonstration ; légende « bassins fictifs » obligatoire ; captures en français
  sur les deux langues (le produit l'est).

## Documents à lire avant d'agir

- `PRODUCT.md` — ce que le site a le droit d'affirmer.
- `DESIGN.md` — direction visuelle et contrat.
- `data/content.ts` — contenu éditorial.
- `../emploi/perso/cv/profil.md` — faits autorisés sur Paul.
- `../AGENTS.md` — carte de l'espace, Node, `ranger.py` (qui protège
  `node_modules/`, emprunté par `../emploi/outils/cv.mjs`).
