import { and, desc, eq, lt, or, isNull, isNotNull, inArray, sql } from "drizzle-orm";
import { getDb, resetDb } from "./index";
import { censusBatchGeocode, parseAddress, type ParsedAddress } from "@/lib/geocode";
import { metrics, pledges, resources } from "./schema";

// A transient DB failure (e.g. a dropped Hyperdrive/Supabase connection) must
// never crash a page render (Cloudflare error 1101). Read-path queries route
// their DB errors through here: log, drop the poisoned pool, and let the caller
// fall back to its empty/"no data" state so the site hides that line instead.
function onReadError(where: string, err: unknown): void {
  console.error(`db read failed (${where}):`, err instanceof Error ? err.message : err);
  resetDb();
}

// Run a read; if the DB connection failed, drop the poisoned pool and try once
// more with a fresh one. A transient Hyperdrive/Supabase drop then costs a retry
// instead of a failed render (the Cloudflare 1101 we occasionally saw). `run`
// must call getDb() itself so the retry picks up the rebuilt pool.
async function withDbRetry<T>(run: () => Promise<T>, where: string, fallback: T): Promise<T> {
  try {
    return await run();
  } catch {
    resetDb();
    try {
      return await run();
    } catch (err) {
      onReadError(where, err);
      return fallback;
    }
  }
}

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
  const geo = params.geo?.trim() || "US";
  const yearRaw = params.year?.trim() || "latest";

  // Retries once on a dropped connection before hiding the figure.
  return withDbRetry<MetricResult>(
    async () => {
      const db = getDb();
      if (!db) return { found: false };

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
    },
    `getMetric ${params.indicator}/${geo}/${yearRaw}`,
    { found: false },
  );
}

// ---- Data explorer (Phase 6) ----

// A place we actually hold data for. The explorer offers ONLY these in its
// "Where" control — we never present a place we can't source a number for.
export type GeoOption = { geoId: string; geoLevel: string };

// One point in a metric's time series for a place. valueNumeric powers the
// chart/axis; valueDisplay is the natural-language phrasing; tag/source carry
// the honesty metadata onto every point.
export type SeriesPoint = {
  year: number | null;
  valueNumeric: number | null;
  valueDisplay: string | null;
  tag: string;
  source: string;
  isLatest: boolean;
};

// Distinct places present in the metrics table (deduped). Right now that's just
// the national row; as the CDC/NEISS connectors ingest state/county rows they
// appear here automatically and the explorer's "Where" control grows with them.
export async function listMetricGeos(): Promise<GeoOption[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .selectDistinct({ geoId: metrics.geoId, geoLevel: metrics.geoLevel })
      .from(metrics)
      .orderBy(metrics.geoLevel, metrics.geoId);
    return rows.map((r) => ({ geoId: r.geoId, geoLevel: r.geoLevel }));
  } catch (err) {
    onReadError("listMetricGeos", err);
    return [];
  }
}

// Every stored figure for one indicator + place, oldest year first with the
// yearless "latest" snapshot last. Powers the explorer's chart, year control,
// and CSV export — all from the internal data, never a guessed number.
export async function listMetricSeries(params: {
  indicator: string;
  geo?: string;
}): Promise<SeriesPoint[]> {
  const geo = params.geo?.trim() || "US";
  return withDbRetry<SeriesPoint[]>(
    async () => {
      const db = getDb();
      if (!db) return [];
      const rows = await db
        .select()
        .from(metrics)
        .where(and(eq(metrics.indicator, params.indicator), eq(metrics.geoId, geo)))
        .orderBy(sql`${metrics.year} asc nulls last`);
      return rows.map((r) => ({
        year: r.year,
        valueNumeric: r.valueNumeric,
        valueDisplay: r.valueDisplay,
        tag: r.measuredOrModeled,
        source: r.source,
        isLatest: r.isLatest,
      }));
    },
    `listMetricSeries ${params.indicator}/${geo}`,
    [],
  );
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
  // Miles from the searcher's location — set only by the local finder when both
  // the department and the search origin are geocoded.
  distanceMiles?: number | null;
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

  try {
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
  } catch (err) {
    onReadError("listResources", err);
    return [];
  }
}

