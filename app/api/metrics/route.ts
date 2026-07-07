import { NextResponse } from "next/server";
import { getMetric } from "@/lib/db/queries";

// Internal cached API — the ONLY place the site reads a figure from. Reads from
// our database (seeded/ingested), never from an upstream source at page load.
// Token shape it serves: {{data:indicator|geo|year|source|tag}}.
//
//   GET /api/metrics?indicator=co_deaths&geo=US&year=latest
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const indicator = searchParams.get("indicator");

  if (!indicator) {
    return NextResponse.json(
      { found: false, error: "indicator is required" },
      { status: 400 },
    );
  }

  const result = await getMetric({
    indicator,
    geo: searchParams.get("geo") ?? undefined,
    year: searchParams.get("year") ?? undefined,
  });

  // Cache at the edge; a missing figure is a normal 200 (the site hides the line).
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
