import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal OpenNext config for Cloudflare. Phase 2 can add an R2/KV incremental
// cache here when the internal API and ISR come online. For now the defaults
// give us SSR + serverless API routes on the Cloudflare Workers Node runtime.
export default defineCloudflareConfig();
