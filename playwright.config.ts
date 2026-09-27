import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  maxFailures: process.env.PLAYWRIGHT_MAX_FAILURES === "1" ? 1 : 0,
  workers: 1,
  reporter: "list",
  snapshotPathTemplate: "{testDir}/__snapshots__/darwin/{projectName}/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:3100",
    deviceScaleFactor: 1,
    headless: true,
    locale: "fr-FR",
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /landing-webkit\.spec\.ts/,
      use: { browserName: "chromium" },
    },
    {
      name: "webkit-375",
      testMatch: /landing-webkit\.spec\.ts/,
      use: {
        browserName: "webkit",
        viewport: { height: 812, width: 375 },
      },
    },
  ],
  webServer:
    process.env.PLAYWRIGHT_EXTERNAL_SERVER === "1"
      ? undefined
      : {
          command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
          url: "http://127.0.0.1:3100",
          reuseExistingServer: false,
          timeout: 120_000,
        },
});
