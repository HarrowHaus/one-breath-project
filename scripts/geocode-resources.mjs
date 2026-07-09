// Bulk-geocode fire-department resources via the free U.S. Census batch geocoder.
// Fills lat/lng from the address stored in `notes`, and marks every attempted row
// so unresolved addresses don't recycle. Resumable — run again to continue.
//
//   DATABASE_URL=<prod> node scripts/geocode-resources.mjs
//
// The admin "Geocode fire departments" button does the same thing one batch at a
// time; this script drains the whole table in one run.
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[geocode] DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

const BATCH = 1000; // Census allows up to 10,000; 1k keeps requests quick.
const CENSUS = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";

function parseAddress(notes) {
  if (!notes) return null;
  const addr = String(notes).split(" · ")[0].trim();
  const parts = addr.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 3) return null;
  const street = parts[0];
  const city = parts[parts.length - 2];
  const sz = parts[parts.length - 1].split(/\s+/);
  const state = (sz[0] || "").toUpperCase();
  const zip = (sz[1] || "").slice(0, 5);
  if (!/^[A-Z]{2}$/.test(state) || !/^\d{5}$/.test(zip) || !street || !city) return null;
  return { street, city, state, zip };
}

function splitCsvLine(line) {
  const out = [];
  let cur = "", inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (ch === "," && !inQ) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

async function geocode(rows) {
  const csv = rows
    .map((r) => `${r.id},"${r.street.replace(/"/g, "")}","${r.city.replace(/"/g, "")}","${r.state}","${r.zip}"`)
    .join("\n");
  const form = new FormData();
  form.append("benchmark", "Public_AR_Current");
  form.append("addressFile", new Blob([csv], { type: "text/csv" }), "a.csv");
  const res = await fetch(CENSUS, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Census HTTP ${res.status}`);
  const text = await res.text();
  const out = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const f = splitCsvLine(line);
    if (f[2] !== "Match") continue;
    const [lng, lat] = (f[5] || "").split(",").map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) out.set(String(f[0]), { lat, lng });
  }
  return out;
}

const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);
const client = new pg.Client({ connectionString: url, ssl: isLocal ? undefined : { rejectUnauthorized: true } });
await client.connect();

let totalMatched = 0, totalSeen = 0;
try {
  for (;;) {
    const { rows } = await client.query(
      `SELECT id, notes FROM resources
       WHERE type='fire_department' AND lat IS NULL AND geocode_attempted_at IS NULL AND notes IS NOT NULL
       ORDER BY id LIMIT $1`,
      [BATCH],
    );
    if (rows.length === 0) break;

    const toGeo = rows
      .map((r) => { const a = parseAddress(r.notes); return a ? { id: r.id, ...a } : null; })
      .filter(Boolean);

    const coords = toGeo.length ? await geocode(toGeo) : new Map();
    if (coords.size) {
      const values = [...coords.entries()].map(([id, c]) => `(${Number(id)}, ${c.lat}, ${c.lng})`).join(",");
      await client.query(
        `UPDATE resources AS r SET lat=v.lat, lng=v.lng FROM (VALUES ${values}) AS v(id,lat,lng) WHERE r.id=v.id`,
      );
    }
    await client.query(`UPDATE resources SET geocode_attempted_at=now() WHERE id = ANY($1)`, [rows.map((r) => r.id)]);

    totalMatched += coords.size;
    totalSeen += rows.length;
    console.log(`[geocode] batch: ${coords.size}/${rows.length} matched · total ${totalMatched}/${totalSeen}`);
  }
  console.log(`[geocode] done. Matched ${totalMatched} of ${totalSeen} attempted.`);
} finally {
  await client.end();
}
