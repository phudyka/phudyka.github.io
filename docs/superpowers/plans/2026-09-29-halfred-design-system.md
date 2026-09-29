# Monde Halfred et landing `/halfred/` — plan d'implémentation

> **Pour les agents :** sous-skill requis : superpowers:subagent-driven-development
> (recommandé) ou superpowers:executing-plans, tâche par tâche. Les étapes
> utilisent des cases `- [ ]`.

**Objectif :** remplacer `/halfred/` et `/halfred/offres/` (FR et EN) par une
landing de trois écrans et un footer, dans un monde visuel « Half-red » propre à
Halfred.

**Architecture :** la page reste une route du hub Next.js. Elle rend un `<main
data-brand="halfred">` plein écran au lieu de `Column`. Le monde vit dans un bloc
CSS balisé de `app/globals.css` (jetons forcés en sombre, classes `hr-*`) et dans
`components/halfred/` (une section par fichier). La copie reste dans
`data/content.ts` et `data/content.en.ts`. Un script `scripts/check-halfred.mjs`
vérifie la palette et le HTML exporté : c'est le test du plan, le dépôt n'ayant
pas de tests unitaires.

**Stack :** Next.js 15 App Router (export statique), React 19, Tailwind CSS v4,
`next/font/local`, Node 22 via nvm, ImageMagick (`magick`) pour les images.

**Spec :** `docs/superpowers/specs/2026-09-29-halfred-design-system-design.md`

## Contraintes globales

- Node du système trop ancien : chaque commande npm/node passe par
  `export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH`.
- Palette Halfred, hex exacts : `#d02232`, `#ff3b4e`, `#5a0b12`, `#050506`,
  `#0e0e10`, `#292930`, `#f0f4ff`. **Aucun orange** dans le monde Halfred.
- Sombre uniquement : les jetons Halfred s'appliquent avec ou sans `.dark`.
- Règle de la moitié : chaque composant coupé net à 50 %, jamais en fondu.
- Titre du hero FR : « Votre entreprise, moins les tâches répétitives. »
- Typographie française : apostrophe U+2019 (`’`), jamais `'` ; espace
  insécable (` `) avant `: ; ! ?`.
- `.num` sur tout prix. Aucune bibliothèque d'animation ajoutée.
- Contenu uniquement dans `data/` ; FR et EN strictement parallèles.
- Rien ne change hors du monde Halfred (autres routes, dock sur les autres
  pages).
- Travail sur la branche `halfred-world`, jamais directement sur `main` (un push
  sur `main` déploie).
- `PRODUCT.md` : aucun avis, logo client ni chiffre de ROI inventé.

## Points de vigilance

1. **Visiteur qui a choisi le thème clair ailleurs sur le site** : `/halfred/`
   doit rester noire. Test : la tâche 1 exige `color-scheme: dark` et le
   sélecteur sans `.dark` dans le bloc CSS ; la tâche 7 fait une capture en
   thème clair.
2. **Images pas encore livrées par Paul** : la page doit se construire et
   paraître complète sans elles. Test : la tâche 6 vérifie qu'aucun `<img>` ne
   pointe vers `/halfred/*` absent de `public/halfred/`.
3. **Anciens liens `/halfred/offres/` (FR et EN)** : ils doivent mener à
   `#tarifs`, et aucun lien interne ne doit plus y pointer. Test : tâche 5.
4. **Mobile 375 px** : logo, bouton et menu tiennent dans la barre ; le titre ne
   déborde pas. Test : tâche 7, `shoot.mjs audit` (débordement horizontal).
5. **Clavier et mouvement réduit** : focus visible sur boutons et `summary` ;
   rien d'animé sous `prefers-reduced-motion`. Test : la tâche 1 exige
   `:focus-visible` et `prefers-reduced-motion` dans le bloc ; la tâche 7 fait
   les captures d'états.

---

### Tâche 1 : monde CSS, police display, contrôle de palette

**Fichiers :**
- Créer : `scripts/check-halfred.mjs`
- Créer : `components/halfred/font.ts`,
  `components/halfred/GeneralSans-Variable.woff2`
- Modifier : `app/globals.css` (bloc Halfred, vers les lignes 616-649)
- Modifier : `package.json` (script `check:halfred`)

**Interfaces :**
- Produit : `display` (`next/font/local`, variable CSS `--font-hr-display`) ;
  classes CSS `hr-root hr-wrap hr-section hr-display hr-h1 hr-h2 hr-lead
  hr-half-text hr-red hr-btn hr-btn--half hr-btn--light hr-btn--sm hr-badge
  hr-badge__tag hr-hero hr-eclipse hr-ignite hr-nav hr-menu hr-band hr-portrait
  hr-card hr-card__top hr-card__who hr-card__more hr-footer hr-footer__art
  hr-footer__glow hr-panel hr-wordmark` ; variables `--hr-red --hr-glow
  --hr-deep`.
- Produit : `npm run check:halfred`, qui échoue au premier écart.

- [ ] **Étape 1 : créer la branche**

```bash
cd ~/Workspaces/Workspace-JobHunt/phudyka.github.io
git switch -c halfred-world
```

- [ ] **Étape 2 : écrire le contrôle (partie CSS)**

`scripts/check-halfred.mjs` :

```js
// Contrôle du monde Halfred. Partie CSS : sans build. Partie pages : après
// `npm run build`. Sortie non nulle au premier écart, avec son message.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// --- Palette ------------------------------------------------------------
const css = readFileSync("app/globals.css", "utf8");
const block = css.match(/\/\* halfred:start[\s\S]*?halfred:end \*\//)?.[0];
assert.ok(block, "bloc /* halfred:start */ … /* halfred:end */ absent de app/globals.css");

const PALETTE = new Set([
  "#d02232", "#ff3b4e", "#5a0b12", "#050506", "#0e0e10", "#292930", "#f0f4ff",
  "#000", "#fff",
]);
for (const hex of block.toLowerCase().match(/#[0-9a-f]{3,8}\b/g) ?? []) {
  assert.ok(PALETTE.has(hex), `couleur hors palette Halfred : ${hex}`);
}
assert.ok(!block.includes("oklch("), "oklch interdit dans le bloc Halfred : palette en hex fixe");
assert.ok(
  /(^|\n)body:has\(main\[data-brand="halfred"\]\)/.test(block),
  "les jetons Halfred doivent s'appliquer sans .dark (sombre seul)",
);
for (const needle of ["color-scheme: dark", ":focus-visible", "prefers-reduced-motion", ".side-grid"]) {
  assert.ok(block.includes(needle), `bloc Halfred : « ${needle} » manquant`);
}

// --- Pages (après build) -------------------------------------------------
function page(route) {
  const file = `out/${route}index.html`;
  assert.ok(existsSync(file), `${file} absent : lancer npm run build d'abord`);
  return readFileSync(file, "utf8").replace(/&nbsp;|[  ]/g, " ");
}
void page; void path; void readdirSync; void statSync;

console.log("check-halfred : OK");
```

Dans `package.json`, ajouter dans `scripts` :

```json
"check:halfred": "node scripts/check-halfred.mjs"
```

- [ ] **Étape 3 : vérifier l'échec**

Lancer :
`export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH && npm run check:halfred`

Attendu : échec avec `bloc /* halfred:start */ … absent de app/globals.css`.

- [ ] **Étape 4 : récupérer la police**

```bash
d=$(mktemp -d) && cd "$d" \
  && curl -fsSL -o gs.zip "https://api.fontshare.com/v2/fonts/download/general-sans" \
  && unzip -q gs.zip && find . -name 'GeneralSans-Variable.woff2'
