import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

// Lightweight DB health probe: runs a trivial query and reports reachability.
// No error internals are exposed publicly; details go to the Worker logs.
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: false, reason: "no database configured" });
  }
  try {
    await db.execute(sql`select 1 as ok`);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("DB health check failed:", (err as Error)?.message);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
