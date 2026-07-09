# Open items — master backlog

Everything outstanding after Phases 0–10, in priority order. Compiled from a full
code + docs sweep (TODO/placeholder markers, unwired tokens, docs/10 + docs/12,
SEO, and the deferrals noted across the build).

**Owner key:** 🤖 = I can do it in code · 👤 = your decision / data / account · ⚖️ = lawyer.
**Status:** ☐ open · ◐ partial/provisional · ✅ done.

---

## Tier 1 — I can do now (code, no external dependencies) — ✅ DONE

All seven shipped (commit follows this doc update).

1. **✅ 🤖 SEO: `sitemap.xml` + `robots.txt`.** `app/sitemap.ts` (25 public routes) + `app/robots.ts` (allows crawl; disallows /manage, /api/, /styleguide, /thank-you; links the sitemap).
2. **✅ 🤖 Noindex non-public pages.** `/styleguide` already carried `noindex`; also excluded in robots. `/manage` + `/thank-you` noindexed.
3. **✅ 🤖 Instrument the rest of the docs/10 conversions.** Now firing: risk-tool completed, alarm-test reminder set, pledge added, landlord → installer click (plus the original three).
4. **✅ 🤖 Open Graph share image.** Branded 1200×630 `public/og.png`, wired into OpenGraph + Twitter metadata.
5. **✅ 🤖 Parameterize the site URL.** `lib/site.ts` reads `NEXT_PUBLIC_SITE_URL` (falls back to the Worker URL); used by metadataBase, sitemap, robots.
6. **✅ 🤖 Harden the DB read path.** `getMetric` and `listMetricSeries` now retry once on a dropped connection (fresh pool) before falling back.
7. **✅ 🤖 Cleanup.** Stale `app/layout.tsx` footer comment fixed.

---

## Tier 2 — I can do, but needs your input or an account first

8. **✅ Load the final national figures to production.** Done — the Sircar 2019 figures (deaths "at least 430" Measured/NVSS; ER visits "about 101,847" Modeled 2007–2013; hospitalizations "about 14,365" Modeled 2003–2013) are live in prod and the harm-pyramid hospitalization tier now renders. (Applied directly via the Supabase connector.)
9. **☐ 👤 Turn on analytics.** Cookieless Plausible is wired and off-by-default. Needs: a Plausible account, the `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` build var on Cloudflare, and the 3 (soon 7) goals defined. See LAUNCH_CHECKLIST §4.
10. **☐ 👤 Custom domain.** Point your real domain at the Worker (currently `one-breath-project.donald-dcd.workers.dev`) and set the site-URL var from item 5.
11. **◐ 🤖/👤 Fire-department geocoding → map + radius search.** ✅ BUILT: `/resources` now does true nearest-by-distance (Census geocoding) and shows a MapLibre map with markers when coordinates exist; degrades to the ZIP/text list otherwise. **To populate production:** sign into `/manage` → **"Geocode fire departments (next batch)"** and click until it says done (~27k rows, 1,000/click), or run `DATABASE_URL=<prod> node scripts/geocode-resources.mjs` to drain it in one go. Verified end-to-end locally (real SC departments, distance-sorted, map renders).
12. **☐ 👤 Enter curated local resources.** The finder hides rows we don't have: **gas-utility emergency lines, state fire marshals, installers, local CO-code summaries, downloadable toolkits.** Enter via `/manage` as you gather them (or give me a CSV).
13. **☐ 🤖/👤 Landlord + advocacy toolkit assets.** `{{local:toolkit file}}` and `{{local:advocacy_toolkit}}` have no real file — currently print-to-PDF / "on the way." Create the one-pager PDFs when ready.

---

## Tier 3 — Data pipeline enrichment (optional, post-launch OK)

