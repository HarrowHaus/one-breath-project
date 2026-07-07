import { NextResponse } from "next/server";
import { listResources } from "@/lib/db/queries";

// Internal cached API for resources (fire departments, poison control,
// utilities, programs). Reads only from our database.
//
//   GET /api/resources?type=fire_department&geo=US
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rows = await listResources({
    type: searchParams.get("type") ?? undefined,
    geo: searchParams.get("geo") ?? undefined,
  });

  return NextResponse.json(
    { count: rows.length, resources: rows },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
