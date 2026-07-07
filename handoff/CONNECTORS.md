# Data connectors (Phase 2B)

How external CO data gets into our database. Everything is ingest → normalize →
store in our DB → serve from our internal API. Every figure is tagged
Measured/Modeled with its source and retrieval date.

## Why these run in production, not locally

The government data APIs (CDC Tracking, CPSC NEISS, CDC WONDER, EPA AirNow) are
**only reachable from Cloudflare's network** — the local dev sandbox is blocked
from them. So connectors run on the deployed Worker and must be verified there.

## What's built

- **USFA fire departments** — done and tested. `scripts/import-usfa.mjs` loads
  the National Fire Department Registry CSV into `resources`. (See
  `handoff/DATABASE_SETUP.md` for loading it to Supabase.)
- **Ingestion framework** — `lib/connectors/` + a protected trigger route:
  - `POST /api/admin/ingest/<source>` runs one connector.
  - Auth: a `Bearer <INGEST_TOKEN>` header (for a scheduler) **or** an admin
    session (signed into `/manage`).
  - Each connector upserts via `upsertYearMetric` (idempotent on
    indicator+geo+year), so re-running refreshes rather than duplicates.
- **Connectors:**
  - `airnow` — EPA AirNow. Fetches **outdoor ambient** air quality; stored under
    `outdoor_ambient_co` and flagged **contextual only, NOT indoor poisoning
    risk**. Never surfaced as a risk figure. Needs `AIRNOW_API_KEY`.
  - `cdc-tracking`, `neiss` — scaffolded. They **refuse to run** (HTTP 501 "not
    configured") until their exact request shapes are set, so they never emit
    unverified numbers.

## Finishing `cdc-tracking` and `neiss` (live-verification pass)

Because the sandbox can't reach the APIs or their docs, the source-specific
constants are intentionally left blank. To finish, on the deployed site:

1. **CDC Environmental Public Health Tracking** — from the current Tracking API
   measures list, get the numeric measure IDs for unintentional CO **ED visits**,
   **hospitalizations**, and **mortality**. Fill `CDC_TRACKING_MEASURES` in
   `lib/connectors/index.ts` and implement the `getCoreHolder` request + response
   mapping. Source label: "CDC Environmental Public Health Tracking Network".
2. **CPSC NEISS** — from the current `api.cpsc.gov` docs, set the CO
   diagnosis/product query and map the national estimate + confidence interval
   into `ci_low`/`ci_high`. National ER figures are **Modeled**.
3. **CDC WONDER** — mortality by county/demographics via its XML API. Deferred;
   add as a fourth connector when needed.

Confirm each against its official docs before enabling — endpoints and IDs
change, and every figure must trace to its source.

## Setup

Set these as **Secrets** on the Cloudflare Worker (and in local `.env`):

- `AIRNOW_API_KEY` — your free AirNow key.
- `INGEST_TOKEN` — a long random string the scheduler sends as
  `Authorization: Bearer <token>`.

Apply the connector schema migration to the database once (adds the
per-year unique index): `DATABASE_URL=<supabase> npm run db:migrate`.

## Scheduling

Trigger connectors on a schedule by having a cron caller POST the route with the
token, e.g. a GitHub Actions cron or a Cloudflare Cron Trigger:

```
curl -X POST https://<site>/api/admin/ingest/airnow \
  -H "Authorization: Bearer $INGEST_TOKEN"
```

Run each source on a cadence that fits how often it updates (most CO datasets
update yearly; AirNow is near-real-time but contextual).
