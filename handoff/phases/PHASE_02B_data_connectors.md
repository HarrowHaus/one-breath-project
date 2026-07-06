# Phase 2B — Data connectors

**Produces:** real CO data flowing into your database, all sourced and tagged.
**You need first:** a free AirNow API key; the USFA National Fire Department Registry national CSV (download it).

## Instruction for Claude Code

```
Build ingestion connectors that pull external CO data into our database on a schedule, normalizing everything to our tables and tagging each figure Measured or Modeled with its source and retrieval date. For EACH source, consult its CURRENT official API docs and adapt — do not assume endpoint shapes:
1. CDC Environmental Public Health Tracking Network API — unintentional CO ED visits, hospitalizations, mortality by geography/year.
2. CPSC NEISS open data API (api.cpsc.gov) — national ER injury estimates for CO, incl. product links. Store confidence intervals.
3. CDC WONDER — CO mortality by geography/demographics, if accessible via its API.
4. EPA AirNow API (my key) — outdoor ambient CO ONLY, clearly flagged as contextual, NOT indoor risk.
5. USFA National Fire Department Registry — import the CSV I downloaded; geocode each department to lat/long; load into the resources table.
Also build a generic CSV importer + admin form for no-API sources (state fire marshals, local programs, utility emergency lines). Every record carries source, retrieved_at, and a Measured/Modeled tag. Show me the imported data in the admin. On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
You can see real CO figures and fire-department records in the admin, each tagged with a source and Measured/Modeled.
