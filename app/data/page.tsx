import type { Metadata } from "next";
import Link from "next/link";
import { DataExplorer } from "@/components/DataExplorer";
import { listMetricGeos, listMetricSeries, type GeoOption } from "@/lib/db/queries";

// The Data hub. Copy verbatim from content/data.md; metadata from
// content/metadata.md. The explorer reads only the internal API and shows the
// honest "not available" state where we can't source a number.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carbon monoxide data — where you live",
  description:
    "Explore verified carbon monoxide deaths, ER visits, and hospitalizations by place and year. Every figure sourced.",
};

const DEFAULT_INDICATOR = "co_deaths";
const DEFAULT_GEO = "US";

export default async function DataPage() {
  const [geosRaw, initialPoints] = await Promise.all([
    listMetricGeos(),
    listMetricSeries({ indicator: DEFAULT_INDICATOR, geo: DEFAULT_GEO }),
  ]);

  // Always offer the national row even if the lookup came back empty, so the
  // control is never blank; dedupe if US is already present.
  const geos: GeoOption[] = geosRaw.some((g) => g.geoId === "US")
    ? geosRaw
    : [{ geoId: "US", geoLevel: "nation" }, ...geosRaw];

  return (
    <div className="usa-section">
      <div className="grid-container">
        <div className="usa-prose">
          <h1>Carbon monoxide data — where you live</h1>
          <p className="obp-hero__lede">
            Here&rsquo;s what carbon monoxide does, in the numbers we can verify —
            where you live, if we have it. Pick a place, a measure, and a year.
            Every figure names its source and tells you whether it was measured or
            modeled.
          </p>
        </div>

        <DataExplorer
          geos={geos}
          defaultGeo={DEFAULT_GEO}
          defaultIndicator={DEFAULT_INDICATOR}
          initialPoints={initialPoints}
        />

        <p className="margin-top-4">
          <Link href="/data/methodology">How we know this</Link>
        </p>
      </div>
    </div>
  );
}
