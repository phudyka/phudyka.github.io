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

console.log("check-halfred : OK");
