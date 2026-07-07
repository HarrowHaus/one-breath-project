import { and, desc, eq, lt, or, isNull, sql } from "drizzle-orm";
import { getDb } from "./index";
import { metrics, resources } from "./schema";

// Shape the internal API returns for a single figure. `found: false` means the
// site hides that line — never a placeholder number (honesty non-negotiable).
export type MetricResult =
  | { found: false }
  | {
      found: true;
      indicator: string;
      geo: string;
      year: number | null;
      value: string | null; // display string, e.g. "more than 400"
      valueNumeric: number | null;
      tag: string; // "Measured" | "Modeled (national estimate)" | ...
      source: string;
      ciLow: number | null;
      ciHigh: number | null;
      retrievedAt: string;
    };

export async function getMetric(params: {
  indicator: string;
  geo?: string;
  year?: string; // a year, or "latest"
}): Promise<MetricResult> {
  const db = getDb();
  if (!db) return { found: false };

  const geo = params.geo?.trim() || "US";
  const yearRaw = params.year?.trim() || "latest";

  const whereLatest = and(
    eq(metrics.indicator, params.indicator),
    eq(metrics.geoId, geo),
    eq(metrics.isLatest, true),
  );

  let row;
  if (yearRaw === "latest") {
    [row] = await db.select().from(metrics).where(whereLatest).limit(1);
  } else {
    const year = Number.parseInt(yearRaw, 10);
    if (Number.isNaN(year)) return { found: false };
    [row] = await db
      .select()
      .from(metrics)
      .where(
        and(
          eq(metrics.indicator, params.indicator),
          eq(metrics.geoId, geo),
          eq(metrics.year, year),
        ),
      )
      .orderBy(desc(metrics.updatedAt))
      .limit(1);
  }

  if (!row) return { found: false };

  return {
    found: true,
    indicator: row.indicator,
    geo: row.geoId,
    year: row.year,
    value: row.valueDisplay,
    valueNumeric: row.valueNumeric,
    tag: row.measuredOrModeled,
    source: row.source,
    ciLow: row.ciLow,
    ciHigh: row.ciHigh,
    retrievedAt: row.retrievedAt.toISOString(),
  };
}

export type ResourceRow = {
  id: number;
  type: string;
  name: string;
  geo: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  url: string | null;
  notes: string | null;
  source: string;
  verifiedAt: string | null;
};

export async function listResources(params: {
  type?: string;
  geo?: string;
}): Promise<ResourceRow[]> {
  const db = getDb();
  if (!db) return [];

  const conditions = [];
  if (params.type) conditions.push(eq(resources.type, params.type));
  if (params.geo) conditions.push(eq(resources.geoId, params.geo));

  const rows = await db
    .select()
    .from(resources)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(500);

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    name: r.name,
    geo: r.geoId,
    lat: r.lat,
    lng: r.lng,
    phone: r.phone,
    url: r.url,
    notes: r.notes,
    source: r.source,
    verifiedAt: r.verifiedAt ? r.verifiedAt.toISOString() : null,
  }));
}

// Resources whose verification is older than `months` (or never verified) —
// powers the admin staleness flag (no-API doctrine, docs/05).
export async function listStaleResources(months = 6): Promise<ResourceRow[]> {
  const db = getDb();
  if (!db) return [];

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  const rows = await db
    .select()
    .from(resources)
    .where(or(isNull(resources.verifiedAt), lt(resources.verifiedAt, cutoff)))
    .limit(500);

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    name: r.name,
    geo: r.geoId,
    lat: r.lat,
    lng: r.lng,
    phone: r.phone,
    url: r.url,
    notes: r.notes,
    source: r.source,
    verifiedAt: r.verifiedAt ? r.verifiedAt.toISOString() : null,
  }));
}

// ---- Admin mutations (guarded by the /manage password) ----

// All current metrics, for the admin table.
export async function listMetrics(): Promise<
  {
    id: number;
    indicator: string;
    geo: string;
    year: number | null;
    isLatest: boolean;
    value: string | null;
    tag: string;
    source: string;
    updatedAt: string;
  }[]
> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(metrics).orderBy(metrics.indicator, desc(metrics.updatedAt));
  return rows.map((r) => ({
    id: r.id,
    indicator: r.indicator,
    geo: r.geoId,
    year: r.year,
    isLatest: r.isLatest,
    value: r.valueDisplay,
    tag: r.measuredOrModeled,
    source: r.source,
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export type MetricInput = {
  indicator: string;
  geo: string;
  valueDisplay: string;
  valueNumeric: number | null;
  source: string;
  measuredOrModeled: string;
  notes: string | null;
};

// Upsert the "latest" headline figure for an indicator + geography.
export async function upsertLatestMetric(input: MetricInput): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");
  await db
    .insert(metrics)
    .values({
      indicator: input.indicator,
      geoId: input.geo,
      geoLevel: input.geo === "US" ? "nation" : "state",
      isLatest: true,
      valueDisplay: input.valueDisplay,
      valueNumeric: input.valueNumeric,
      source: input.source,
      measuredOrModeled: input.measuredOrModeled,
      notes: input.notes,
    })
    .onConflictDoUpdate({
      target: [metrics.indicator, metrics.geoId],
      targetWhere: sql`${metrics.isLatest}`,
      set: {
        valueDisplay: input.valueDisplay,
        valueNumeric: input.valueNumeric,
        source: input.source,
        measuredOrModeled: input.measuredOrModeled,
        notes: input.notes,
        updatedAt: sql`now()`,
      },
    });
}

export type ResourceInput = {
  type: string;
  name: string;
  geo: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  url: string | null;
  notes: string | null;
  source: string;
};

// Manual resource entry counts as verification, so verified_at is set to now.
export async function insertResource(input: ResourceInput): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");
  await db.insert(resources).values({
    type: input.type,
    name: input.name,
    geoId: input.geo,
    lat: input.lat,
    lng: input.lng,
    phone: input.phone,
    url: input.url,
    notes: input.notes,
    source: input.source,
    verifiedAt: new Date(),
  });
}

// Re-verify a resource (clears its staleness flag).
export async function verifyResource(id: number): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");
  await db.update(resources).set({ verifiedAt: new Date() }).where(eq(resources.id, id));
}

// ---- Connector ingestion (Phase 2B) ----

export type YearMetricInput = {
  indicator: string;
  geo: string;
  geoLevel?: string;
  year: number;
  valueDisplay?: string | null;
  valueNumeric?: number | null;
  ciLow?: number | null;
  ciHigh?: number | null;
  source: string;
  measuredOrModeled: string;
  notes?: string | null;
};

// Upsert a year-specific figure (idempotent on indicator+geo+year). Connectors
// call this for each row they ingest, so re-running a connector refreshes rather
// than duplicates. Every row carries its source and Measured/Modeled tag.
export async function upsertYearMetric(input: YearMetricInput): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");
  await db
    .insert(metrics)
    .values({
      indicator: input.indicator,
      geoId: input.geo,
      geoLevel: input.geoLevel ?? (input.geo === "US" ? "nation" : "state"),
      year: input.year,
      isLatest: false,
      valueDisplay: input.valueDisplay ?? null,
      valueNumeric: input.valueNumeric ?? null,
      ciLow: input.ciLow ?? null,
      ciHigh: input.ciHigh ?? null,
      source: input.source,
      measuredOrModeled: input.measuredOrModeled,
      notes: input.notes ?? null,
    })
    .onConflictDoUpdate({
      target: [metrics.indicator, metrics.geoId, metrics.year],
      targetWhere: sql`${metrics.year} is not null`,
      set: {
        valueDisplay: input.valueDisplay ?? null,
        valueNumeric: input.valueNumeric ?? null,
        ciLow: input.ciLow ?? null,
        ciHigh: input.ciHigh ?? null,
        source: input.source,
        measuredOrModeled: input.measuredOrModeled,
        notes: input.notes ?? null,
        retrievedAt: sql`now()`,
        updatedAt: sql`now()`,
      },
    });
}