cp "$(find "$d" -name 'GeneralSans-Variable.woff2' | head -1)" \
  ~/Workspaces/Workspace-JobHunt/phudyka.github.io/components/halfred/
```

Si le téléchargement échoue ou si le fichier n'existe pas, **s'arrêter et
demander à Paul** de déposer `GeneralSans-Variable.woff2` (fontshare.com/fonts/general-sans)
dans `components/halfred/`. Ne pas substituer une autre police sans son accord.

`components/halfred/font.ts` :

```ts
import localFont from "next/font/local";

/**
 * General Sans (Indian Type Foundry, via Fontshare, ITF Free Font License :
 * usage web autorisé). Réservée aux titres du monde Halfred ; le corps reste en
 * Inter comme le reste du site.
 */
export const display = localFont({
  src: "./GeneralSans-Variable.woff2",
  variable: "--font-hr-display",
  weight: "200 700",
  display: "swap",
});
```

- [ ] **Étape 5 : écrire le monde CSS**

Dans `app/globals.css`, remplacer tout le bloc qui commence par le commentaire
`/* Halfred — pas de design system écrit` et finit par l'accolade fermante de
`.dark body:has(main[data-brand="halfred"]) { … }` par :

```css
/* halfred:start — Monde « Half-red » (spec 2026-09-29). Rouge, noir, blanc,
   jamais d'orange (l'orange est l'identité de Paul). Sombre seul : les jetons
   s'appliquent avec ou sans `.dark`. Règle de la moitié : chaque composant est
   coupé net à 50 %. `scripts/check-halfred.mjs` refuse toute couleur hors
   palette dans ce bloc. */
body:has(main[data-brand="halfred"]),
.dark body:has(main[data-brand="halfred"]) {
  --background: #050506;
  --foreground: #f0f4ff;
  --card: #0e0e10;
  --muted: #292930;
  --muted-foreground: rgb(240 244 255 / 0.64);
  --accent: #292930;
  --primary: #d02232;
  --primary-foreground: #f0f4ff;
  --border: #292930;
  --input: #292930;
  --ring: #ff3b4e;
  --destructive: #ff3b4e;
  --hr-red: #d02232;
  --hr-glow: #ff3b4e;
  --hr-deep: #5a0b12;
  color-scheme: dark;
}

/* Les bandes de marge du hub n'ont rien à faire dans ce monde. */
body:has(main[data-brand="halfred"]) .side-grid { display: none; }

