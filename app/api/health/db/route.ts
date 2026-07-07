import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

// Diagnostic: is the Worker able to reach the database? Runs a trivial query and
// reports the real error (name/code/message) so connection problems can be
// diagnosed from the browser instead of a blank 500. Safe to remove once the
// database connection is confirmed healthy.
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, reason: "DATABASE_URL is not set" },
      { status: 200 },
    );
  }
  try {
    await db.execute(sql`select 1 as ok`);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { name?: string; code?: string; message?: string };
    return NextResponse.json(
      { ok: false, name: e?.name, code: e?.code, message: e?.message },
      { status: 500 },
    );
  }
}
