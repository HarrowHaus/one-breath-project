// Data connectors (Phase 2B). Each connector fetches from an external source
// (only reachable from Cloudflare's network, not local dev), normalizes to our
// `metrics` schema, and upserts — tagging every figure Measured/Modeled with its
// source and retrieval date (docs/05, honesty non-negotiable).
//
// IMPORTANT: the exact request shapes (CDC Tracking measure IDs, NEISS params)
// must be confirmed against each source's CURRENT official API before the
// connector will emit data. Connectors that aren't fully configured throw a
// clear "not configured" error rather than invent numbers.
import {
  geocodeFireDepartmentsBatch,
  upsertYearMetric,
  upsertYearMetricsBulk,
  type YearMetricInput,
} from "@/lib/db/queries";

export type ConnectorResult = {
  source: string;
  upserted: number;
  notes: string[];
};

export type Connector = {
  name: string;
  label: string;
  run: () => Promise<ConnectorResult>;
};

class NotConfiguredError extends Error {}

// ---------------------------------------------------------------------------
// EPA AirNow — OUTDOOR ambient air quality. Contextual ONLY: outdoor ambient CO
// is NOT indoor poisoning risk, and is flagged as such. AirNow's current-
// observation endpoint returns criteria pollutants (often O3/PM); CO is sparse.
// We store any CO reading under a clearly non-poisoning indicator that the site
// does not surface as a risk figure.
// ---------------------------------------------------------------------------
async function runAirNow(): Promise<ConnectorResult> {
  const key = process.env.AIRNOW_API_KEY;
  if (!key) throw new NotConfiguredError("AIRNOW_API_KEY is not set.");

  const notes: string[] = [];
  // Reporting areas to sample (extend as needed). Contextual sampling only.
  const areas = [
    { label: "Columbia, SC", lat: 34.0, lng: -81.03 },
    { label: "Washington, DC", lat: 38.9, lng: -77.03 },
  ];

  let upserted = 0;
  const year = new Date().getUTCFullYear();
  for (const area of areas) {
    const url =
      `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json` +
      `&latitude=${area.lat}&longitude=${area.lng}&distance=50&API_KEY=${key}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      notes.push(`${area.label}: HTTP ${res.status}`);
      continue;
    }
    const obs = (await res.json()) as Array<{
      ParameterName?: string;
      AQI?: number;
      ReportingArea?: string;
      StateCode?: string;
    }>;
    const co = obs.find((o) => (o.ParameterName ?? "").toUpperCase() === "CO");
    if (!co || typeof co.AQI !== "number") {
      notes.push(`${area.label}: no CO observation reported`);
      continue;
    }
    await upsertYearMetric({
      indicator: "outdoor_ambient_co", // NOT a poisoning indicator; not shown as risk
      geo: co.StateCode ?? area.label,
      geoLevel: "point",
      year,
      valueNumeric: co.AQI,
      valueDisplay: `AQI ${co.AQI}`,
      source: "EPA AirNow",
      measuredOrModeled: "Measured",
      notes: "Outdoor ambient CO (AQI) — CONTEXTUAL ONLY, not indoor poisoning risk.",
    });
    upserted++;
  }
  notes.unshift("Outdoor ambient CO is contextual only — never shown as indoor risk.");
  return { source: "EPA AirNow", upserted, notes };
}

// ---------------------------------------------------------------------------
// CDC Environmental Public Health Tracking Network — unintentional CO ED visits,
// hospitalizations, and mortality by state and year.
//
// Verified live (2026-07) against the Tracking Network Data API: content area 2
// ("Unintentional Carbon Monoxide (CO) Poisoning"), the three annual-COUNT
// measures below, resolved through the documented call chain used by CDC's own
// EPHTrackR package: geographicTypes → stratificationlevel → temporalItems →
// geographicItems → POST getCoreHolder. Suppressed cells (CDC privacy rules) are
// dropped, never guessed. Every figure is tagged Measured with its source and
// year. National totals are NOT summed from states (some states are suppressed,
// so a sum would understate) — the national headline stays the sourced seed.
// ---------------------------------------------------------------------------
const CDC_API = "https://ephtracking.cdc.gov/apigateway/api/v1";
const CDC_SOURCE = "CDC Environmental Public Health Tracking Network";

const CDC_TRACKING_MEASURES: Array<{
  measureId: number;
  indicator: string;
  tag: string;
  note: string;
}> = [
  {
    measureId: 117,
    indicator: "co_hospitalizations",
    tag: "Measured",
    note: "Annual number of hospitalizations for unintentional CO poisoning (CDC Tracking).",
  },
  {
    measureId: 120,
    indicator: "co_er_visits",
    tag: "Measured",
    note: "Annual number of emergency department visits for unintentional CO poisoning (CDC Tracking).",
  },
  {
    measureId: 573,
    indicator: "co_deaths",
    tag: "Measured",
    note: "Average annual number of deaths from unintentional CO poisoning over a 5-year period (CDC Tracking).",
  },
];

// The Tracking API returns HTTP 200 even for errors, carrying a { code, message }
// envelope; and it throttles unauthenticated bursts (429). Detect both, and back
// off briefly on 429. An optional CDC_TRACKING_TOKEN lifts the rate limit.
async function cdcApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.CDC_TRACKING_TOKEN;
  const sep = path.includes("?") ? "&" : "?";
  const url = `${CDC_API}/${path}${token ? `${sep}apiToken=${token}` : ""}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    });
    const data = (await res.json()) as unknown;
    const code =
      data && typeof data === "object" && "code" in data
        ? (data as { code?: number }).code
        : undefined;
    if (code === 429) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      continue;
    }
    if (!res.ok || (code != null && code >= 400)) {
      const msg =
        data && typeof data === "object" && "message" in data
          ? (data as { message?: string }).message
          : `HTTP ${res.status}`;
      throw new Error(`CDC ${path} → ${code ?? res.status} ${msg ?? ""}`.trim());
    }
    return data as T;
  }
  throw new Error(`CDC ${path} → rate limited after retries (set CDC_TRACKING_TOKEN)`);
}

