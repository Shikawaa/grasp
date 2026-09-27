import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 667 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 400, height: 900 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1023, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
  { width: 2560, height: 1440 },
] as const;

for (const viewport of viewports) {
  test(`la landing ne déborde pas à ${viewport.width} px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.context().addCookies([
      {
        name: "lang",
        value: "fr",
        domain: "127.0.0.1",
        path: "/",
      },
    ]);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const widths = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));

    expect(widths.document).toBe(widths.viewport);
    expect(widths.body).toBe(widths.viewport);

    if ([375, 768, 1440].includes(viewport.width)) {
      const rearHighlight = page.getByTestId("hero-card-back").locator("[data-highlight]");
      const frontCard = page.getByTestId("hero-card-front");
      const [highlightBox, frontBox] = await Promise.all([
        rearHighlight.boundingBox(),
        frontCard.boundingBox(),
      ]);

      expect(highlightBox).not.toBeNull();
      expect(frontBox).not.toBeNull();
      expect(highlightBox!.y + highlightBox!.height).toBeLessThanOrEqual(frontBox!.y);

      const frenchText = await page.locator("body").textContent();
      expect(frenchText).toContain("et\u00A0tu");
      expect(frenchText).toContain("3\u00A0minutes");
      expect(frenchText).toContain("2\u00A0sur 4");
      expect(frenchText).toContain("200\u00A0ans");
      expect(frenchText).toContain("8\u00A0cartes");
    }

    if (viewport.width === 1440) {
      const [heroBox, headerLogoBox, footerLogoBox] = await Promise.all([
        page.getByTestId("welcome-hero").boundingBox(),
        page.getByRole("img", { name: "grasp" }).first().boundingBox(),
        page.getByRole("img", { name: "grasp" }).last().boundingBox(),
      ]);

      expect(heroBox?.height).toBeLessThan(viewport.height);
      expect(heroBox?.height).toBe(652);
      expect(headerLogoBox?.width).toBeCloseTo(footerLogoBox?.width ?? 0, 1);
      expect(headerLogoBox?.height).toBeCloseTo(footerLogoBox?.height ?? 0, 1);
    }

    if (viewport.width === 768) {
      const heroBox = await page.getByTestId("welcome-hero").boundingBox();
      expect(heroBox?.height).toBeLessThan(viewport.height);
    }

    const scrollAnnotation = page.getByTestId("scroll-annotation");
    await expect(scrollAnnotation).toHaveAttribute("aria-hidden", "true");
    if (viewport.width >= 1024) {
      await expect(scrollAnnotation).toBeVisible();
    } else {
      await expect(scrollAnnotation).toBeHidden();
    }

    if (viewport.width === 320 || viewport.width === 2560) {
      const rootFontSize = await page.evaluate(() =>
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
      );
      expect(rootFontSize).toBe(viewport.width === 320 ? 16 : 22);
    }

    const { arrowWidth, rootFontSize } = await page
      .getByTestId("welcome-callout")
      .locator("[data-hand-arrow]")
      .evaluate((element) => ({
        arrowWidth: element.getBoundingClientRect().width,
        rootFontSize: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
      }));
    expect(arrowWidth / rootFontSize).toBeLessThanOrEqual(3);

    await page.context().addCookies([
      {
        name: "lang",
        value: "en",
        domain: "127.0.0.1",
        path: "/",
      },
    ]);
    await page.reload();
    await page.evaluate(() => document.fonts.ready);

    const englishWidths = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(englishWidths.document).toBe(englishWidths.viewport);
    expect(englishWidths.body).toBe(englishWidths.viewport);

    if ([375, 768, 1440].includes(viewport.width)) {
      const englishText = await page.locator("body").textContent();
      expect(englishText).toContain("2\u00A0of 4");
      expect(englishText).toContain("200\u00A0years");
      expect(englishText).toContain("8\u00A0cards");
    }
  });
}

test("la landing reste lisible sans JavaScript et force le mode clair", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3100",
    colorScheme: "dark",
    javaScriptEnabled: false,
    locale: "fr-FR",
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Comment ça marche" })).toBeVisible();
  expect(
    await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
  ).toBe("light");

  await context.close();
});

test("les polices de secours ne créent ni débordement ni chevauchement", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3100",
    locale: "fr-FR",
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.route("**/*", async (route) => {
    const isFont = /\.(woff2?|ttf)(\?|$)/.test(route.request().url());
    if (isFont) await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const beforeFonts = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>("h1")?.getBoundingClientRect();
    const description = document
      .querySelector<HTMLElement>('[data-testid="welcome-description"]')
      ?.getBoundingClientRect();
    const logo = document.querySelector<HTMLElement>("header img")?.getBoundingClientRect();
    const actions = document.querySelector<HTMLElement>("header nav")?.getBoundingClientRect();

    return {
      bodyWidth: document.body.scrollWidth,
      descriptionTop: description?.top ?? 0,
      documentWidth: document.documentElement.scrollWidth,
      headerGap: (actions?.left ?? 0) - (logo?.right ?? 0),
      titleBottom: title?.bottom ?? 0,
      viewportWidth: window.innerWidth,
    };
  });

  expect(beforeFonts.documentWidth).toBe(beforeFonts.viewportWidth);
  expect(beforeFonts.bodyWidth).toBe(beforeFonts.viewportWidth);
  expect(beforeFonts.headerGap).toBeGreaterThanOrEqual(0);
  expect(beforeFonts.titleBottom).toBeLessThanOrEqual(beforeFonts.descriptionTop);

  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBe(375);

  await context.close();
});

test("la landing ne déborde pas en paysage", async ({ page }) => {
  const landscapeViewports = [
    { width: 667, height: 320 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
  ] as const;

  for (const viewport of landscapeViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(viewport.width);
  }
});