.hr-root { position: relative; overflow-x: clip; }
/* Grain : empêche les dégradés de bander. */
.hr-root::before {
  content: ""; position: fixed; inset: 0; z-index: 60; pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.hr-root :focus-visible { outline: 2px solid var(--hr-glow); outline-offset: 3px; }

.hr-wrap { width: 100%; max-width: 72rem; margin-inline: auto; padding-inline: 1.25rem; }
.hr-section { position: relative; padding-block: clamp(5rem, 12vw, 9rem); scroll-margin-top: 4rem; }
.hr-display { font-family: var(--font-hr-display), ui-sans-serif, system-ui, sans-serif; }
.hr-h1 { font-size: clamp(2.75rem, 7vw, 5.25rem); line-height: 1.02; letter-spacing: -0.04em; font-weight: 600; }
.hr-h2 { font-size: clamp(2rem, 4.2vw, 3.25rem); line-height: 1.05; letter-spacing: -0.035em; font-weight: 600; }
.hr-lead { font-size: 1.0625rem; line-height: 1.6; color: var(--muted-foreground); text-wrap: pretty; }
.hr-red { color: var(--hr-red); }

/* Titre coupé : moitié haute de chaque ligne en blanc, moitié basse en rouge.
   `1lh` répète la coupure à chaque ligne. */
.hr-half-text {
  background: linear-gradient(180deg, var(--foreground) 56%, var(--hr-red) 56%) 0 0 / 100% 1lh repeat-y;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* Boutons : reflet glossy en haut, moitié rouge / moitié noire. */
.hr-btn {
  position: relative; isolation: isolate; display: inline-flex; align-items: center;
  justify-content: center; height: 2.75rem; padding: 0 1.4rem; border-radius: 9999px;
  font-size: 0.9375rem; font-weight: 500; white-space: nowrap;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.hr-btn::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.18), transparent 55%);
}
.hr-btn:active { transform: translateY(1px); }
.hr-btn--half {
  color: var(--foreground);
  background: linear-gradient(90deg, var(--hr-red) 50%, var(--card) 50%);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08);
}
.hr-btn--half:hover { box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12), 0 0 32px -4px var(--hr-red); }
.hr-btn--light { color: #050506; background: var(--foreground); box-shadow: inset 0 -2px 0 var(--hr-red); }
.hr-btn--light:hover { box-shadow: inset 0 -3px 0 var(--hr-red), 0 0 28px -8px var(--foreground); }
.hr-btn--sm { height: 2.25rem; padding: 0 1rem; font-size: 0.8125rem; }

.hr-badge {
  display: inline-flex; align-items: center; gap: 0.5rem; height: 1.75rem;
  padding: 0 0.75rem 0 0.2rem; border-radius: 9999px; background: var(--muted);
  font-size: 0.8125rem; color: var(--foreground);
}
.hr-badge__tag {
  display: inline-flex; align-items: center; height: 1.35rem; padding: 0 0.55rem;
  border-radius: 9999px; background: var(--hr-red); font-size: 0.75rem; font-weight: 500;
}

/* Nav : fond flouté, transparente en haut de page quand le navigateur sait
   lier une animation au défilement. */
.hr-nav {
  position: fixed; inset: 0 0 auto; z-index: 40;
  background: rgb(5 5 6 / 0.6); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
@supports (animation-timeline: scroll()) {
  .hr-nav {
    background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none;
    animation: hr-nav linear both; animation-timeline: scroll(); animation-range: 0 40px;
  }
  @keyframes hr-nav { to { background: rgb(5 5 6 / 0.72); backdrop-filter: blur(14px); } }
}
.hr-menu { position: relative; }
.hr-menu summary {
  display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: 9999px;
  background: var(--muted); cursor: pointer; list-style: none;
}
.hr-menu summary::-webkit-details-marker { display: none; }
.hr-menu ul {
  position: absolute; right: 0; top: calc(100% + 0.5rem); min-width: 12rem; padding: 0.5rem;
  border-radius: 16px; background: var(--card); box-shadow: inset 0 0 0 1px var(--border);
}
.hr-menu a { display: block; padding: 0.5rem 0.75rem; border-radius: 10px; }
.hr-menu a:hover { background: var(--muted); }

/* Hero : horizon d'éclipse. En haut, un disque rouge dont le bord inférieur
   brille (réf. Ranvel) ; en bas à droite, une colline de lumière. Un seul
   élément, quatre couches. Ajuster les pourcentages à l'œil contre la
   référence, sans changer la structure. */
.hr-hero {
  position: relative; isolation: isolate; overflow: hidden; min-height: 100svh;
  display: grid; place-items: center; padding: 8rem 1.25rem 6rem; text-align: center;
}
.hr-eclipse {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(ellipse 140% 100% at 62% -42%, var(--hr-deep) 0%, var(--hr-red) 36%, var(--hr-glow) 49.6%, transparent 50%),
    radial-gradient(ellipse 142% 104% at 62% -42%, transparent 49%, rgb(208 34 50 / 0.35) 50%, transparent 57%),
    radial-gradient(ellipse 95% 60% at 88% 142%, var(--hr-deep) 0%, var(--hr-red) 36%, var(--hr-glow) 49.6%, transparent 50%),
    radial-gradient(ellipse 97% 63% at 88% 142%, transparent 49%, rgb(208 34 50 / 0.3) 50%, transparent 56%);
}
.hr-ignite { animation: hr-ignite 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
@keyframes hr-ignite { from { opacity: 0; filter: blur(30px); } to { opacity: 1; filter: blur(0); } }

.hr-band {
  display: block; width: 100%; height: auto; aspect-ratio: 21 / 9; object-fit: cover;
  margin-bottom: clamp(3rem, 8vw, 6rem);
  mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
}

/* Portrait : moitié gauche noir et blanc, moitié droite en duotone rouge. */
.hr-portrait { position: relative; flex: none; width: 5.5rem; aspect-ratio: 1; overflow: hidden; border-radius: 9999px; }
.hr-portrait img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.1); }
.hr-portrait::after { content: ""; position: absolute; inset: 0 0 0 50%; background: var(--hr-red); mix-blend-mode: multiply; }

/* Carte de prix : moitié haute rouge, moitié basse noire ; le détail replié
   vit sous les deux moitiés. */
.hr-card {
  display: grid; grid-template-rows: 1fr 1fr auto; overflow: hidden; border-radius: 20px;
  background: var(--card); box-shadow: inset 0 0 0 1px var(--border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hr-card:hover { transform: translateY(-4px); box-shadow: inset 0 0 0 1px var(--border), 0 18px 48px -18px var(--hr-glow); }
.hr-card__top { padding: 1.25rem; background: linear-gradient(180deg, var(--hr-red), var(--hr-deep)); color: var(--foreground); }
.hr-card__who { padding: 1.25rem 1.25rem 0.75rem; font-size: 0.875rem; line-height: 1.55; color: var(--muted-foreground); }
.hr-card__more { padding: 0 1.25rem 1.25rem; font-size: 0.8125rem; }
.hr-card__more summary { cursor: pointer; color: var(--foreground); text-decoration: underline; text-decoration-color: var(--hr-red); text-underline-offset: 4px; }
.hr-card__more ul { margin-top: 0.75rem; display: grid; gap: 0.375rem; color: var(--muted-foreground); }

.hr-footer { position: relative; isolation: isolate; overflow: hidden; padding-top: clamp(6rem, 14vw, 10rem); scroll-margin-top: 4rem; }
.hr-footer__art {
  position: absolute; inset: 0 0 auto 0; z-index: -1; width: 100%; height: auto; opacity: 0.9;
  mask-image: linear-gradient(180deg, transparent, #000 25%, #000 55%, transparent 85%);
}
.hr-footer__glow {
  position: absolute; inset: 0 0 auto 0; height: 70%; z-index: -1;
  background: radial-gradient(ellipse 80% 55% at 50% 45%, rgb(208 34 50 / 0.55), var(--hr-deep) 45%, transparent 72%);
}
.hr-panel {
  border-radius: 24px; padding: clamp(1.25rem, 3vw, 2rem); background: rgb(14 14 16 / 0.72);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: inset 0 0 0 1px var(--border);
}
.hr-wordmark {
  margin-top: 3rem; font-size: clamp(4.5rem, 21vw, 17rem); line-height: 0.78; letter-spacing: -0.065em;
  font-weight: 600; white-space: nowrap; text-align: center; overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .hr-ignite, .hr-nav { animation: none; }
  .hr-btn, .hr-card { transition: none; }
  .hr-card:hover { transform: none; }
}
/* halfred:end */
```

- [ ] **Étape 6 : vérifier**

Lancer :
`export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH && npm run check:halfred && npm run lint`

Attendu : `check-halfred : OK`, lint sans erreur.

- [ ] **Étape 7 : commit**

```bash
git add scripts/check-halfred.mjs package.json app/globals.css components/halfred/font.ts components/halfred/GeneralSans-Variable.woff2
git commit -m "Halfred : monde Half-red en CSS, police display, contrôle de palette"
```

---

### Tâche 2 : copie, primitives, nav et hero ; dock masqué

**Fichiers :**
- Modifier : `data/content.ts:216-389` (type `HalfredCopy` et `HALFRED`)
- Modifier : `data/content.en.ts:402-538` (`HALFRED_EN`)
- Créer : `components/halfred/half.tsx`, `components/halfred/nav.tsx`,
  `components/halfred/hero.tsx`
- Réécrire : `components/section/halfred.tsx`
- Modifier : `components/dock-nav.tsx` (`DockNav`, vers la ligne 129)
- Modifier : `scripts/check-halfred.mjs`

**Interfaces :**
- Consomme : `display` (tâche 1), classes `hr-*` (tâche 1),
  `BRAND_LOGO` (`components/ui/kit.tsx`), `BlurFade` (`components/blur-fade.tsx`).
- Produit : `type HalfredCopy` (ci-dessous), `HALFRED`, `HALFRED_EN` ;
  `HalfButton`, `LightButton` (`{ href: string; children: ReactNode; small?: boolean }`),
  `HalfBadge` (`{ tag: string; children: ReactNode }`) ;
  `export type Lang = "fr" | "en"` et `HalfredBody({ lang }: { lang: Lang })` dans
  `components/section/halfred.tsx`. `OffresBody` disparaît.

- [ ] **Étape 1 : écrire le test**

Dans `scripts/check-halfred.mjs`, remplacer la ligne
`void page; void path; void readdirSync; void statSync;` par :

```js
const LANGS = [
  { route: "halfred/", title: "Votre entreprise, moins les tâches répétitives.", nav: "Navigation Halfred" },
  { route: "en/halfred/", title: "Your business, minus the repetitive tasks.", nav: "Halfred navigation" },
];
for (const l of LANGS) {
  const html = page(l.route);
  assert.ok(html.includes('data-brand="halfred"'), `${l.route} : monde Halfred absent`);
  assert.ok(html.includes(l.title), `${l.route} : titre du hero absent`);
  assert.ok(html.includes(`aria-label="${l.nav}"`), `${l.route} : nav Halfred absente`);
  assert.ok(!html.includes('aria-label="Navigation principale"'), `${l.route} : le dock du hub est encore rendu`);
}
void path; void readdirSync; void statSync;
```

- [ ] **Étape 2 : vérifier l'échec**

Lancer : `npm run build && npm run check:halfred` (PATH nvm exporté).
Attendu : échec `halfred/ : monde Halfred absent`… ou `titre du hero absent`.

- [ ] **Étape 3 : réécrire le type et la copie FR**

Dans `data/content.ts`, remplacer `export type HalfredCopy = { … };` (ligne 216)
et `export const HALFRED: HalfredCopy = { … };` (ligne 263) par :

```ts
/**
 * Copie de la landing Halfred (monde « Half-red », spec du 2026-09-29) : trois
 * écrans et un footer. Les prix restent dans `OFFERS` et `TERMS`.
 */
export type HalfredCopy = {
  home: string;
  hub: { label: string; href: string };
  nav: { label: string; about: string; pricing: string; contact: string; menu: string };
  badge: readonly [string, string];
  title: string;
  lead: string;
  ctaContact: string;
  ctaPricing: string;
  place: string;
  about: {
    title: string;
    halfred: readonly string[];
    paul: readonly string[];
    portraitAlt: string;
    safeguardsTitle: string;
    safeguards: readonly string[];
  };
  pricing: { title: string; lead: string; included: string; colon: string };
  contact: { title: string; lead: string };
  footer: { otherLang: { label: string; href: string } };
};

export const HALFRED: HalfredCopy = {
  home: "/halfred/",
  hub: { label: "Paul Hudyka", href: "/" },
  nav: { label: "Navigation Halfred", about: "Halfred", pricing: "Tarifs", contact: "Contact", menu: "Menu" },
  badge: ["IA", "Automatisation pour TPE et PME"],
  title: "Votre entreprise, moins les tâches répétitives.",
  lead:
    "Consultant en automatisation et IA pour les TPE et les PME. Audit d’abord, puis la solution adaptée à vos outils.",
  ctaContact: "Parler de votre besoin",
  ctaPricing: "Voir les tarifs",
  place: "La Colle-sur-Loup · sur place et à distance",
  about: {
    title: "Ce qui se répète, je l’automatise.",
    halfred: [
      "E-mails triés, clients relancés, devis calculés selon vos règles, rendez-vous pris, outils reliés entre eux.",
      "Et quand le besoin est là : un agent IA branché sur vos outils, ou installé 100 % chez vous.",
    ],
    paul: [
      "Paul Hudyka, consultant indépendant à La Colle-sur-Loup, dans les Alpes-Maritimes.",
      "J’interviens sur place et à distance, et je commence toujours par regarder comment vous travaillez.",
    ],
    portraitAlt: "Paul Hudyka",
    safeguardsTitle: "Trois garde-fous, sur chaque projet",
    safeguards: [
      "Les calculs passent par du code, jamais par le modèle.",
      "Rien ne part sans votre validation.",
      "Tout est écrit avant de commencer.",
    ],
  },
  pricing: {
    title: "Des prix publics, pour commencer petit.",
    lead: "Tarifs de lancement, en euros hors taxe. On commence par un échange gratuit de 30 minutes.",
    included: "Ce qui est inclus",
    colon: " : ",
  },
  contact: {
    title: "Dites-moi ce que vos équipes refont à la main.",
    lead: "Je vous dis si ça vaut le coup de l’automatiser, et ce que ça coûte. Réponse sous 48 heures ouvrées.",
  },
  footer: { otherLang: { label: "English", href: "/en/halfred/" } },
};
```

Si `CLIENT` n'est plus utilisé nulle part après ce remplacement (`grep -rn
"CLIENT\b" app components data`), le laisser en place : il reste une donnée de
référence et son export n'est pas une erreur de lint.

- [ ] **Étape 4 : réécrire la copie EN**

Dans `data/content.en.ts`, remplacer `export const HALFRED_EN: HalfredCopy = { … };`
(ligne 402) par :

```ts
export const HALFRED_EN: HalfredCopy = {
  home: "/en/halfred/",
  hub: { label: "Paul Hudyka", href: "/en/" },
  nav: { label: "Halfred navigation", about: "Halfred", pricing: "Pricing", contact: "Contact", menu: "Menu" },
  badge: ["AI", "Automation for small businesses"],
  title: "Your business, minus the repetitive tasks.",
  lead:
    "Automation and AI consultant for small and medium businesses. Audit first, then the solution that fits your tools.",
  ctaContact: "Talk about your needs",
  ctaPricing: "See pricing",
  place: "La Colle-sur-Loup, France · on site and remote",
  about: {
    title: "What repeats, I automate.",
    halfred: [
      "Emails sorted, customers followed up, quotes calculated from your own rules, appointments booked, tools connected to each other.",
      "And when the need is there: an AI agent wired into your tools, or installed 100% on your premises.",
    ],
    paul: [
      "Paul Hudyka, independent consultant in La Colle-sur-Loup, on the French Riviera.",
      "I work on site and remotely, and I always start by looking at how you work.",
    ],
    portraitAlt: "Paul Hudyka",
    safeguardsTitle: "Three safeguards, on every project",
    safeguards: [
      "Calculations run through code, never through the model.",
      "Nothing goes out without your approval.",
      "Everything is written down before we start.",
    ],
  },
  pricing: {
    title: "Public prices, to start small.",
    lead: "Launch prices, in euros excluding tax. We start with a free 30-minute call.",
    included: "What’s included",
    colon: ": ",
  },
  contact: {
    title: "Tell me what your team keeps redoing by hand.",
    lead: "I’ll tell you whether it’s worth automating, and what it costs. Reply within 48 working hours.",
  },
  footer: { otherLang: { label: "Français", href: "/halfred/" } },
};
```

- [ ] **Étape 5 : primitives**

`components/halfred/half.tsx` :

```tsx
import type { ReactNode } from "react";

/**
 * Primitives du monde Halfred, coupées selon la règle de la moitié. Des `<a>`
 * simples : toutes les cibles sont des ancres de la page ou des routes
 * statiques.
 */
type ButtonProps = { href: string; children: ReactNode; small?: boolean };

/** Moitié gauche rouge, moitié droite noire, texte à cheval. */
export function HalfButton({ href, children, small }: ButtonProps) {
  return (
    <a href={href} className={`hr-btn hr-btn--half${small ? " hr-btn--sm" : ""}`}>
      {children}
    </a>
  );
}

/** Fond blanc, liseré rouge en bas. */
export function LightButton({ href, children, small }: ButtonProps) {
  return (
    <a href={href} className={`hr-btn hr-btn--light${small ? " hr-btn--sm" : ""}`}>
      {children}
    </a>
  );
}

/** Pastille rouge à gauche, libellé sur graphite. */
export function HalfBadge({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <span className="hr-badge">
      <span className="hr-badge__tag">{tag}</span>
      {children}
    </span>
  );
}
```

- [ ] **Étape 6 : nav**

`components/halfred/nav.tsx` :

```tsx
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { HalfButton } from "@/components/halfred/half";
import { BRAND_LOGO } from "@/components/ui/kit";
import type { HalfredCopy } from "@/data/content";

/**
 * Barre propre au monde Halfred ; le dock du hub est masqué sur ces routes.
 * Le menu mobile est un `<details>` natif : aucun JavaScript.
 */
export default function Nav({ t }: { t: HalfredCopy }) {
  const links = [
    ["#halfred", t.nav.about],
    ["#tarifs", t.nav.pricing],
    ["#contact", t.nav.contact],
  ] as const;
  return (
    <header className="hr-nav">
      <nav aria-label={t.nav.label} className="hr-wrap flex h-16 items-center justify-between gap-6">
        <a href={t.home} className="flex items-center gap-2.5 font-medium">
          <Image src={BRAND_LOGO.halfred} alt="" width={28} height={28} className="rounded-md" />
          Halfred
        </a>
        <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="transition-colors hover:text-foreground">{label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link href={t.hub.href} className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline">
            {t.hub.label} ↗
          </Link>
          <HalfButton href="#contact" small>{t.ctaContact}</HalfButton>
          <details className="hr-menu md:hidden">
            <summary aria-label={t.nav.menu}>
              <Menu className="size-4" aria-hidden />
            </summary>
            <ul>
              {links.map(([href, label]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
              <li><Link href={t.hub.href}>{t.hub.label} ↗</Link></li>
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Étape 7 : hero**

`components/halfred/hero.tsx` :

```tsx
import BlurFade from "@/components/blur-fade";
import { HalfBadge, HalfButton, LightButton } from "@/components/halfred/half";
import type { HalfredCopy } from "@/data/content";

/**
 * Premier écran : l'horizon d'éclipse s'allume, puis le texte arrive avec la
 * grammaire `BlurFade`. C'est la seule chorégraphie du monde Halfred.
 */
export default function Hero({ t }: { t: HalfredCopy }) {
  return (
    <section className="hr-hero" aria-labelledby="hr-title">
      <div aria-hidden className="hr-eclipse hr-ignite" />
      <div className="relative flex max-w-4xl flex-col items-center gap-7">
        <BlurFade delay={0.5}>
          <HalfBadge tag={t.badge[0]}>{t.badge[1]}</HalfBadge>
        </BlurFade>
        <BlurFade delay={0.6} duration={0.8} blur="14px" yOffset={12}>
          <h1 id="hr-title" className="hr-display hr-h1 hr-half-text text-balance">
            {t.title}
          </h1>
        </BlurFade>
        <BlurFade delay={0.72}>
          <p className="hr-lead mx-auto max-w-[52ch]">{t.lead}</p>
        </BlurFade>
        <BlurFade delay={0.8}>
          <div className="flex flex-wrap justify-center gap-3">
            <HalfButton href="#contact">{t.ctaContact}</HalfButton>
            <LightButton href="#tarifs">{t.ctaPricing}</LightButton>
          </div>
        </BlurFade>
        <BlurFade delay={0.9}>
          <p className="text-sm text-muted-foreground">{t.place}</p>
        </BlurFade>
      </div>
    </section>
  );
}
```

- [ ] **Étape 8 : composition**

Remplacer tout `components/section/halfred.tsx` par :

```tsx
import { display } from "@/components/halfred/font";
import Hero from "@/components/halfred/hero";
import Nav from "@/components/halfred/nav";
import { HALFRED } from "@/data/content";
import { HALFRED_EN } from "@/data/content.en";

/**
 * Landing Halfred, rendue une fois pour les deux langues (monde « Half-red »,
 * spec du 2026-09-29). Pleine largeur : elle ne passe pas par `Column`, mais
 * pose elle-même `data-brand="halfred"`, qui active ses jetons.
 */
export type Lang = "fr" | "en";

export function HalfredBody({ lang }: { lang: Lang }) {
  const t = lang === "en" ? HALFRED_EN : HALFRED;
  return (
    <main id="contenu" data-brand="halfred" className={`hr-root ${display.variable}`}>
      <Nav t={t} />
      <Hero t={t} />
    </main>
  );
}
```

`app/halfred/offres/page.tsx` et `app/en/halfred/offres/page.tsx` importent
encore `OffresBody` : les réécrire dès maintenant en redirection (le contenu
exact est à la tâche 5, étape 3), sinon le build casse.

- [ ] **Étape 9 : masquer le dock**

Dans `components/dock-nav.tsx`, fonction `DockNav`, juste après
`const pathname = usePathname();` :

```tsx
  // Le monde Halfred a sa propre barre ; le dock et sa bascule de thème n'y
  // ont pas leur place (spec du 2026-09-29).
  if (/^\/(en\/)?halfred\/$/.test(pathname)) return null;
```

Si `useActive()` ou un autre hook est appelé **après** cette ligne dans
`DockNav`, déplacer le `return null` après le dernier hook : les règles des hooks
l'exigent, et `npm run lint` le signale.

- [ ] **Étape 10 : vérifier**

Lancer : `npm run lint && npm run build && npm run check:halfred`
Attendu : `check-halfred : OK`.

- [ ] **Étape 11 : commit**

```bash
git add data/content.ts data/content.en.ts components/halfred components/section/halfred.tsx components/dock-nav.tsx scripts/check-halfred.mjs app/halfred/offres/page.tsx app/en/halfred/offres/page.tsx
git commit -m "Halfred : copie, nav et hero du monde Half-red, dock masqué"
```

---

### Tâche 3 : écran « Quoi et qui » et grille de tarifs

**Fichiers :**
- Créer : `components/halfred/asset.ts`, `components/halfred/about.tsx`,
  `components/halfred/pricing.tsx`
- Modifier : `components/section/halfred.tsx`
- Modifier : `scripts/check-halfred.mjs`

**Interfaces :**
- Consomme : `HalfredCopy`, `Lang` (tâche 2) ; `Offer`, `OFFERS`, `TERMS`
  (`data/content.ts`) ; `OFFERS_EN`, `TERMS_EN` (`data/content.en.ts`).
- Produit : `halfredImage(name: string): string | null` (utilisé par les
  tâches 4 et 6) ; `About({ t })`, `Pricing({ t, offers, terms })`.

- [ ] **Étape 1 : écrire le test**

Dans `scripts/check-halfred.mjs`, avant `void path; …`, ajouter :

```js
const PRICES = {
  "halfred/": ["Gratuit", "350 €", "à partir de 490 €", "1 200 à 2 500 €", "2 500 à 5 000 €", "à partir de 5 000 €", "800 à 1 500 €", "39 € / mois"],
  "en/halfred/": ["Free", "€350", "from €490", "€1,200 to €2,500", "€2,500 to €5,000", "from €5,000", "€800 to €1,500", "€39 / month"],
};
for (const [route, prices] of Object.entries(PRICES)) {
  const html = page(route);
  for (const id of ["halfred", "tarifs"]) {
    assert.ok(html.includes(`id="${id}"`), `${route} : section #${id} absente`);
  }
  for (const price of prices) {
    assert.ok(html.includes(price), `${route} : prix « ${price} » absent`);
  }
}
```

- [ ] **Étape 2 : vérifier l'échec**

Lancer : `npm run build && npm run check:halfred`
Attendu : échec `halfred/ : section #halfred absente`.

- [ ] **Étape 3 : images optionnelles**

`components/halfred/asset.ts` :

```ts
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Chemin public d'une image du monde Halfred, ou `null` tant que Paul ne l'a
 * pas livrée dans `public/halfred/`. Lu au build (composants serveur, export
 * statique) : la page reste complète sans ses images.
 */
export function halfredImage(name: string): string | null {
  return existsSync(path.join(process.cwd(), "public/halfred", name))
    ? `/halfred/${name}`
    : null;
}
```

- [ ] **Étape 4 : écran « Quoi et qui »**

`components/halfred/about.tsx` :

```tsx
import Image from "next/image";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import type { HalfredCopy } from "@/data/content";

/** Ce qu'est Halfred, qui est Paul, et les trois garde-fous. */
export default function About({ t }: { t: HalfredCopy }) {
  const rings = halfredImage("rings.webp");
  return (
    <section id="halfred" className="hr-section">
      {rings
        ? <Image src={rings} alt="" width={2560} height={1097} className="hr-band" />
        : null}
      <div className="hr-wrap grid gap-12 md:grid-cols-2 md:gap-16">
        <BlurFade inView>
          <h2 className="hr-display hr-h2">{t.about.title}</h2>
          <div className="mt-6 flex flex-col gap-4">
            {t.about.halfred.map((line) => <p key={line} className="hr-lead">{line}</p>)}
          </div>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <div className="flex items-start gap-5 md:pt-3">
            <span className="hr-portrait">
              <Image src="/paul-hudyka.webp" alt={t.about.portraitAlt} width={176} height={176} />
            </span>
            <div className="flex flex-col gap-3">
              {t.about.paul.map((line) => <p key={line} className="hr-lead">{line}</p>)}
            </div>
          </div>
        </BlurFade>
      </div>
      <div className="hr-wrap mt-16 md:mt-24">
        <BlurFade inView>
          <h3 className="text-sm font-medium text-muted-foreground">{t.about.safeguardsTitle}</h3>
          <ol className="mt-5 grid gap-px overflow-hidden rounded-[20px] bg-border md:grid-cols-3">
            {t.about.safeguards.map((line, index) => (
              <li key={line} className="flex items-baseline gap-4 bg-card p-6">
                <span className="num hr-display hr-red text-2xl font-semibold" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium leading-snug">{line}</span>
              </li>
            ))}
          </ol>
        </BlurFade>
      </div>
    </section>
  );
}
```

- [ ] **Étape 5 : grille de tarifs**

`components/halfred/pricing.tsx` :

```tsx
import BlurFade from "@/components/blur-fade";
import type { HalfredCopy, Offer } from "@/data/content";

type Terms = ReadonlyArray<readonly [string, string]>;

/**
 * Les huit offres, en cartes coupées moitié rouge / moitié noire. Le détail
 * « inclus » est replié (`<details>`) pour garder l'écran léger.
 */
export default function Pricing(
  { t, offers, terms }: { t: HalfredCopy; offers: readonly Offer[]; terms: Terms },
) {
  return (
    <section id="tarifs" className="hr-section">
      <div className="hr-wrap">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 max-w-[18ch]">{t.pricing.title}</h2>
          <p className="hr-lead mt-4 max-w-[60ch]">{t.pricing.lead}</p>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((offer) => (
              <li key={offer.id} className="hr-card">
                <div className="hr-card__top">
                  <h3 className="font-medium leading-snug">{offer.name}</h3>
                  <p className="num hr-display mt-3 text-2xl font-semibold tracking-tight">{offer.price}</p>
                  {offer.note
                    ? <p className="num mt-1 text-xs text-white/75">{offer.note}</p>
                    : null}
                </div>
                <p className="hr-card__who">{offer.who}</p>
                <details className="hr-card__more">
                  <summary>{t.pricing.included}</summary>
                  <ul>
                    {offer.included.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </BlurFade>
        <p className="num mt-8 text-sm leading-relaxed text-muted-foreground">
          {terms.map(([label, value]) => `${label}${t.pricing.colon}${value}`).join(" · ")}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Étape 6 : composer**

Dans `components/section/halfred.tsx`, ajouter les imports :

```tsx
import About from "@/components/halfred/about";
import Pricing from "@/components/halfred/pricing";
import { OFFERS, TERMS } from "@/data/content";
import { OFFERS_EN, TERMS_EN } from "@/data/content.en";
```

(fusionner avec les imports existants de `@/data/content` et
`@/data/content.en`), puis dans `HalfredBody` :

```tsx
  const t = lang === "en" ? HALFRED_EN : HALFRED;
  const offers = lang === "en" ? OFFERS_EN : OFFERS;
  const terms = lang === "en" ? TERMS_EN : TERMS;
  return (
    <main id="contenu" data-brand="halfred" className={`hr-root ${display.variable}`}>
      <Nav t={t} />
      <Hero t={t} />
      <About t={t} />
      <Pricing t={t} offers={offers} terms={terms} />
    </main>
  );
```

- [ ] **Étape 7 : vérifier**

Lancer : `npm run lint && npm run build && npm run check:halfred`
Attendu : `check-halfred : OK`. Si un prix FR manque alors qu'il s'affiche,
comparer caractère par caractère avec `OFFERS` : la normalisation ne couvre que
les espaces insécables.

- [ ] **Étape 8 : commit**

```bash
git add components/halfred components/section/halfred.tsx scripts/check-halfred.mjs
git commit -m "Halfred : écran « quoi et qui » et grille des huit offres"
```

---

### Tâche 4 : footer, contact, mentions

**Fichiers :**
- Créer : `components/halfred/footer.tsx`
- Modifier : `components/section/halfred.tsx`
- Modifier : `scripts/check-halfred.mjs`

**Interfaces :**
- Consomme : `halfredImage` (tâche 3) ; `Contact` (export par défaut) et
  `COPY_EN_HALFRED` (`components/section/contact.tsx`) ; `LegalFooter`
  (`components/section/legal-footer.tsx`) ; `LEGAL` (`data/content.ts`) ;
  `Lang` (tâche 2).
- Produit : `Footer({ t, lang })`.

- [ ] **Étape 1 : écrire le test**

Dans `scripts/check-halfred.mjs`, avant `void path; …`, ajouter :

```js
for (const route of ["halfred/", "en/halfred/"]) {
  const html = page(route);
  assert.ok(html.includes('id="contact"'), `${route} : footer #contact absent`);
  assert.ok(html.includes("contact.halfred@gmail.com"), `${route} : adresse de contact absente`);
  assert.ok(html.includes("107 717 530"), `${route} : SIREN absent`);
  assert.ok(html.includes('href="https://github.com/phudyka"'), `${route} : lien GitHub absent`);
}
```

- [ ] **Étape 2 : vérifier l'échec**

Lancer : `npm run build && npm run check:halfred`
Attendu : échec `halfred/ : footer #contact absent`.

- [ ] **Étape 3 : footer**

`components/halfred/footer.tsx` :

```tsx
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/blur-fade";
import { halfredImage } from "@/components/halfred/asset";
import Contact, { COPY_EN_HALFRED } from "@/components/section/contact";
import LegalFooter from "@/components/section/legal-footer";
import type { Lang } from "@/components/section/halfred";
import { type HalfredCopy, LEGAL } from "@/data/content";

/**
 * Contact, mentions et mot-marque. Sans l'image du ruban, une lueur CSS tient
 * sa place. `Contact` affiche toujours l'adresse ; le formulaire n'apparaît que
 * si la clé Web3Forms Halfred est fournie au build.
 */
export default function Footer({ t, lang }: { t: HalfredCopy; lang: Lang }) {
  const ribbon = halfredImage("ribbon.webp");
  return (
    <footer id="contact" className="hr-footer">
      {ribbon
        ? <Image src={ribbon} alt="" width={2560} height={1097} className="hr-footer__art" />
        : <div aria-hidden className="hr-footer__glow" />}
      <div className="hr-wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <BlurFade inView>
          <h2 className="hr-display hr-h2 max-w-[16ch]">{t.contact.title}</h2>
          <p className="hr-lead mt-4 max-w-[48ch]">{t.contact.lead}</p>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <div className="hr-panel">
            <Contact copy={lang === "en" ? COPY_EN_HALFRED : undefined} />
          </div>
        </BlurFade>
      </div>
      <div className="hr-wrap mt-20 flex flex-col gap-8 text-sm text-muted-foreground">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link href={t.hub.href} className="hover:text-foreground">{t.hub.label}</Link></li>
          <li>
            <a href="https://github.com/phudyka" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </a>
          </li>
          <li>
            <Link href={t.footer.otherLang.href} className="hover:text-foreground">{t.footer.otherLang.label}</Link>
          </li>
        </ul>
        {lang === "fr"
          ? <LegalFooter />
          : (
            <p>
              {LEGAL.entity} · SIREN <span className="num">{LEGAL.siren}</span> · La Colle-sur-Loup, France
            </p>
          )}
      </div>
      <p aria-hidden className="hr-display hr-wordmark">
        <span>Half</span><span className="hr-red">red</span>
      </p>
    </footer>
  );
}
```

L'import de type `Lang` depuis `components/section/halfred.tsx` crée un cycle
de modules purement typé (effacé à la compilation) ; si le lint le refuse,
déplacer `export type Lang = "fr" | "en";` dans `components/halfred/half.tsx` et
l'importer de là dans les deux fichiers.

- [ ] **Étape 4 : composer**

Dans `components/section/halfred.tsx`, ajouter
`import Footer from "@/components/halfred/footer";` et, après `<Pricing … />` :

```tsx
      <Footer t={t} lang={lang} />
```

- [ ] **Étape 5 : vérifier**

Lancer : `npm run lint && npm run build && npm run check:halfred`
Attendu : `check-halfred : OK`.

- [ ] **Étape 6 : commit**

```bash
git add components/halfred/footer.tsx components/section/halfred.tsx scripts/check-halfred.mjs
git commit -m "Halfred : footer avec contact, mentions et mot-marque"
```

---

### Tâche 5 : redirections `/halfred/offres/` et liens internes

**Fichiers :**
- Réécrire : `app/halfred/offres/page.tsx`, `app/en/halfred/offres/page.tsx`
- Modifier : `components/section/home.tsx:47`, `app/halfred/page.tsx`
  (commentaire), `components/section/contact.tsx:112` et `:154` (commentaires)
- Modifier : `scripts/check-halfred.mjs`

**Interfaces :**
- Consomme : rien des tâches précédentes, sauf l'ancre `#tarifs` (tâche 3).
- Produit : rien.

- [ ] **Étape 1 : écrire le test**

Dans `scripts/check-halfred.mjs`, avant `void path; …`, ajouter :

```js
for (const [route, target] of [["halfred/offres/", "/halfred/#tarifs"], ["en/halfred/offres/", "/en/halfred/#tarifs"]]) {
  const html = page(route);
  assert.ok(html.includes('http-equiv="refresh"'), `${route} : redirection absente`);
  assert.ok(html.includes(`url=${target}`), `${route} : la redirection ne vise pas ${target}`);
}
function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* htmlFiles(full);
    else if (name.endsWith(".html")) yield full;
  }
}
for (const file of htmlFiles("out")) {
  if (file.includes(`${path.sep}offres${path.sep}`)) continue;
  const html = readFileSync(file, "utf8");
  assert.ok(!/href="(\/en)?\/halfred\/offres\//.test(html), `${file} : lien vers l'ancienne page d'offres`);
}
```

et supprimer la ligne `void path; void readdirSync; void statSync;` (tous
les imports sont désormais utilisés).

- [ ] **Étape 2 : vérifier l'échec**

Lancer : `npm run build && npm run check:halfred`
Attendu : échec `halfred/offres/ : redirection absente` (ou
`… lien vers l'ancienne page d'offres` si la tâche 2 a déjà posé la
redirection).

- [ ] **Étape 3 : pages de redirection**

`app/halfred/offres/page.tsx` :

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres et tarifs — Halfred",
  robots: { index: false },
  alternates: { canonical: "/halfred/" },
};

/**
 * Ancienne adresse de la grille, fondue dans `/halfred/#tarifs` le 2026-09-29.
 * GitHub Pages ne sait pas rediriger côté serveur : un refresh HTML le fait,
 * et le lien sert à qui l'a désactivé.
 */
export default function OffresRedirect() {
  return (
    <main id="contenu" className="mx-auto max-w-xl px-5 py-32 text-center">
      <meta httpEquiv="refresh" content="0; url=/halfred/#tarifs" />
      <p>
        La grille a déménagé :{" "}
        <a href="/halfred/#tarifs" className="underline underline-offset-4">
          offres et tarifs de Halfred
        </a>
        .
      </p>
    </main>
  );
}
```

`app/en/halfred/offres/page.tsx` :

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers and pricing — Halfred",
  robots: { index: false },
  alternates: { canonical: "/en/halfred/" },
};

/** Pendant anglais de `app/halfred/offres/page.tsx`. */
export default function OffresRedirectEn() {
  return (
    <main id="contenu" className="mx-auto max-w-xl px-5 py-32 text-center">
      <meta httpEquiv="refresh" content="0; url=/en/halfred/#tarifs" />
      <p>
        Pricing has moved:{" "}
        <a href="/en/halfred/#tarifs" className="underline underline-offset-4">
          Halfred offers and pricing
        </a>
        .
      </p>
    </main>
  );
}
```

- [ ] **Étape 4 : liens et commentaires**

- `components/section/home.tsx:47` : `href="/halfred/offres/"` devient
  `href="/halfred/#tarifs"`.
- Chercher les autres liens : `grep -rn 'halfred/offres' app components data`.
  Tout `href` restant vers `/halfred/offres/` ou `/en/halfred/offres/` passe à
  `#tarifs` de la page correspondante. Laisser `LANG_PAIRS`
  (`data/content.en.ts`) et la table de `app/layout.tsx:82` : les pages de
  redirection existent toujours.
- `app/halfred/page.tsx` : remplacer le commentaire de la fonction par
  `/** Landing Halfred (monde « Half-red », 2026-09-29) : copie dans `HALFRED`, prix dans `OFFERS`. */`.
- `components/section/contact.tsx:112` : `` `COPY_FR` reste sur /halfred/offres/ ``
  devient `` `COPY_FR` reste sur /halfred/ ``. Ligne 154 : `/en/halfred/offres/`
  devient `/en/halfred/`.

- [ ] **Étape 5 : vérifier**

Lancer : `npm run lint && npm run build && npm run check:halfred`
Attendu : `check-halfred : OK`.

- [ ] **Étape 6 : commit**

```bash
git add app components scripts/check-halfred.mjs
git commit -m "Halfred : /halfred/offres/ redirige vers #tarifs, liens internes à jour"
```

---

### Tâche 6 : images de Paul et partage social

Les images de Paul sont livrées (voir étape 3). Le test garantit aussi que la
page reste propre sans elles.

**Fichiers :**
- Créer : `public/halfred/rings.webp`, `public/halfred/ribbon.webp`,
  `public/halfred/og.jpg`, `scripts/halfred-clut.png`
- Modifier : `app/halfred/page.tsx`, `app/en/halfred/page.tsx` (métadonnées OG)
- Modifier : `scripts/check-halfred.mjs`

**Interfaces :**
- Consomme : `halfredImage` (tâche 3).
- Produit : rien.

- [ ] **Étape 1 : écrire le test**

Dans `scripts/check-halfred.mjs`, juste avant `console.log(…)`, ajouter :

```js
// --- Images --------------------------------------------------------------
const imgDir = "public/halfred";
const delivered = existsSync(imgDir) ? readdirSync(imgDir) : [];
const total = delivered.reduce((sum, name) => sum + statSync(path.join(imgDir, name)).size, 0);
assert.ok(total <= 350 * 1024, `images Halfred : ${Math.round(total / 1024)} Ko, budget 350 Ko`);
for (const route of ["halfred/", "en/halfred/"]) {
  const html = page(route);
  for (const [, name] of html.matchAll(/src="\/halfred\/([^"?]+)/g)) {
    assert.ok(delivered.includes(name), `${route} : image /halfred/${name} référencée mais absente`);
  }
  if (delivered.includes("og.jpg")) {
    assert.ok(html.includes("/halfred/og.jpg"), `${route} : og.jpg livrée mais absente des métadonnées`);
  }
}
```

- [ ] **Étape 2 : vérifier**

Lancer : `npm run build && npm run check:halfred`
Attendu sans images : `check-halfred : OK` (le test pose le filet). Avec des
images déjà déposées mais pas encore câblées dans les métadonnées : échec
`og.jpg livrée mais absente des métadonnées`.

- [ ] **Étape 3 : convertir les images de Paul**

Rendus livrés le 2026-09-29 (`~/Downloads/3.zip`, 7680×3240) : `1.png` les
anneaux, `2.png` l'éclipse (image de partage), `3.png` le ruban. Passés par un
upscale Canva, leurs teintes divergent entre elles et avec la palette. On ne les
retouche donc pas : on les **recolore**. Chaque pixel garde sa luminosité (canal
B de HSB), qui est remappée sur une rampe unique tirée de la palette. Les trois
images partagent alors exactement les mêmes teintes, et leurs fonds tombent sur
`#050506`.

La rampe (`scripts/halfred-clut.png`, 256×1, à commiter) va de `#050506` à
`#5a0b12` (15 %), puis `#d02232` (50 %), `#ff3b4e` (81 %) et `#f0f4ff` (100 %) :

```bash
mkdir -p public/halfred
magick -size 1x38 gradient:'#050506-#5a0b12' -size 1x90 gradient:'#5a0b12-#d02232' \
  -size 1x80 gradient:'#d02232-#ff3b4e' -size 1x48 gradient:'#ff3b4e-#f0f4ff' \
  -append -rotate 90 -flop scripts/halfred-clut.png
# Luminosité -> rampe. 3e argument : point noir (18 % pour le ruban, dont le
# fond était gris). Gamma 0.42 : garde le relief des volumes.
m(){ magick "$1" -resize "$2" -colorspace HSB -channel B -separate +channel \
  -level "$3",100%,0.42 scripts/halfred-clut.png -clut -strip "${@:4}"; }
Z=/chemin/vers/les/rendus
m $Z/1.png 2560x 4%  -quality 76 public/halfred/rings.webp
m $Z/3.png 2560x 18% -quality 76 public/halfred/ribbon.webp
m $Z/2.png 1200x630^ 4% -gravity center -extent 1200x630 -quality 84 public/halfred/og.jpg
du -ch public/halfred/*
```

Attendu : environ 112 Ko au total. Tout nouveau rendu passe par la même
commande : c'est ce qui garantit que les images du monde Halfred restent
cohérentes entre elles.

- [ ] **Étape 4 : partage social**

Dans `app/halfred/page.tsx`, ajouter
`import { halfredImage } from "@/components/halfred/asset";` et, dans
`metadata` :

```ts
  openGraph: {
    title: "Halfred",
    description:
      "Consultant en automatisation et IA pour TPE et PME, à La Colle-sur-Loup et à distance. Audit d’abord, puis la solution adaptée à vos outils.",
    images: halfredImage("og.jpg") ? ["/halfred/og.jpg"] : undefined,
  },
```

Même ajout dans `app/en/halfred/page.tsx`, avec la description anglaise déjà
présente dans son `metadata`.

- [ ] **Étape 5 : vérifier**

Lancer : `npm run lint && npm run build && npm run check:halfred`
Attendu : `check-halfred : OK`.

- [ ] **Étape 6 : commit**

```bash
git add public/halfred scripts/halfred-clut.png app/halfred/page.tsx app/en/halfred/page.tsx scripts/check-halfred.mjs
git commit -m "Halfred : images des formes 3D, image de partage, budget de poids"
```

---

### Tâche 7 : contrôle visuel, documentation du monde

**Fichiers :**
- Modifier : `CLAUDE.md` (« Mondes de marque », « Conventions »)
- Modifier : `PRODUCT.md` (« Brand Commitments »)
- Modifier : `DESIGN.md` (nouvelle section « Monde Halfred »)
- Ajustements CSS éventuels : `app/globals.css` (bloc Halfred uniquement)

**Interfaces :**
- Consomme : la page complète (tâches 1 à 6).
- Produit : la documentation que lisent les prochains agents.

- [ ] **Étape 1 : captures et audit**

```bash
export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH
npm run build
python3 -m http.server 4321 -d out &
node .impeccable/shoot.mjs
node .impeccable/shoot.mjs states
node .impeccable/shoot.mjs audit
```

Attendu : l'audit ne signale ni débordement horizontal, ni contraste sous AA,
ni révélation bloquée sur `/halfred/` et `/en/halfred/`. Ouvrir les captures
desktop et mobile de `.impeccable/shots/` et vérifier :
- la page est noire même en thème clair (la capture « light » de `shoot.mjs`) ;
- l'horizon du hero ressemble à la référence Ranvel (disque lumineux en haut,
  colline en bas à droite), en rouge, sans orange ;
- à 390 px, la barre (logo, bouton, menu) tient sur une ligne ;
- le focus clavier est visible sur les boutons et les `summary`.

Corriger en un seul lot (valeurs du bloc CSS Halfred uniquement), refaire une
seule passe de captures, puis s'arrêter. Arrêter le serveur (`kill %1`).

- [ ] **Étape 2 : `CLAUDE.md`**

Dans « Mondes de marque », remplacer la puce qui commence par
`- **Halfred** : pas de design system écrit` par :

```markdown
- **Halfred** : monde « Half-red » depuis le 2026-09-29 (spec
  `docs/superpowers/specs/2026-09-29-halfred-design-system-design.md`). Rouge
  `#d02232`, noir, blanc, jamais d'orange. Chaque composant est coupé net en
  deux, moitié rouge. Le bloc `/* halfred:start */ … /* halfred:end */` de
  `app/globals.css` le porte ; `npm run check:halfred` refuse toute couleur hors
  palette et vérifie le HTML exporté. Les sections vivent dans
  `components/halfred/`.
```

Dans « Conventions », après le paragraphe « Exception au refus des captures
produit », ajouter :

```markdown
- **Exception monde Halfred, décidée le 2026-09-29** : sur `/halfred/` et
  `/en/halfred/` seulement, dégradés de texte (coupure nette « half-red »),
  boutons glossy, police display General Sans, pleine largeur hors `Column`,
  sombre seul, dock et bascule de thème masqués, et une chorégraphie propre
  (allumage de l'horizon du hero). `/halfred/offres/` n'est plus qu'une
  redirection vers `#tarifs`.
```

- [ ] **Étape 3 : `PRODUCT.md`**

Dans « Brand Commitments », sous la puce « Direction visuelle retenue »,
ajouter :

```markdown
- **Direction visuelle de Halfred (2026-09-29) :** monde « Half-red » choisi par
  Paul — Halfred comme Alfred, l'homme à tout faire, et *half red*. Formes
  fluides et lumière rouge sur noir, dans l'esprit des landings IA actuelles.
  Cette direction ne vaut que pour Halfred ; le reste du site garde la sienne.
```

- [ ] **Étape 4 : `DESIGN.md`**

Ajouter à la fin de `DESIGN.md` une section `## Monde Halfred` décrivant **le
rendu construit** (relire le bloc CSS final, pas la spec) : les sept couleurs
et leur rôle, la règle de la moitié et sa déclinaison par composant, General
Sans / Inter, les rayons (pilules, 20 px, 24 px), les halos à la place des
ombres, la chorégraphie unique et son comportement sous
`prefers-reduced-motion`. Si une valeur a changé à l'étape 1, écrire la valeur
finale.

- [ ] **Étape 5 : vérifier et commit**

```bash
npm run lint && npm run build && npm run check:halfred
grep -c a6507cb4 out/index.html
git add CLAUDE.md PRODUCT.md DESIGN.md app/globals.css
git commit -m "Halfred : documentation du monde Half-red, ajustements visuels"
```

Attendu : `check-halfred : OK`, et le `grep` renvoie au moins `1` (contrat de
direction toujours présent dans le HTML).

- [ ] **Étape 6 : remise à Paul**

Ne pas fusionner ni pousser. Donner à Paul : la branche `halfred-world`, les
captures desktop et mobile, et la liste de ce qui reste de son côté (images si
pas encore livrées, composants 21st.dev, clé Web3Forms si le formulaire
n'apparaît pas). La fusion dans `main` déclenche le déploiement : c'est sa
décision.