14. **☐ 👤 `CDC_TRACKING_TOKEN`.** Free token from CDC removes the API rate limit so `co_deaths` ingests in a single click instead of sometimes needing a re-run.
15. **☐ 👤 Schedule the connectors.** A Cloudflare Cron / GitHub Action POSTing the ingest endpoint with `INGEST_TOKEN` keeps state/year data fresh; today it's static until re-run.
16. **☐ 👤 AirNow connector run.** Built; needs `AIRNOW_API_KEY` as a secret + a run. Contextual outdoor CO only — never shown as indoor risk.
17. **☐ 👤→🤖 CDC WONDER connector.** *Reclassified 2026-07-09 after checking the live API.* The WONDER API **cannot group or limit NVSS mortality by any geography** (Region/Division/State/County) — an explicit API restriction — so it can't give us state-by-year deaths (CDC Tracking already does). Its only unique strength is **national breakdowns by age/sex/race**, but (a) no `/content` copy renders any demographic/"who's most at risk" cut, and (b) the `metrics` schema has no demographic dimension (`indicator/geo/year` only). A plain national annual `co_deaths` from WONDER would also collide on the `(indicator, geo, year)` unique index with the CDC Tracking mortality we already ingest — two case definitions in one slot. **Blocked on a decision:** either (i) write equity content + add a demographic dimension to the schema (then I build the demographic ingest), or (ii) green-light a *national deaths-by-year trend* stored under a distinct trend indicator (real NVSS annual counts, ICD-10 T58/X47) — honest enrichment, no new copy, but polish not a launch blocker. Not buildable as originally framed without one of these.
18. **☐ 👤→🤖 Stories module.** *Reclassified 2026-07-09.* The `stories` table exists but is empty/unused. The fixed routes spec (`docs/07`) defines only `/story` (already built, verbatim editorial) and says *"Do not invent alternate paths"* — there is **no `/stories` route** and **no pre-written copy** for additional first-person/identifiable-victim accounts anywhere in `/content`. Building victim content from scratch would violate the honesty non-negotiable ("never invent a person"). **Blocked on content + a route decision:** you (or the planning chat) write the verbatim accounts into `/content` and decide the route; then I build the module against real content. Not code-buildable until that copy exists.
19. **☐ 🤖 Future enrichment sources (docs/08).** NPDS/AAPCC "exposures" tier, NEISS product-linkage content, NFPA incident data.

---

## Tier 4 — Legal / organizational (⚖️/👤 — the real launch blockers)

From `/docs/12_LEGAL_CHECKLIST.md`. None are code.

20. **◐ ⚖️ Privacy policy** finalized by a lawyer (plain-language draft live at `/about/privacy`).
21. **◐ ⚖️ Accessibility statement** finalized with a real contact (draft live at `/about/accessibility`).
22. **☐ 👤 Real contact address** on `/about`; **funding** and **board/advisory** placeholders filled once known.
23. **☐ 👤 `{{verify}}` facts.** Hero: "not one alarm in the entire complex" vs the NBC/CBS articles. Grants: confirm FEMA FP&S, HUD Healthy Homes, IHWAP, CDBG program pages are current.
24. **☐ 👤 501(c)(3) formation**, **manufacturer-firewall policy doc**, **terms of use** (parallel workstream; not a site-code blocker).

---

## Tier 5 — Manual QA (👤 — ~15 min, once)

25. **☐ 👤 Keyboard-only pass** of Home, /risk, /resources, /act (visible focus, nothing trapped, skip-link works).
26. **☐ 👤 Screen-reader spot check** of Home, a journey, and the risk tool.

---

### The two launch gates (from /handoff/README.md)
- **Fact-check gate:** ✅ everything shown is sourced — just finish item 8 so the national figures are the final set.
- **Legal gate:** ⚠️ items 20–21 (lawyer sign-off) are the true blocker to going public.

Automated a11y (all 27 routes), the dark-pattern audit, the honesty audit, and the
manufacturer-firewall check all **pass** as of Phase 10 — see LAUNCH_CHECKLIST.md.