type CdcGeoType = { geographicTypeId: number; geographicType: string };
type CdcStrat = { id: number; abbreviation?: string; stratificationType?: unknown[] };
type CdcTemporal = { temporal?: string | number; temporalTypeId?: number };
type CdcGeoItem = { id?: number | string };
type CdcRow = {
  geo?: string;
  geoId?: string;
  title?: string;
  temporal?: string;
  dataValue?: string | number;
  displayValue?: string;
  suppressionFlag?: string;
  noDataId?: number;
  confidenceIntervalLow?: number | null;
  confidenceIntervalHigh?: number | null;
};

// Pull the last 4-digit year from a temporal label (handles single years like
// "2019" and 5-year period labels for the mortality measure).
function parseYear(temporal: string | undefined): number | null {
  const m = String(temporal ?? "").match(/(\d{4})(?!.*\d{4})/);
  return m ? Number(m[1]) : null;
}

async function ingestCdcMeasure(m: (typeof CDC_TRACKING_MEASURES)[number]): Promise<{
  rows: YearMetricInput[];
  note: string;
}> {
  const geoTypes = await cdcApi<CdcGeoType[]>(`geographicTypes/${m.measureId}`);
  const rows: YearMetricInput[] = [];

  for (const gt of geoTypes) {
    const name = (gt.geographicType ?? "").toLowerCase();
    // State and national only — skip county to avoid volume + heavy suppression.
    const level = name === "state" ? "state" : name === "national" || name === "us" ? "nation" : null;
    if (!level) continue;
    const geoTypeId = gt.geographicTypeId;

    const strats = await cdcApi<CdcStrat[]>(`stratificationlevel/${m.measureId}/${geoTypeId}/0`);
    // The base level has no advanced stratification (no age/sex/cause split).
    const base = strats.find((s) => (s.stratificationType?.length ?? 0) === 0) ?? strats[0];
    if (!base) continue;

    const temporal = await cdcApi<CdcTemporal[]>(`temporalItems/${m.measureId}/${geoTypeId}/ALL/ALL`);
    const years = [...new Set(temporal.map((t) => String(t.temporal)).filter((y) => y && y !== "undefined"))];
    const temporalTypeId = String(temporal[0]?.temporalTypeId ?? 1);
    if (years.length === 0) continue;

    const geoItems = await cdcApi<CdcGeoItem[]>(`geographicItems/${m.measureId}/${geoTypeId}/0`);
    const geoIds = [...new Set(geoItems.map((g) => String(g.id)).filter((v) => v && v !== "null"))];
    if (geoIds.length === 0) continue;

    const core = await cdcApi<{ tableResult?: CdcRow[] }>(
      `getCoreHolder/${m.measureId}/${base.id}/0/0`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geographicTypeIdFilter: String(geoTypeId),
          geographicItemsFilter: geoIds.join(","),
          temporalTypeIdFilter: temporalTypeId,
          temporalItemsFilter: years.join(","),
        }),
      },
    );

    for (const r of core.tableResult ?? []) {
      if (r.suppressionFlag && r.suppressionFlag !== "0") continue; // CDC-suppressed
      if (r.noDataId != null && r.noDataId !== -1) continue; // no data
      const value = Number(r.dataValue);
      if (!Number.isFinite(value)) continue;
      const year = parseYear(r.temporal);
      if (year == null) continue;
      const geo = level === "nation" ? "US" : r.geo || r.title;
      if (!geo) continue;
      const ciLow = r.confidenceIntervalLow != null ? Number(r.confidenceIntervalLow) : null;
      const ciHigh = r.confidenceIntervalHigh != null ? Number(r.confidenceIntervalHigh) : null;
      rows.push({
        indicator: m.indicator,
        geo,
        geoLevel: level,
        year,
        valueNumeric: value,
        valueDisplay: r.displayValue ?? String(value),
        ciLow: Number.isFinite(ciLow as number) ? ciLow : null,
        ciHigh: Number.isFinite(ciHigh as number) ? ciHigh : null,
        source: CDC_SOURCE,
        measuredOrModeled: m.tag,
        notes: m.note,
      });
    }
  }
  return { rows, note: `${m.indicator}: ${rows.length} rows` };
}

