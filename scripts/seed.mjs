// Seeds the NATIONAL headline figures — the numbers the harm pyramid and the
// landing scale band show. Idempotent (upsert on the per-indicator "latest"
// row). Run with DATABASE_URL set:
//   node --env-file=.env scripts/seed.mjs        (local)
//   DATABASE_URL=... npm run db:seed             (Neon / Cloudflare / Supabase)
//
// Sourcing strategy (two layers — see /docs/08_DATA_DICTIONARY.md):
//   • NATIONAL headline figures (these three) come from a published national
//     estimate: Sircar et al., "National unintentional carbon monoxide
//     poisoning estimates using hospitalization and emergency department data,"
//     Am J Emerg Med (2019), CDC authors, using HCUP NIS (hospitalizations,
//     2003–2013), HCUP NEDS (ED visits, 2007–2013), and NVSS (deaths, annual
//     average). https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/
//   • SUB-NATIONAL granularity (the state-by-year explorer) comes from CDC
//     Tracking. We NEVER sum suppressed sub-national data into a national total,
//     so the national headline is this published estimate, not a sum of states.
//
// Each figure carries its estimate PERIOD in the tag and notes, so it is never
// read as a current-year measured count.
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[seed] DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

const CITE =
  "Sircar et al. 2019, Am J Emerg Med. https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/";

const seeds = [
  {
    indicator: "co_deaths",
    geo_id: "US",
    geo_level: "nation",
    value_display: "at least 430",
    value_numeric: 430,
    source: "Sircar et al. 2019 (Am J Emerg Med); NVSS",
    measured_or_modeled: "Measured (annual average, NVSS)",
    notes: `National annual-average unintentional (non-fire) CO poisoning deaths, NVSS. ${CITE}`,
  },
  {
    indicator: "co_er_visits",
    geo_id: "US",
    geo_level: "nation",
    value_display: "about 101,847",
    value_numeric: 101847,
    source: "Sircar et al. 2019 (Am J Emerg Med); HCUP NEDS",
    measured_or_modeled: "Modeled (national estimate, 2007–2013)",
    notes: `National estimate of emergency-department visits for unintentional CO poisoning, HCUP Nationwide Emergency Department Sample 2007–2013. ${CITE}`,
  },
  {
    indicator: "co_hospitalizations",
    geo_id: "US",
    geo_level: "nation",
    value_display: "about 14,365",
    value_numeric: 14365,
    source: "Sircar et al. 2019 (Am J Emerg Med); HCUP NIS",
    measured_or_modeled: "Modeled (national estimate, 2003–2013)",
    notes: `National estimate of hospitalizations for unintentional CO poisoning, HCUP National Inpatient Sample 2003–2013. ${CITE}`,
  },
];

const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);
const client = new pg.Client({
  connectionString: url,
  ssl: isLocal ? undefined : { rejectUnauthorized: true },
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
