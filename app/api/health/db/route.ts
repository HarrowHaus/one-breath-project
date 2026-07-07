import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

// Diagnostic: is the Worker able to reach the database? Runs a trivial query and
// reports the real error — unwrapping the driver's error chain so the actual
// Postgres/socket cause (code + message) is visible from the browser. Safe to
// remove once the connection is confirmed healthy.
export const dynamic = "force-dynamic";

type ErrLike = { name?: string; code?: string; message?: string; cause?: unknown };

function describe(err: unknown, depth = 0): unknown {
  if (!err || depth > 4) return undefined;
  const e = err as ErrLike;
  return {
    name: e?.name,
    code: e?.code,
    message: e?.message,
    cause: describe(e?.cause, depth + 1),
  };
}

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
    return NextResponse.json({ ok: false, error: describe(err) }, { status: 500 });
  }
}
