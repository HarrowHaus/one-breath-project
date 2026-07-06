# Phase 2A — Data platform: database + internal API

**Produces:** your own database and the internal API every later feature reads from.
**You need first:** a Neon or Supabase account (free tier).

**Reference:** `/docs/08_DATA_DICTIONARY.md` — build the schema to support exactly those indicators, and enter the seed data so real figures show on first build.

## Instruction for Claude Code

```
Provision a Postgres database with PostGIS (my Neon/Supabase account) and connect it to the app via environment variables — tell me exactly which values to paste where in Cloudflare and locally (never commit secrets). Then:
1. Create the tables from /docs/05_DATA_PLATFORM.md: metrics, resources, stories, content (or defer content to the CMS).
2. Build an internal cached API (endpoints the site reads from) that serves metrics and resources by geography/indicator/year. The public site must read ONLY from this internal API, never from external sources directly.
3. Add a simple password-protected admin screen for manual data entry and for flagging resources whose verified_at date is stale.
On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
Claude Code confirms the database is connected, the tables exist, and the internal API returns data you entered through the admin screen.
