import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Routes checked for accessibility regressions. Grows as pages are built.
// Includes a deliberately missing path to exercise the 404 page.
const routes = [
  "/",
  "/story",
  "/risk",
  "/data",
  "/data/methodology",
  "/renters",
  "/landlords",
  "/caregivers",
  "/thank-you",
  "/styleguide",
  "/this-path-does-not-exist",
];

for (const path of routes) {
  test(`no WCAG 2.1 A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Surface any violation IDs in the failure message for quick triage.
    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
}
