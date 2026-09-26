import { expect, test } from "@playwright/test";

const references = [
  { height: 812, width: 375 },
  { height: 1024, width: 768 },
  { height: 900, width: 1440 },
] as const;

for (const viewport of references) {
  test(`référence de la landing à ${viewport.width} px`, async ({ context, page }) => {
    await page.setViewportSize(viewport);
    await context.addCookies([
      {
        domain: "127.0.0.1",
        name: "lang",
        path: "/",
        value: "fr",
      },
    ]);

    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("heading", { name: "Comment ça marche" }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 0));

    await expect(page).toHaveScreenshot(`landing-fr-${viewport.width}.png`, {
      animations: "disabled",
      caret: "hide",
      fullPage: true,
      maxDiffPixels: 0,
      scale: "css",
    });
  });
}
