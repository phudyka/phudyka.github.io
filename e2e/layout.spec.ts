import { expect, test } from "@playwright/test";

const PAGES = ["/halfred/", "/en/halfred/", "/halfred/offres/", "/en/halfred/offres/"];

for (const path of PAGES) {
  test(`${path} tient dans l'écran`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(path, { waitUntil: "networkidle" });

    // Aucun défilement horizontal, aucun élément visible qui déborde de l'écran.
    const overflow = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll<HTMLElement>("main *")]
        .filter((el) => {
          const r = el.getBoundingClientRect(), s = getComputedStyle(el);
          if (!r.width || s.visibility === "hidden" || s.position === "fixed") return false;
          if (r.right <= w + 1 && r.left >= -1) return false;
          // Débord rogné par un parent (carrousel, décor coupé net) : invisible, donc permis.
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const o = getComputedStyle(p);
            if (/hidden|clip|auto|scroll/.test(o.overflowX + o.overflow)) {
              const q = p.getBoundingClientRect();
              if (q.right <= w + 1 && q.left >= -1) return false;
            }
          }
          return !el.closest("svg, canvas");
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
      return { scroll: document.documentElement.scrollWidth - w, wide };
    });
    expect(overflow.scroll, "défilement horizontal (px)").toBeLessThanOrEqual(0);
    expect(overflow.wide, "éléments qui débordent").toEqual([]);
    expect(errors, "erreurs JavaScript").toEqual([]);
  });

  test(`${path} capture`, async ({ page }) => {
    test.setTimeout(120_000);
    const slug = path.replaceAll("/", "-").replace(/^-|-$/g, "");
    // Robot 3D non chargé : son rendu continu bloque la capture et ne se compare pas.
    await page.route(/\.splinecode$/, (r) => r.abort());
    await page.goto(path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Une capture par section, à la taille de l'écran : c'est ce que le visiteur voit.
    // Les scènes 3D (robot, boîtier) varient d'une image à l'autre et bloquent la capture : cachées.
    const sections = page.locator("main > section, main section.hr-section");
    const n = await sections.count();
    for (let i = 0; i < n; i++) {
      await sections.nth(i).evaluate((el) => el.scrollIntoView({ block: "start" }));
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => Promise.race([
        Promise.all([...document.images].filter((im) => im.complete).map((im) => im.decode().catch(() => {}))),
        new Promise((r) => setTimeout(r, 2000)),
      ]));
      await page.waitForTimeout(400);
      await expect(page).toHaveScreenshot(`${slug}-${i}.png`, { stylePath: "e2e/capture.css" });
    }
  });
}
