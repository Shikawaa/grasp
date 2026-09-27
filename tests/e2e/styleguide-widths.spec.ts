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

test("les états interactifs et de données restent distincts", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/styleguide", { waitUntil: "networkidle" });

  const tapeButtonSheet = page.locator("[data-component-sheet]").filter({
    has: page.locator("code", { hasText: "TapeButton" }),
  });
  const restButton = tapeButtonSheet.locator('button[data-state="rest"]');
  const loadingButton = tapeButtonSheet.locator('button[data-state="loading"]');
  const buttonMetrics = await Promise.all(
    [restButton, loadingButton].map((locator) =>
      locator.evaluate((element) => {
        return {
          background: getComputedStyle(element, "::before").backgroundColor,
          height: (element as HTMLElement).offsetHeight,
          width: (element as HTMLElement).offsetWidth,
        };
      }),
    ),
  );
  expect(buttonMetrics[1]).toEqual(buttonMetrics[0]);
  await expect(loadingButton.locator('[role="status"]')).toHaveCount(1);

  const buttonFocus = tapeButtonSheet.locator('button[data-state="focus"]');
  await expect(buttonFocus).toHaveCSS("outline-color", "rgb(31, 27, 22)");
  await expect(buttonFocus).toHaveCSS("outline-style", "dashed");
  await expect(buttonFocus).toHaveCSS("outline-width", "2px");

  const checkBoxSheet = page.locator("[data-component-sheet]").filter({
    has: page.locator("code", { hasText: "CheckBox" }),
  });
  const emptyHover = checkBoxSheet.locator(
    'button[aria-checked="false"][data-state="hover"]',
  );
  const checkedHover = checkBoxSheet.locator(
    'button[aria-checked="true"][data-state="hover"]',
  );
  await expect(emptyHover.locator("svg")).toHaveCount(0);
  await expect(checkedHover.locator("svg")).toHaveCount(1);

  const checkBoxFocus = checkBoxSheet.locator(
    'button[aria-checked="false"][data-state="focus"]',
  );
  await expect(checkBoxFocus).toHaveCSS("outline-color", "rgb(31, 27, 22)");
  await expect(checkBoxFocus).toHaveCSS("outline-style", "dashed");
  await expect(checkBoxFocus).toHaveCSS("outline-width", "2px");

  const weekStripSheet = page.locator("[data-component-sheet]").filter({
    has: page.locator("code", { hasText: "WeekStrip" }),
  });
  await expect(weekStripSheet.locator("[data-highlight]")).toHaveCount(4);
  await expect(weekStripSheet).toContainText("4 sur 7 cette semaine");
  await expect(weekStripSheet.getByRole("button", { name: "Réessayer" })).toBeVisible();
});

test("les couleurs et contrôles réservés au guide sont complets", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/styleguide", { waitUntil: "networkidle" });

  const colors = page.locator("[data-theme-color]");
  await expect(colors).toHaveCount(16);
  const ratios = await colors.evaluateAll((elements) =>
    elements.map((element) => Number(element.getAttribute("data-contrast-with-ink"))),
  );
  expect(ratios.every((ratio) => ratio >= 4.5)).toBe(true);

  await expect(page.locator("[data-component-sheet] code")).toHaveCount(17);
  const replayButtons = page.getByRole("button", { name: "Rejouer" });
  await expect(replayButtons).toHaveCount(2);
  await replayButtons.first().click();
  await replayButtons.last().click();
});
