// Data connectors (Phase 2B). Each connector fetches from an external source
// (only reachable from Cloudflare's network, not local dev), normalizes to our
// `metrics` schema, and upserts — tagging every figure Measured/Modeled with its
// source and retrieval date (docs/05, honesty non-negotiable).
//
// IMPORTANT: the exact request shapes (CDC Tracking measure IDs, NEISS params)
// must be confirmed against each source's CURRENT official API before the
// connector will emit data. Connectors that aren't fully configured throw a
// clear "not configured" error rather than invent numbers.
import { upsertYearMetric } from "@/lib/db/queries";

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
// hospitalizations, and mortality by geography/year. The REST API keys off
// numeric measure IDs; set the real ones (from the Tracking API measures list)
// in CDC_TRACKING_MEASURES before enabling. Left unset on purpose so the
// connector cannot emit unverified figures.
// ---------------------------------------------------------------------------
const CDC_TRACKING_MEASURES: Record<string, { measureId: number; tag: string }> = {
  // indicator            → { measureId: <VERIFY from CDC Tracking>, tag }
  // co_er_visits:        { measureId: 0, tag: "Modeled" },
  // co_hospitalizations: { measureId: 0, tag: "Measured" },
  // co_deaths:           { measureId: 0, tag: "Measured" },
};

async function runCdcTracking(): Promise<ConnectorResult> {
  if (Object.keys(CDC_TRACKING_MEASURES).length === 0) {
    throw new NotConfiguredError(
      "CDC Tracking measure IDs are not set. Populate CDC_TRACKING_MEASURES from the " +
        "current CDC Tracking API measures list, then redeploy. (Endpoints/IDs must be " +
        "verified live; this sandbox cannot reach ephtracking.cdc.gov.)",
    );
  }
  // Request shape (verify against current docs):
  //   GET https://ephtracking.cdc.gov/apigateway/api/v1/getCoreHolder/{measureId}/{stratLevel}/{geoType}/{geoItems}/{temporalItems}/...
  // Normalize each returned datum → upsertYearMetric({ indicator, geo, year,
  //   valueNumeric, ciLow, ciHigh, source: "CDC Environmental Public Health Tracking Network", tag }).
  throw new NotConfiguredError("CDC Tracking request shape pending live verification.");
}

// ---------------------------------------------------------------------------
// CPSC NEISS — national ER injury estimates for CO, with confidence intervals.
// Set the query params (product/diagnosis codes, endpoint) from the current
// NEISS/CPSC open-data API before enabling.
// ---------------------------------------------------------------------------
async function runNeiss(): Promise<ConnectorResult> {
  throw new NotConfiguredError(
    "NEISS query params (endpoint, CO diagnosis code) pending live verification against " +
      "the current api.cpsc.gov docs. National ER figures are Modeled; store ci_low/ci_high.",
  );
}

export const CONNECTORS: Record<string, Connector> = {
  airnow: { name: "airnow", label: "EPA AirNow (contextual outdoor CO)", run: runAirNow },
  "cdc-tracking": {
    name: "cdc-tracking",
    label: "CDC Environmental Public Health Tracking",
    run: runCdcTracking,
  },
  neiss: { name: "neiss", label: "CPSC NEISS", run: runNeiss },
};

export { NotConfiguredError };
