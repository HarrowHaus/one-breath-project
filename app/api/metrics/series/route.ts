import { NextResponse } from "next/server";
import { listMetricSeries } from "@/lib/db/queries";

// Internal cached API — the time series behind the Data explorer's chart, year
// control, and CSV export. Reads only from our database (seeded/ingested), never
// from an upstream source at page load.
//
//   GET /api/metrics/series?indicator=co_deaths&geo=US
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const indicator = searchParams.get("indicator");

  if (!indicator) {
    return NextResponse.json(
      { indicator: null, geo: null, points: [], error: "indicator is required" },
      { status: 400 },
    );
  }

  const geo = searchParams.get("geo") ?? "US";

  try {
    const points = await listMetricSeries({ indicator, geo });
    // An empty series is a normal 200 — the explorer shows its "no verified data
    // yet" state rather than a placeholder number.
    return NextResponse.json(
      { indicator, geo, points },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      },
    );
  } catch (err: unknown) {
    console.error("GET /api/metrics/series failed:", (err as Error)?.message);
    return NextResponse.json(
      { indicator, geo, points: [] },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
}
