import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Postgres access for both local dev and Cloudflare Workers.
//
// On Workers we go through a Cloudflare Hyperdrive binding: Hyperdrive pools
// connections and handles the socket/TLS to Supabase, which raw node-postgres
// on the Workers runtime does not do reliably (it fails the TLS handshake with
// "Connection terminated unexpectedly"). Locally we connect straight to
// DATABASE_URL. Either way the site reads ONLY from our internal API, which
// reads from this database — never from an upstream source at page load.

export type DB = NodePgDatabase<typeof schema>;

let pool: Pool | undefined;
let db: DB | undefined;

type HyperdriveEnv = { HYPERDRIVE?: { connectionString?: string } };

function resolveConnection(): { url?: string; viaHyperdrive: boolean } {
  // Prefer the Hyperdrive binding when running on Workers. getCloudflareContext
  // throws off-Workers (and when no context is active), so guard it.
  try {
    const env = getCloudflareContext()?.env as HyperdriveEnv | undefined;
    const hd = env?.HYPERDRIVE?.connectionString;
    if (hd) return { url: hd, viaHyperdrive: true };
  } catch {
    // Not on Workers / no binding — fall through to DATABASE_URL.
  }
  return { url: process.env.DATABASE_URL, viaHyperdrive: false };
}

// Returns a Drizzle client, or null when no connection is configured. Null is a
// valid state: the API then reports "no data" and the site hides that line
// rather than ever showing a placeholder number (honesty non-negotiable).
export function getDb(): DB | null {
  if (db) return db;

  const { url, viaHyperdrive } = resolveConnection();
  if (!url) return null;

  const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);

  pool = new Pool({
    connectionString: url,
    // Through Hyperdrive the app→Hyperdrive hop is local (Hyperdrive terminates
    // TLS to the origin); a direct local Postgres needs no TLS either.
    ssl: viaHyperdrive || isLocal ? undefined : { rejectUnauthorized: true },
    max: 5,
  });
  db = drizzle(pool, { schema });
  return db;
}

export { schema };
