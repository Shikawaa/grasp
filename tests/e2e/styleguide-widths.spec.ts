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
    await expect(sheets).toHaveCount(18);

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

  const drawOnceSheet = page.locator("[data-component-sheet]").filter({
    has: page.locator("code", { hasText: "DrawOnce" }),
  });
  for (const path of await drawOnceSheet.locator("path").all()) {
    await expect(path).toHaveCSS("stroke-dashoffset", "0px");
  }
});

test("les états interactifs et de données restent distincts", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/styleguide", { waitUntil: "networkidle" });

  const tapeButtonSheet = page.locator("[data-component-sheet]").filter({
    has: page.locator("code", { hasText: "TapeButton" }),
  });
  const restButton = tapeButtonSheet.locator('button[data-state="rest"]');
  const loadingButton = tapeButtonSheet.locator('button[data-state="loading"]');
  const disabledButton = tapeButtonSheet.locator('button[data-state="disabled"]');
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
  await expect(disabledButton).toBeDisabled();
  await expect(disabledButton).toHaveCSS("text-decoration-line", "none");
  await expect(disabledButton).toHaveAccessibleDescription(
    "Choisis un thème pour continuer.",
  );
  await expect(
    tapeButtonSheet.getByText("Choisis un thème pour continuer.", { exact: true }),
  ).toBeVisible();

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
  await expect(weekStripSheet.getByLabel("mardi, fait")).toBeVisible();
  await expect(weekStripSheet.getByLabel("jeudi, aujourd’hui")).toBeVisible();
  const retry = weekStripSheet.getByRole("button", { name: "Réessayer" });
  await expect(retry).toBeVisible();
  await expect(retry).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

  const tallySheet = page.locator("[data-component-sheet]").filter({
    has: page.locator("code", { hasText: "Tally" }),
  });
  const tallies = tallySheet.locator("[data-tally]");
  await expect(tallies.nth(0).locator("line")).toHaveCount(5);
  await expect(tallies.nth(0).locator("line").last()).toHaveAttribute(
    "data-tally-diagonal",
    "true",
  );
  const tallyStrokeStyles = await tallies.nth(0).locator("line").evaluateAll((lines) =>
    lines.map((line) => ({
      stroke: getComputedStyle(line).stroke,
      width: getComputedStyle(line).strokeWidth,
    })),
  );
  expect(new Set(tallyStrokeStyles.map(({ stroke }) => stroke)).size).toBe(1);
  expect(new Set(tallyStrokeStyles.map(({ width }) => width)).size).toBe(1);
  await expect(tallies.nth(1).locator("line")).toHaveCount(8);
  await expect(tallySheet).toContainText("0 réponse sur 9");
});

test("les couleurs et contrôles réservés au guide sont complets", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/styleguide", { waitUntil: "networkidle" });

  const colors = page.locator("[data-theme-color]");
  await expect(colors).toHaveCount(16);
  await expect(page.locator("[data-theme-color-family]")).toHaveCount(6);
  const ratios = await colors.evaluateAll((elements) =>
    elements.map((element) => Number(element.getAttribute("data-contrast-with-ink"))),
  );
  expect(ratios.every((ratio) => ratio >= 4.5)).toBe(true);

  await expect(page.locator("[data-component-sheet] code")).toHaveCount(18);
  const technicalNamesFollowTitles = await page
    .locator("[data-component-sheet] header")
    .evaluateAll((headers) =>
      headers.every((header) => {
        const title = header.querySelector("h3")?.getBoundingClientRect();
        const code = header.querySelector("code")?.getBoundingClientRect();
        return Boolean(title && code && code.top >= title.bottom);
      }),
    );
  expect(technicalNamesFollowTitles).toBe(true);

  const memoryMeters = page.getByRole("img", { name: /Mémoire.*4.*5/ });
  await expect(memoryMeters).toHaveCount(17);
  for (const color of await colors.all()) {
    const meter = color.getByRole("img", { name: /Mémoire.*4.*5/ });
    const segments = meter.locator(":scope > span");
    await expect(segments).toHaveCount(5);
    for (let index = 0; index < 5; index += 1) {
      await expect(segments.nth(index)).toHaveCSS(
        "border-color",
        "rgb(31, 27, 22)",
      );
      await expect(segments.nth(index)).toHaveCSS(
        "border-style",
        index < 4 ? "solid" : "dashed",
      );
    }
  }

  const circleSheet = page.locator("[data-component-sheet]").filter({
    has: page.locator("code", { hasText: "PenCircle" }),
  });
  const circleTextMargins = await circleSheet.locator("[data-pen-circle]").evaluateAll(
    (circles) =>
      circles.map((circle) => {
        const text = circle.querySelector(":scope > span")?.getBoundingClientRect();
        const drawing = circle.querySelector("path")?.getBoundingClientRect();
        if (!text || !drawing) return null;
        return {
          bottom: drawing.bottom - text.bottom,
          left: text.left - drawing.left,
          right: drawing.right - text.right,
          top: text.top - drawing.top,
          variant: circle.getAttribute("data-circle-variant"),
        };
      }),
  );
  expect(circleTextMargins).toHaveLength(4);
  for (const margins of circleTextMargins) {
    expect(margins).not.toBeNull();
    if (!margins) continue;
    const minimumMargin = margins.variant === "round" ? 3 : 12;
    expect(margins.left).toBeGreaterThanOrEqual(minimumMargin);
    expect(margins.right).toBeGreaterThanOrEqual(minimumMargin);
    expect(margins.top).toBeGreaterThanOrEqual(minimumMargin);
    expect(margins.bottom).toBeGreaterThanOrEqual(minimumMargin);
  }
  await expect(circleSheet.getByText("Incompréhensibilité", { exact: true })).toBeVisible();
  await expect(circleSheet.getByText("Épigraphique", { exact: true })).toBeVisible();
  const replayButtons = page.getByRole("button", { name: "Rejouer" });
  await expect(replayButtons).toHaveCount(2);
  await replayButtons.first().click();
  await replayButtons.last().click();
});

test("les libellés accessibles et les pluriels restent complets en anglais", async ({
  page,
}) => {
  await page.context().addCookies([
    { name: "lang", url: "http://127.0.0.1:3100", value: "en" },
  ]);
  await page.setViewportSize({ height: 812, width: 375 });
  await page.goto("/styleguide", { waitUntil: "networkidle" });

  await expect(page.getByLabel("Tuesday, done")).toBeVisible();
  await expect(page.getByLabel("Thursday, today")).toBeVisible();
  await expect(page.locator('[id="styleguide:week-strip:retry"]')).toHaveAccessibleName(
    "Try again",
  );
  await expect(page.getByText("0 answers out of 9", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /Memory.*4.*5/ })).toHaveCount(17);
});
