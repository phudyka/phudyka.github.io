import { defineConfig, devices } from "@playwright/test";

/**
 * Recette multi-écrans du site exporté (`npm run build` d'abord).
 * WebKit tient lieu de Safari (iPhone, iPad) ; Chromium d'Android et du bureau.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  // Scènes WebGL lourdes : trop de navigateurs en parallèle faussent les captures.
  workers: 4,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:4321", reducedMotion: "reduce" },
  expect: { timeout: 20_000, toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled" } },
  // Journal du serveur coupé : une ligne par fichier servi noyait le résultat des tests.
  webServer: { command: "python3 -m http.server 4321 -d out", url: "http://localhost:4321", reuseExistingServer: true, stdout: "ignore", stderr: "ignore" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "laptop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } },
    { name: "android", use: { ...devices["Pixel 7"] } },
    { name: "iphone", use: { ...devices["iPhone 13"] } },
    { name: "iphone-se", use: { ...devices["iPhone SE"] } },
    { name: "ipad", use: { ...devices["iPad (gen 7)"] } },
    { name: "ipad-landscape", use: { ...devices["iPad (gen 7) landscape"] } },
  ],
});
