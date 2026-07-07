import { NextResponse } from "next/server";

// Phase 0 smoke-test endpoint. Proves serverless API routes run on the
// Cloudflare Workers Node runtime — the foundation the Phase 2 internal
// cached API is built on. No data, no secrets.
export function GET() {
  return NextResponse.json({ status: "ok", phase: 0 });
}
