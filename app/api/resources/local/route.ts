import { NextResponse } from "next/server";
import { findLocalResources } from "@/lib/db/queries";

// Internal API for the local resource finder: given a ZIP, return the nearest
// fire departments (matched by address ZIP/area — no coordinates stored yet)
// plus any curated gas utilities / installers for that state. Reads only our DB.
//
//   GET /api/resources/local?zip=29201
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip") ?? "";

  try {
    const result = await findLocalResources(zip);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
    });
  } catch (err) {
    console.error("GET /api/resources/local failed:", (err as Error)?.message);
    return NextResponse.json(
      { zip, state: null, fireDepartments: [], gasUtilities: [], installers: [] },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
}
