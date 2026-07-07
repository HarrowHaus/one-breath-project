// Seeds the national headline figures from /docs/08_DATA_DICTIONARY.md so the
// site shows real, sourced numbers on first build. Idempotent (upsert on the
// per-indicator "latest" row). Run with DATABASE_URL set:
//   node --env-file=.env scripts/seed.mjs        (local)
//   DATABASE_URL=... npm run db:seed             (Neon / Cloudflare)
//
// co_hospitalizations is intentionally NOT seeded — the data dictionary says to
// leave it empty until the CDC Tracking connector supplies it, and the site
// hides that line rather than show a placeholder.
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[seed] DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

const seeds = [
  {
    indicator: "co_deaths",
    geo_id: "US",
    geo_level: "nation",
    value_display: "more than 400",
    value_numeric: 400,
    source: "CDC",
    measured_or_modeled: "Measured",
    notes:
      "Accidental (non-fire) CO poisoning deaths, national. Verify against the current CDC page before launch.",
  },
  {
    indicator: "co_er_visits",
    geo_id: "US",
    geo_level: "nation",
    value_display: "over 100,000",
    value_numeric: 100000,
    source: "CDC",
    measured_or_modeled: "Modeled (national estimate)",
    notes:
      "Emergency-department visits for accidental CO poisoning; national estimate from sampled EDs. Verify against the current CDC page before launch.",
  },
];

const needsSsl = /sslmode=require|neon\.tech|supabase\.co/.test(url);
const client = new pg.Client({
  connectionString: url,
  ssl: needsSsl ? { rejectUnauthorized: true } : undefined,
});

await client.connect();
try {
  for (const s of seeds) {
    await client.query(
      `INSERT INTO metrics
         (indicator, geo_id, geo_level, is_latest, value_display, value_numeric,
          source, measured_or_modeled, notes, retrieved_at, updated_at)
       VALUES ($1,$2,$3,true,$4,$5,$6,$7,$8, now(), now())
       ON CONFLICT (indicator, geo_id) WHERE is_latest
       DO UPDATE SET
         value_display = EXCLUDED.value_display,
         value_numeric = EXCLUDED.value_numeric,
         source = EXCLUDED.source,
         measured_or_modeled = EXCLUDED.measured_or_modeled,
         notes = EXCLUDED.notes,
         updated_at = now()`,
      [
        s.indicator,
        s.geo_id,
        s.geo_level,
        s.value_display,
        s.value_numeric,
        s.source,
        s.measured_or_modeled,
        s.notes,
      ],
    );
    console.log(`[seed] upserted ${s.indicator} (${s.geo_id}) = "${s.value_display}"`);
  }
  console.log("[seed] done.");
} finally {
  await client.end();
}
