import { expect, test } from "@playwright/test";

const references = [
  { height: 812, width: 375 },
  { height: 1024, width: 768 },
  { height: 900, width: 1440 },
] as const;

for (const viewport of references) {
  test(`référence du styleguide à ${viewport.width} px`, async ({ context, page }) => {
    await page.setViewportSize(viewport);
    await context.addCookies([
      {
        domain: "127.0.0.1",
        name: "lang",
        path: "/",
        value: "fr",
      },
    ]);

    await page.goto("/styleguide", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot(`styleguide-fr-${viewport.width}.png`, {
      animations: "disabled",
      caret: "hide",
      fullPage: true,
      maxDiffPixels: 0,
      scale: "css",
    });
  });
}