async function runCdcTracking(): Promise<ConnectorResult> {
  const notes: string[] = [
    "State-by-year counts; suppressed cells dropped. National headline stays the sourced seed (states are not summed).",
  ];
  let upserted = 0;
  // Upsert per measure so a slow run still persists completed measures.
  for (let i = 0; i < CDC_TRACKING_MEASURES.length; i++) {
    const m = CDC_TRACKING_MEASURES[i];
    // Space measures out to stay under the API's unauthenticated rate limit
    // (a CDC_TRACKING_TOKEN removes the limit entirely).
    if (i > 0 && !process.env.CDC_TRACKING_TOKEN) {
      await new Promise((r) => setTimeout(r, 2000));
    }
    try {
      const { rows } = await ingestCdcMeasure(m);
      const n = await upsertYearMetricsBulk(rows);
      upserted += n;
      notes.push(`${m.indicator}: ${n} rows`);
    } catch (err) {
      notes.push(`${m.indicator}: ERROR ${(err as Error).message}`);
    }
  }
  return { source: CDC_SOURCE, upserted, notes };
}

// ---------------------------------------------------------------------------
// CPSC NEISS — national ER injury estimates for CO.
//
// Verified 2026-07: `api.cpsc.gov` does not resolve (no DNS) — there is no public
// JSON API for NEISS national CO estimates. NEISS national figures are published
// as reports / annual sample files that require the survey weights to reproduce,
// so they can't be fetched live without fabricating a number. Per the No-API
// doctrine (docs/05): emergency-department visits are ingested per state from CDC
// Tracking (measure 120) instead, and the national Modeled "over 100,000" estimate
// is maintained as a sourced seed/CSV figure. This connector intentionally does
// not run rather than emit an unverified number.
// ---------------------------------------------------------------------------
async function runNeiss(): Promise<ConnectorResult> {
  throw new NotConfiguredError(
    "NEISS has no public JSON API (api.cpsc.gov does not resolve, verified 2026-07). " +
      "Emergency-department visits are ingested from CDC Tracking (measure 120); the national " +
      "Modeled estimate is maintained via seed/CSV. Nothing to fetch — this connector does not run.",
  );
}

// ---------------------------------------------------------------------------
// Geocode fire departments — backfill lat/lng from their address (in notes) via
// the free U.S. Census batch geocoder, so the resources finder can do a real
// distance/radius search and plot a map. Batched + resumable: run until done.
// ---------------------------------------------------------------------------
async function runGeocode(): Promise<ConnectorResult> {
  const { selected, matched, remaining } = await geocodeFireDepartmentsBatch(1000);
  const notes =
    selected === 0
      ? ["Nothing left to geocode — all fire-department addresses have been attempted."]
      : [
          `Geocoded ${matched} of ${selected} fire departments this run (U.S. Census).`,
          remaining > 0
            ? `${remaining} still to do — run again to continue.`
            : "Done — every parseable address has been geocoded.",
        ];
  return { source: "U.S. Census geocoder", upserted: matched, notes };
}

export const CONNECTORS: Record<string, Connector> = {
  airnow: { name: "airnow", label: "EPA AirNow (contextual outdoor CO)", run: runAirNow },
  "cdc-tracking": {
    name: "cdc-tracking",
    label: "CDC Environmental Public Health Tracking",
    run: runCdcTracking,
  },
  neiss: { name: "neiss", label: "CPSC NEISS", run: runNeiss },
  geocode: { name: "geocode", label: "Geocode fire departments (Census)", run: runGeocode },
};

export { NotConfiguredError };
