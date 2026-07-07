import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Single Postgres driver (node-postgres) for both local dev and production.
// Production points DATABASE_URL at Neon (SSL); local points at a local Postgres.
// On Cloudflare Workers this runs under the nodejs_compat flag.
//
// The site reads ONLY from our internal API, which reads from this database —
// never from an upstream/government source at page load (docs/05).

export type DB = NodePgDatabase<typeof schema>;

let pool: Pool | undefined;
let db: DB | undefined;

// Returns a Drizzle client, or null when DATABASE_URL is unset. Null is a valid
// state: the API then reports "no data" and the site hides that line rather than
// ever showing a placeholder number (honesty non-negotiable).
export function getDb(): DB | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (db) return db;

  // Managed providers (Neon, Supabase, etc.) require SSL; a local Postgres does
  // not. Anything not pointed at localhost is treated as managed.
  const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);

  pool = new Pool({
    connectionString: url,
    ssl: isLocal ? undefined : { rejectUnauthorized: true },
    max: 3,
  });
  db = drizzle(pool, { schema });
  return db;
}

export { schema };
