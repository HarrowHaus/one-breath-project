import { defineConfig, devices } from "@playwright/test";

// Accessibility gate. `npm run test:a11y` builds nothing itself — CI runs
// `npm run build` first, then this starts the production server and runs axe
// against it. Any WCAG 2.1 A/AA violation fails the run (see tests/a11y).
export default defineConfig({
  testDir: "./tests/a11y",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // In CI we install a matching browser (`npx playwright install`). Locally
        // (e.g. Claude Code on the web), reuse the preinstalled Chromium whose
        // build may differ from this Playwright version.
        ...(process.env.CI
          ? {}
          : { launchOptions: { executablePath: "/opt/pw-browsers/chromium" } }),
      },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
