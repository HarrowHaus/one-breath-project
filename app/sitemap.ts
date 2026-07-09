import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Public routes only — admin, system, and dev-preview pages are excluded.
const ROUTES = [
  "/",
  "/story",
  "/risk",
  "/data",
  "/data/methodology",
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
  "/renters",
  "/landlords",
  "/caregivers",
  "/resources",
  "/resources/grants-and-programs",
  "/act",
  "/about",
  "/about/sources",
  "/about/privacy",
  "/about/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
