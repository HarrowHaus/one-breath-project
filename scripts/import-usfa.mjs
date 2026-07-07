// Imports the USFA National Fire Department Registry CSV into the `resources`
// table (docs/05, Phase 2B). Each department becomes a resource of type
// "fire_department", tagged with its source and retrieval date.
//
//   node scripts/import-usfa.mjs path/to/usfaregistrynational.csv
//   DATABASE_URL=... node scripts/import-usfa.mjs national.csv   (Supabase/prod)
//
// Idempotent: it deletes the previous USFA import first, then reloads.
// Coordinates are not set here — geocoding to lat/lng is a Phase 8 step; the
// address, ZIP, county, and phone loaded here are enough for the resources API.
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import pg from "pg";

// Usage:
//   node scripts/import-usfa.mjs <national.csv>                 → load into DATABASE_URL
//   node scripts/import-usfa.mjs <national.csv> --out res.csv   → write a
//     resources-shaped CSV for Supabase dashboard import (no DB needed)
const SOURCE = "USFA National Fire Department Registry";
const csvPath = process.argv[2];
const outFlagIdx = process.argv.indexOf("--out");
const outCsv = outFlagIdx !== -1 ? process.argv[outFlagIdx + 1] : null;
const url = process.env.DATABASE_URL;

if (!csvPath) {
  console.error("Usage: node scripts/import-usfa.mjs <national-registry.csv> [--out out.csv]");
  process.exit(1);
}
if (!outCsv && !url) {
  console.error("[import-usfa] Set DATABASE_URL (to load) or pass --out (to export a CSV).");
  process.exit(1);
}

function clean(v) {
  const s = (v ?? "").toString().trim();
  return s === "" ? null : s;
}

// Build a human-readable location/notes line from the parts that exist.
function buildNotes(r) {
  const street = clean(r["HQ addr1"]);
  const city = clean(r["HQ city"]);
  const state = clean(r["HQ state"]);
  const zip = clean(r["HQ zip"]);
  const county = clean(r["County"]);
  const deptType = clean(r["Dept Type"]);

  const cityLine = [city, [state, zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const parts = [
    [street, cityLine].filter(Boolean).join(", "),
    county ? `${county} County` : null,
    deptType,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

// NB: no `trim` option — it mis-parses this file's quoted fields. Values are
// trimmed per-field in clean() instead. skip_records_with_error drops the rare
// malformed row (2 of ~27,117) rather than aborting the whole import.
const records = parse(readFileSync(csvPath), {
  columns: (header) => header.map((h) => h.trim()),
  bom: true,
  skip_empty_lines: true,
  relax_column_count: true,
  skip_records_with_error: true,
});

const rows = [];
for (const r of records) {
  const name = clean(r["Fire dept name"]);
  if (!name) continue; // skip malformed rows
  rows.push({
    type: "fire_department",
    name,
    geo_id: clean(r["HQ state"]),
    phone: clean(r["HQ phone"]),
    url: clean(r["Website"]),
    notes: buildNotes(r),
    source: SOURCE,
  });
}

console.log(`[import-usfa] parsed ${rows.length} departments from ${csvPath}`);

// --- CSV export mode: write a resources-shaped file for dashboard import ---
if (outCsv) {
  const cols = ["type", "name", "geo_id", "phone", "url", "notes", "source", "verified_at"];
  const now = new Date().toISOString();
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.join(",")];
  for (const r of rows) {
    lines.push(
      [r.type, r.name, r.geo_id, r.phone, r.url, r.notes, r.source, now].map(esc).join(","),
    );
  }
  writeFileSync(outCsv, lines.join("\n") + "\n");
  console.log(`[import-usfa] wrote ${rows.length} rows → ${outCsv}`);
  process.exit(0);
}

// --- DB load mode ---
const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);
const client = new pg.Client({
  connectionString: url,
  ssl: isLocal ? undefined : { rejectUnauthorized: true },
});

await client.connect();
try {
  await client.query("BEGIN");
  const del = await client.query("DELETE FROM resources WHERE source = $1", [SOURCE]);
  console.log(`[import-usfa] cleared ${del.rowCount} previous USFA rows`);

  const BATCH = 1000;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const values = [];
    const params = [];
    batch.forEach((row, j) => {
      const b = j * 7;
      values.push(
        `($${b + 1},$${b + 2},$${b + 3},$${b + 4},$${b + 5},$${b + 6},$${b + 7},now())`,
      );
      params.push(row.type, row.name, row.geo_id, row.phone, row.url, row.notes, row.source);
    });
    await client.query(
      `INSERT INTO resources (type, name, geo_id, phone, url, notes, source, verified_at)
       VALUES ${values.join(",")}`,
      params,
    );
    inserted += batch.length;
  }
  await client.query("COMMIT");
  console.log(`[import-usfa] inserted ${inserted} fire departments. Done.`);
} catch (err) {
  await client.query("ROLLBACK");
  console.error("[import-usfa] failed, rolled back:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