// Resources whose verification is older than `months` (or never verified) —
// powers the admin staleness flag (no-API doctrine, docs/05).
export async function listStaleResources(months = 6): Promise<ResourceRow[]> {
  const db = getDb();
  if (!db) return [];

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  try {
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
  } catch (err) {
    onReadError("listStaleResources", err);
    return [];
  }
}

// Map a raw resources row to the API shape.
function toResourceRow(r: typeof resources.$inferSelect): ResourceRow {
  return {
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
  };
}

export type LocalResources = {
  zip: string;
  state: string | null;
  fireDepartments: ResourceRow[];
  gasUtilities: ResourceRow[];
  installers: ResourceRow[];
};

// The local finder. Fire-department addresses live in `notes` with their ZIP.
// We first area-match by ZIP text (same 5-digit ZIP, then same 3-digit USPS
// area) to establish the region. If those departments are geocoded, we use their
// centroid as the search origin and return the true NEAREST departments by
// distance (radius search) with a mile figure each; otherwise we fall back to
// the text-matched list. State is derived from the matches; curated gas
// utilities / installers for that state are attached. Missing categories come
// back empty so the panel hides those rows (never a guess).
export async function findLocalResources(zipRaw: string): Promise<LocalResources> {
  const zip = (zipRaw || "").replace(/\D/g, "").slice(0, 5);
  const empty: LocalResources = { zip, state: null, fireDepartments: [], gasUtilities: [], installers: [] };

  const db = getDb();
  if (!db || zip.length !== 5) return empty;
  const zip3 = zip.slice(0, 3);
  const areaRe = `(^|[^0-9])${zip3}[0-9][0-9]([^0-9]|$)`;

  try {
    const areaRows = await db
      .select()
      .from(resources)
      .where(and(eq(resources.type, "fire_department"), sql`${resources.notes} ~ ${areaRe}`))
      .limit(30);

    const ranked = areaRows
      .map(toResourceRow)
      .sort((a, b) => Number(b.notes?.includes(zip) ?? false) - Number(a.notes?.includes(zip) ?? false));
    const state = ranked[0]?.geo ?? null;

    // Search origin = centroid of the area-matched departments that are geocoded.
    const geocoded = ranked.filter((r) => r.lat != null && r.lng != null);
    let fireDepartments: ResourceRow[];
    if (geocoded.length > 0) {
      const originLat = geocoded.reduce((s, r) => s + (r.lat as number), 0) / geocoded.length;
      const originLng = geocoded.reduce((s, r) => s + (r.lng as number), 0) / geocoded.length;
      const dist = sql`3959 * acos(greatest(-1, least(1,
        cos(radians(${originLat})) * cos(radians(${resources.lat})) *
        cos(radians(${resources.lng}) - radians(${originLng})) +
        sin(radians(${originLat})) * sin(radians(${resources.lat}))
      )))`;
      const near = await db
        .select({
          id: resources.id, type: resources.type, name: resources.name, geoId: resources.geoId,
          lat: resources.lat, lng: resources.lng, phone: resources.phone, url: resources.url,
          notes: resources.notes, source: resources.source, verifiedAt: resources.verifiedAt,
          distance: dist.as("distance"),
        })
        .from(resources)
        .where(and(eq(resources.type, "fire_department"), isNotNull(resources.lat)))
        .orderBy(sql`distance asc`)
        .limit(6);
      fireDepartments = near.map((r) => ({
        id: r.id, type: r.type, name: r.name, geo: r.geoId, lat: r.lat, lng: r.lng,
        phone: r.phone, url: r.url, notes: r.notes, source: r.source,
        verifiedAt: r.verifiedAt ? r.verifiedAt.toISOString() : null,
        distanceMiles: r.distance != null ? Math.round(Number(r.distance) * 10) / 10 : null,
      }));
    } else {
      fireDepartments = ranked.slice(0, 6);
    }

    let gasUtilities: ResourceRow[] = [];
    let installers: ResourceRow[] = [];
    if (state) {
      const [gas, inst] = await Promise.all([
        db.select().from(resources).where(and(eq(resources.type, "gas_utility"), eq(resources.geoId, state))).limit(3),
        db.select().from(resources).where(and(eq(resources.type, "installer"), eq(resources.geoId, state))).limit(6),
      ]);
      gasUtilities = gas.map(toResourceRow);
      installers = inst.map(toResourceRow);
    }

    return { zip, state, fireDepartments, gasUtilities, installers };
  } catch (err) {
    onReadError(`findLocalResources ${zip}`, err);
    return empty;
  }
}

