import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Routes checked for accessibility regressions. Grows as pages are built.
// Includes a deliberately missing path to exercise the 404 page.
const routes = [
  "/",
  "/story",
  "/risk",
  "/learn",
  "/learn/what-carbon-monoxide-is",
  "/learn/you-cant-smell-it",
  "/learn/symptoms",
  "/learn/what-co-does-to-the-body",
  "/learn/generators-and-storms",
  "/learn/choosing-and-placing-alarms",
  "/learn/if-your-alarm-goes-off",
  "/learn/seasonal-safety",
  "/learn/faq",
  "/data",
  "/data/methodology",
  "/renters",
  "/landlords",
  "/caregivers",
  "/resources",
  "/resources/grants-and-programs",
  "/act",
  "/about",
  "/about/privacy",
  "/about/accessibility",
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
