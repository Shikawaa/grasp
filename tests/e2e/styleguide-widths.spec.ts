import { expect, test } from "@playwright/test";

const viewports = [
  { columns: 1, height: 812, width: 375 },
  { columns: 2, height: 1024, width: 768 },
  { columns: 3, height: 900, width: 1440 },
] as const;

for (const viewport of viewports) {
  test(`le styleguide reste lisible à ${viewport.width} px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/styleguide", { waitUntil: "networkidle" });

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);

    const sheets = page.locator("[data-component-sheet]");
    await expect(sheets).toHaveCount(17);

    const firstRowTops = await sheets.evaluateAll((elements, columns) =>
      elements.slice(0, columns).map((element) => element.getBoundingClientRect().top),
      viewport.columns,
    );
    expect(new Set(firstRowTops).size).toBe(1);

    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
    await expect(robots).toHaveAttribute("content", /nofollow/);
  });
}

test("le chargement dessiné devient statique en mouvement réduit", async ({ page }) => {
  await page.setViewportSize({ height: 812, width: 375 });
  await page.goto("/styleguide", { waitUntil: "networkidle" });

  const loadingPath = page.locator('[role="status"] path').first();
  await expect(loadingPath).toHaveCSS("animation-name", "none");
});
