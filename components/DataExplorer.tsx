"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DataTag } from "./DataTag";
import { MetricChart, type ChartPoint } from "./MetricChart";
import type { GeoOption, SeriesPoint } from "@/lib/db/queries";

// The Data explorer. Progressive disclosure — Where, then What, then When —
// reading ONLY the internal API. Every number shown carries its Measured/Modeled
// tag and source; a place/metric/year we can't source shows the honest empty
// state (verbatim from content/global.md), never a placeholder.

// Metric metadata is verbatim from content/data.md (labels, one-line
// definitions, and the sentence verb for each measure).
const METRICS = [
  {
    key: "co_deaths",
    label: "Deaths",
    verb: "died",
    definition:
      "People who died from accidental (non-fire) carbon monoxide poisoning, from death-certificate data.",
  },
  {
    key: "co_er_visits",
    label: "ER visits",
    verb: "were treated in an emergency room",
    definition:
      "People treated in an emergency department for accidental carbon monoxide poisoning.",
  },
  {
    key: "co_hospitalizations",
    label: "Hospitalizations",
    verb: "were hospitalized",
    definition:
      "People admitted to a hospital for accidental carbon monoxide poisoning.",
  },
] as const;

const NOT_AVAILABLE =
  "We don't have verified data for this yet. When we do, it'll appear here with its source.";

// Long form used inside the result sentence; short form fills the dropdown.
function geoLongLabel(geoId: string): string {
  return geoId === "US" ? "the United States" : geoId;
}
function geoShortLabel(geoId: string): string {
  return geoId === "US" ? "United States" : geoId;
}

function valueText(p: SeriesPoint): string {
  if (p.valueNumeric != null) return new Intl.NumberFormat("en-US").format(p.valueNumeric);
  return p.valueDisplay ?? "";
}

// Pick the point matching the selected year, else the "latest" snapshot.
function pickPoint(points: SeriesPoint[], year: number | null): SeriesPoint | null {
  if (points.length === 0) return null;
  if (year != null) return points.find((p) => p.year === year) ?? null;
  return points.find((p) => p.isLatest) ?? points[points.length - 1] ?? null;
}

function toCsv(indicator: string, geo: string, points: SeriesPoint[]): string {
  const header = ["indicator", "place", "year", "value_numeric", "value_display", "tag", "source"];
  const esc = (v: string | number | null) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const rows = points.map((p) =>
    [indicator, geoShortLabel(geo), p.year ?? "latest", p.valueNumeric, p.valueDisplay, p.tag, p.source]
      .map(esc)
      .join(","),
  );
  return [header.join(","), ...rows].join("\r\n");
}

export function DataExplorer({
  geos,
  defaultGeo,
  defaultIndicator,
  initialPoints,
}: {
  geos: GeoOption[];
  defaultGeo: string;
  defaultIndicator: string;
  initialPoints: SeriesPoint[];
}) {
  const [geo, setGeo] = useState(defaultGeo);
  const [indicator, setIndicator] = useState(defaultIndicator);
  const [points, setPoints] = useState<SeriesPoint[]>(initialPoints);
  const [year, setYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Cache series by indicator|geo so re-selecting a prior choice is instant and
  // we never re-hit the API for data we already have. Seeded with the default.
  const cache = useRef<Map<string, SeriesPoint[]>>(
    new Map([[`${defaultIndicator}|${defaultGeo}`, initialPoints]]),
  );

  const yearFieldId = useId();

  useEffect(() => {
    const key = `${indicator}|${geo}`;
    const cached = cache.current.get(key);
    if (cached) {
      setPoints(cached);
      setYear(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/metrics/series?indicator=${encodeURIComponent(indicator)}&geo=${encodeURIComponent(geo)}`)
      .then((r) => r.json())
      .then((data: { points?: SeriesPoint[] }) => {
        if (cancelled) return;
        const pts = Array.isArray(data.points) ? data.points : [];
        cache.current.set(key, pts);
        setPoints(pts);
        setYear(null);
      })
      .catch(() => {
        if (!cancelled) setPoints([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [indicator, geo]);

  const metric = METRICS.find((m) => m.key === indicator) ?? METRICS[0];
  const years = points.map((p) => p.year).filter((y): y is number => y != null);
  const selected = pickPoint(points, year);

  // Chart uses every point that carries a number, labelled by year (or "Latest").
  const chartPoints: ChartPoint[] = points
    .filter((p) => p.valueNumeric != null)
    .map((p) => ({ label: p.year != null ? String(p.year) : "Latest", value: p.valueNumeric as number }));

  function downloadCsv() {
    const csv = toCsv(indicator, geo, points);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `co-${indicator}-${geoShortLabel(geo).replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="obp-explorer">
      {/* Step 1 — Where */}
      <div className="obp-explorer__step">
        <h3 className="obp-explorer__step-title">1. Where</h3>
        <label className="usa-label" htmlFor="obp-geo">
          Choose a place
        </label>
        <select
          id="obp-geo"
          className="usa-select"
          value={geo}
          onChange={(e) => setGeo(e.target.value)}
          style={{ maxWidth: "20rem" }}
        >
          {geos.map((g) => (
            <option key={g.geoId} value={g.geoId}>
              {geoShortLabel(g.geoId)}
            </option>
          ))}
        </select>
        {geos.length <= 1 ? (
          <p className="obp-explorer__hint">
            We currently hold national figures. State and county data will appear
            here as we verify it, each with its source.
          </p>
        ) : null}
      </div>

      {/* Step 2 — What */}
      <div className="obp-explorer__step">
        <h3 className="obp-explorer__step-title">2. What</h3>
        <div className="obp-chips" role="group" aria-label="Choose a measure">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              className="obp-chip"
              aria-pressed={indicator === m.key}
              onClick={() => setIndicator(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="obp-explorer__def">{metric.definition}</p>
      </div>

      {/* Step 3 — When */}
      <div className="obp-explorer__step">
        <h3 className="obp-explorer__step-title">3. When</h3>
        {years.length >= 2 ? (
          <div className="obp-range">
            <label className="usa-label" htmlFor={yearFieldId}>
              Year: <strong>{year ?? years[years.length - 1]}</strong>
            </label>
            <input
              id={yearFieldId}
              className="usa-range"
              type="range"
              min={years[0]}
              max={years[years.length - 1]}
              step={1}
              value={year ?? years[years.length - 1]}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
        ) : years.length === 1 ? (
          <p className="obp-explorer__hint">Year: {years[0]}</p>
        ) : (
          <p className="obp-explorer__hint">Latest available figure.</p>
        )}
      </div>

      {/* Result */}
      <div className="obp-explorer__result" aria-live="polite" aria-busy={loading}>
        {selected ? (
          <>
            <MetricChart
              points={chartPoints}
              caption={`${metric.label} — ${geoShortLabel(geo)}`}
              unitLabel={metric.label.toLowerCase()}
            />
            <p className="obp-explorer__sentence">
              In {geoLongLabel(geo)}
              {selected.year != null ? ` in ${selected.year}` : ""}, at least{" "}
              <strong>{valueText(selected)}</strong> people {metric.verb} for
              accidental carbon monoxide poisoning. Almost none of it had to
              happen.
            </p>
            <p>
              <DataTag tag={selected.tag} source={selected.source} />
            </p>
            <p>
              <button type="button" className="usa-button usa-button--outline" onClick={downloadCsv}>
                Download this data (CSV)
              </button>
            </p>
          </>
        ) : (
          <div className="usa-alert usa-alert--info" role="status">
            <div className="usa-alert__body">
              <p className="usa-alert__text">{NOT_AVAILABLE}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
