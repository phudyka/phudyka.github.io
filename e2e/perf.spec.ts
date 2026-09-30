import { expect, test } from "@playwright/test";

// Perfs mesurées sous Chromium seul (CDP). Sur les profils mobiles, processeur
// ralenti 4× : un téléphone moyen, pas un PC de développeur.
test.use({ reducedMotion: "no-preference" });

test("/halfred/ reste fluide", async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== "chromium", "mesures via CDP");
  test.setTimeout(90_000);
  const cdp = await page.context().newCDPSession(page);
  if (isMobile) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number; __long: number[] };
    w.__cls = 0; w.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) w.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) w.__long.push(e.duration); }).observe({ type: "longtask" });
  });
  await page.goto("/halfred/", { waitUntil: "networkidle" });
  const load = await page.evaluate(async () => {
    const lcp = await new Promise<number>((r) => {
      new PerformanceObserver((l) => { const e = l.getEntries(); r(e[e.length - 1].startTime); }).observe({ type: "largest-contentful-paint", buffered: true });
      setTimeout(() => r(-1), 10_000);
    });
    return { lcp: Math.round(lcp), cls: +(window as unknown as { __cls: number }).__cls.toFixed(3) };
  });

  // Animation du schéma : étape 1 complète (nuage, pose des icônes, câbles).
  await page.locator("#principe").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const anim = await page.evaluate(async () => {
    const w = window as unknown as { __long: number[] };
    w.__long = [];
    const gaps: number[] = [];
    let last = 0, run = true;
    const tick = (t: number) => { if (last) gaps.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    document.getElementById("principe")!.dispatchEvent(new CustomEvent("hr-step", { detail: 1, cancelable: true }));
    await new Promise((r) => setTimeout(r, 9000));
    run = false;
    gaps.sort((a, b) => a - b);
    const p = (q: number) => Math.round(gaps[Math.floor(gaps.length * q)]);
    return {
      fps: Math.round(1000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length)),
      p95: p(0.95),
      jank: +(gaps.filter((g) => g > 50).length / gaps.length).toFixed(3),
      tbt: Math.round(w.__long.reduce((a, d) => a + Math.max(0, d - 50), 0)),
    };
  });

  const report = { ...load, ...anim };
  test.info().annotations.push({ type: "perf", description: JSON.stringify(report) });
  console.log(test.info().project.name, JSON.stringify(report));
  expect(report.lcp, "LCP (ms)").toBeGreaterThan(0);
  expect(report.lcp, "LCP (ms)").toBeLessThan(isMobile ? 4000 : 2500);
  expect(report.cls, "CLS").toBeLessThan(0.1);
  // Seuils calés sur le rendu logiciel du navigateur sans écran (pas de GPU) : un
  // vrai appareil fait mieux. Ils servent à attraper une régression, pas à noter le site.
  expect(report.fps, "images/s moyennes pendant l'animation").toBeGreaterThanOrEqual(isMobile ? 30 : 45);
  expect(report.jank, "part d'images > 50 ms").toBeLessThan(0.1);
  expect(report.tbt, "temps bloquant pendant l'animation (ms)").toBeLessThan(isMobile ? 600 : 200);
});
