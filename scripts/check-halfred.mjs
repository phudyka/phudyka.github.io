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
const RGB = new Set([...PALETTE].map((hex) => {
  const h = hex.length === 4 ? hex.slice(1).split("").map((c) => c + c).join("") : hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}));
for (const [, r, g, b] of block.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/g)) {
  assert.ok(RGB.has(`${r} ${g} ${b}`), `couleur hors palette Halfred : rgb(${r} ${g} ${b})`);
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
const LANGS = [
  { route: "halfred/", title: ["Votre entreprise", "moins", "les tâches répétitives"], nav: "Navigation Halfred" },
  { route: "en/halfred/", title: ["Your business", "minus", "the repetitive"], nav: "Halfred navigation" },
];
for (const l of LANGS) {
  const html = page(l.route);
  const text = html.replace(/<!-- -->|<[^>]+>/g, "");
  assert.ok(html.includes('data-brand="halfred"'), `${l.route} : monde Halfred absent`);
  for (const part of l.title) assert.ok(text.includes(part), `${l.route} : titre du hero incomplet (${part})`);
  assert.ok(html.includes(`aria-label="${l.nav}"`), `${l.route} : nav Halfred absente`);
  assert.ok(!html.includes('aria-label="Navigation principale"'), `${l.route} : le dock du hub est encore rendu`);
}
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
for (const route of ["halfred/", "en/halfred/"]) {
  const html = page(route);
  assert.ok(html.includes('id="contact"'), `${route} : footer #contact absent`);
  assert.ok(html.includes("contact.halfred@gmail.com"), `${route} : adresse de contact absente`);
  assert.ok(html.includes("107 717 530"), `${route} : SIREN absent`);
  assert.ok(html.includes('href="https://github.com/phudyka"'), `${route} : lien GitHub absent`);
}
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

// --- Images --------------------------------------------------------------
const imgDir = "public/halfred";
const delivered = existsSync(imgDir) ? readdirSync(imgDir) : [];
const total = delivered.reduce((sum, name) => sum + statSync(path.join(imgDir, name)).size, 0);
assert.ok(total <= 600 * 1024, `images Halfred : ${Math.round(total / 1024)} Ko, budget 600 Ko`);
for (const route of ["halfred/", "en/halfred/"]) {
  const html = page(route);
  for (const [, name] of html.matchAll(/src="\/halfred\/([^"?]+)/g)) {
    assert.ok(delivered.includes(name), `${route} : image /halfred/${name} référencée mais absente`);
  }
  if (delivered.includes("og.jpg")) {
    assert.ok(html.includes("/halfred/og.jpg"), `${route} : og.jpg livrée mais absente des métadonnées`);
  }
}

console.log("check-halfred : OK");
