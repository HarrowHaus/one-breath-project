# 05 — Data Platform

**Principle:** every source is *ingest → normalize → store in our DB → serve from our own internal API.* The public site and the explorer read only from the internal API, never from an upstream source directly. This gives resilience, speed, and one clean labeled source of truth.

## Source table

| Source | What it gives | API? | Ingestion |
|---|---|---|---|
| CDC Environmental Public Health Tracking Network | Unintentional CO ED visits, hospitalizations, mortality; fire/non-fire/intent splits; state + some sub-state | **Yes — JSON API** | Scheduled connector; keep CDC comparability caveats as metadata |
| CPSC NEISS (open data API) | National ER injury estimates incl. CO, linkable to products (heaters, generators) | **Yes — JSON API** (api.cpsc.gov) | Scheduled connector by diagnosis/product; store confidence intervals |
| CDC WONDER | Mortality by cause/geography/demographics | **Yes — API** (XML request) | Periodic pull for county/demographic mortality |
| EPA AirNow | Outdoor ambient CO real-time by location | **Yes — API** (free key) | **Contextual only.** Outdoor ambient ≠ indoor poisoning risk. Flag hard |
| USFA National Fire Department Registry | ~27,000 fire departments with addresses | **No — downloadable CSV** | Import + geocode to lat/long; load into `resources` (PostGIS) |
| State/local (IDPH, OSFM, utilities, programs) | State stats, local codes, contacts | **Usually none** | CSV importer + admin manual entry + staleness re-check |

**The honest gap (say it on the site):** there is no public API — no dataset — for the actual risk driver, indoor CO in a specific home. That absence is why detection/shutoff hardware exists.

## Schema (core tables)
- `metrics(geo_id, geo_level, year, indicator, value, ci_low, ci_high, source, measured_or_modeled, retrieved_at)`
- `resources(type, name, geo_id, lat, lng, phone, url, notes, source, retrieved_at, verified_at)`
- `stories(id, name, location, summary, media, consent_status)`
- `content(...)` — or delegate to the CMS.

## Layers
Ingestion connectors (one per source) → scheduled orchestration → transform (normalize, geocode to FIPS/lat-long, dedupe, attach source + retrieved_at + Measured/Modeled + CIs) → Postgres+PostGIS → **internal cached API** → CDN. Plus a password-protected admin for manual entry and staleness flags.

## No-API doctrine
For any source without an API: (1) CSV/bulk import if a file exists; (2) admin manual-entry UI for curated facts/contacts; (3) scheduled staleness checks that flag records older than N months; (4) provenance on every record (source, URL, retrieval date, Measured/Modeled), surfaced in the UI.
