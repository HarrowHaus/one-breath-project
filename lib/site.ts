// The canonical public origin, used for metadataBase, the sitemap, robots, and
// Open Graph URLs. Set NEXT_PUBLIC_SITE_URL to your custom domain at launch;
// until then it falls back to the Cloudflare Worker URL. No trailing slash.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://one-breath-project.donald-dcd.workers.dev"
).replace(/\/$/, "");
