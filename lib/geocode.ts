// Geocoding via the U.S. Census Bureau batch geocoder (free, no key). Used to
// backfill lat/lng on fire-department resources whose address lives in `notes`.
// Works in Node and on the Workers runtime (FormData/Blob/fetch are available in
// both). Never called at page load — only from the admin geocode connector / the
// offline script.

const CENSUS_BATCH = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";

export type ParsedAddress = { street: string; city: string; state: string; zip: string };

// "1800 Laurel ST, Columbia, SC 29201-2627 · Richland County · Career" →
// { street, city, state, zip }. Returns null when the address can't be parsed
// (that row is simply left ungeocoded — never guessed).
export function parseAddress(notes: string | null | undefined): ParsedAddress | null {
  if (!notes) return null;
  const addr = notes.split(" · ")[0].trim();
  const parts = addr.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 3) return null;
  const street = parts[0];
  const city = parts[parts.length - 2];
  const stateZip = parts[parts.length - 1].split(/\s+/);
  const state = (stateZip[0] || "").toUpperCase();
  const zip = (stateZip[1] || "").slice(0, 5);
  if (!/^[A-Z]{2}$/.test(state) || !/^\d{5}$/.test(zip) || !street || !city) return null;
  return { street, city, state, zip };
}

function csvField(v: string): string {
  return `"${v.replace(/"/g, "")}"`;
}

// One CSV data line → its fields, handling quoted fields with embedded commas.
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQ = !inQ;
    else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

// Geocode a batch (Census allows up to 10,000 per request). Returns a map of
// id → { lat, lng } for the rows that matched. Unmatched rows are omitted.
export async function censusBatchGeocode(
  rows: Array<{ id: string | number } & ParsedAddress>,
): Promise<Map<string, { lat: number; lng: number }>> {
  const result = new Map<string, { lat: number; lng: number }>();
  if (rows.length === 0) return result;

  const csv = rows
    .map((r) => `${r.id},${csvField(r.street)},${csvField(r.city)},${csvField(r.state)},${csvField(r.zip)}`)
    .join("\n");

  const form = new FormData();
  form.append("benchmark", "Public_AR_Current");
  form.append("addressFile", new Blob([csv], { type: "text/csv" }), "addresses.csv");

  const res = await fetch(CENSUS_BATCH, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Census geocoder → HTTP ${res.status}`);
  const text = await res.text();

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const f = splitCsvLine(line);
    // id, input, Match/No_Match, matchType, matchedAddr, "lng,lat", tigerId, side
    if (f[2] !== "Match") continue;
    const [lngStr, latStr] = (f[5] || "").split(",");
    const lng = Number(lngStr);
    const lat = Number(latStr);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      result.set(String(f[0]), { lat, lng });
    }
  }
  return result;
}