// Geocode the next batch of fire departments that have an address but no
// coordinates. Uses the Census batch geocoder; matched rows get lat/lng, and
// ALL selected rows are marked attempted so unresolved addresses don't recycle.
// Idempotent and resumable — safe to run repeatedly until `remaining` is 0.
export async function geocodeFireDepartmentsBatch(
  limit = 1000,
): Promise<{ selected: number; matched: number; remaining: number }> {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");

  // Ensure the tracking column exists (idempotent) so this runs on a database
  // where migration 0003 hasn't been applied yet — the button is self-sufficient.
  await db.execute(
    sql.raw(`ALTER TABLE resources ADD COLUMN IF NOT EXISTS geocode_attempted_at timestamptz`),
  );

  const pending = and(
    eq(resources.type, "fire_department"),
    isNull(resources.lat),
    isNull(resources.geocodeAttemptedAt),
    isNotNull(resources.notes),
  );

  const rows = await db
    .select({ id: resources.id, notes: resources.notes })
    .from(resources)
    .where(pending)
    .orderBy(resources.id)
    .limit(limit);

  if (rows.length === 0) return { selected: 0, matched: 0, remaining: 0 };

  const toGeo = rows
    .map((r) => {
      const a = parseAddress(r.notes);
      return a ? ({ id: r.id, ...a } as { id: number } & ParsedAddress) : null;
    })
    .filter((x): x is { id: number } & ParsedAddress => x !== null);

  const coords = await censusBatchGeocode(toGeo);

  let matched = 0;
  if (coords.size > 0) {
    // All ids and coords are DB integers / finite numbers — safe to inline.
    const values = [...coords.entries()]
      .map(([id, c]) => `(${Number(id)}, ${c.lat}, ${c.lng})`)
      .join(",");
    await db.execute(
      sql.raw(
        `UPDATE resources AS r SET lat = v.lat, lng = v.lng
         FROM (VALUES ${values}) AS v(id, lat, lng) WHERE r.id = v.id`,
      ),
    );
    matched = coords.size;
  }

  await db
    .update(resources)
    .set({ geocodeAttemptedAt: new Date() })
    .where(inArray(resources.id, rows.map((r) => r.id)));

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resources)
    .where(pending);

  return { selected: rows.length, matched, remaining: Number(count) };
}

// Advocacy-hub pledge (Phase 9). Public write — `wantsUpdates` comes from an
// unchecked-by-default box, so opting into updates is explicit.
export async function insertPledge(input: {
  name: string;
  email: string;
  wantsUpdates: boolean;
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");
  await db.insert(pledges).values({
    name: input.name,
    email: input.email,
    wantsUpdates: input.wantsUpdates,
  });
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
  try {
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
  } catch (err) {
    onReadError("listMetrics", err);
    return [];
  }
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

// Bulk version of upsertYearMetric for connectors that ingest thousands of
// state-by-year rows in one run (per-row round-trips are too slow on Workers).
// Idempotent on indicator+geo+year via the same partial unique index; on
// conflict each row refreshes from its own EXCLUDED values. Chunked to keep
// individual statements within parameter limits. Returns rows written.
export async function upsertYearMetricsBulk(rows: YearMetricInput[]): Promise<number> {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");
  if (rows.length === 0) return 0;

  const CHUNK = 200;
  let written = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    await db
      .insert(metrics)
      .values(
        slice.map((input) => ({
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
        })),
      )
      .onConflictDoUpdate({
        target: [metrics.indicator, metrics.geoId, metrics.year],
        targetWhere: sql`${metrics.year} is not null`,
        set: {
          valueDisplay: sql`excluded.value_display`,
          valueNumeric: sql`excluded.value_numeric`,
          ciLow: sql`excluded.ci_low`,
          ciHigh: sql`excluded.ci_high`,
          source: sql`excluded.source`,
          measuredOrModeled: sql`excluded.measured_or_modeled`,
          notes: sql`excluded.notes`,
          retrievedAt: sql`now()`,
          updatedAt: sql`now()`,
        },
      });
    written += slice.length;
  }
  return written;
}
