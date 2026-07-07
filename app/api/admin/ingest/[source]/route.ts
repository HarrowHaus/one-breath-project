import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { CONNECTORS, NotConfiguredError } from "@/lib/connectors";

// Runs a data connector on demand. Protected: either a Bearer INGEST_TOKEN
// (for a scheduler — Cloudflare Cron / GitHub Actions) or an admin session.
//
//   POST /api/admin/ingest/airnow        Authorization: Bearer <INGEST_TOKEN>
export const dynamic = "force-dynamic";

function tokenOk(req: Request): boolean {
  const expected = process.env.INGEST_TOKEN;
  if (!expected) return false;
  const m = (req.headers.get("authorization") ?? "").match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const got = m[1];
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ source: string }> },
) {
  const { source } = await params;

  if (!tokenOk(req) && !(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const connector = CONNECTORS[source];
  if (!connector) {
    return NextResponse.json(
      { error: `unknown connector: ${source}`, available: Object.keys(CONNECTORS) },
      { status: 404 },
    );
  }

  try {
    const result = await connector.run();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      // Not an outage — the connector needs its live-verified config.
      return NextResponse.json({ ok: false, error: err.message }, { status: 501 });
    }
    console.error(`ingest ${source} failed:`, (err as Error)?.message);
    return NextResponse.json({ ok: false, error: "ingestion failed" }, { status: 500 });
  }
}
