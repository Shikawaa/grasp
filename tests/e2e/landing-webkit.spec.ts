import { expect, test } from "@playwright/test";

test("la landing reste structurellement valide dans WebKit à 375 px", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Comment ça marche" })).toBeVisible();

  const widths = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));

  expect(widths.document).toBe(widths.viewport);
  expect(widths.body).toBe(widths.viewport);
});
