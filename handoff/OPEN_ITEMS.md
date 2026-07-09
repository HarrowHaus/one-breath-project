# Open items — master backlog

Everything outstanding after Phases 0–10, in priority order. Compiled from a full
code + docs sweep (TODO/placeholder markers, unwired tokens, docs/10 + docs/12,
SEO, and the deferrals noted across the build).

**Owner key:** 🤖 = I can do it in code · 👤 = your decision / data / account · ⚖️ = lawyer.
**Status:** ☐ open · ◐ partial/provisional · ✅ done.

---

## Tier 1 — I can do now (code, no external dependencies)

These need nothing from you. This is "the start of the list."

1. **☐ 🤖 SEO: `sitemap.xml` + `robots.txt`.** No `app/sitemap.ts` / `app/robots.ts` exist. Add a sitemap of the public routes and a robots file that allows crawling but disallows `/manage` and `/api`.
2. **☐ 🤖 Noindex non-public pages.** `/styleguide` (dev preview) and `/manage` should carry `noindex`. `/manage` and `/thank-you` already do; add it to `/styleguide` (or drop the route before launch).
3. **☐ 🤖 Instrument the rest of the docs/10 conversions.** Today only 3 of the named goals fire (renter request, landlord toolkit, caregiver checklist). Still to wire: **risk-tool completed**, **alarm-test reminder set** (the .ics), **pledge added**, **landlord → installer click**.
4. **☐ 🤖 Open Graph share image.** Only `icon.svg` exists. Add a branded OG image so shared links preview well (the Share buttons on /act especially).
5. **☐ 🤖 Parameterize the site URL.** `metadataBase` is hard-coded to the `workers.dev` URL. Move it to an env var so the custom-domain swap is a config change, not a code edit.
6. **☐ 🤖 Harden the DB read path.** Uncached metric reads still occasionally return Cloudflare 1101 (transient Hyperdrive→Supabase drop). Add a single retry on connection error before falling back, so a blip is invisible.
7. **☐ 🤖 Cleanup.** Stale comment in `app/layout.tsx` ("footer links — target pages arrive in later phases"); those pages now exist.

---

## Tier 2 — I can do, but needs your input or an account first

8. **◐ 👤 Load the final national figures to production.** Live site still shows the *older* numbers and the harm-pyramid **hospitalization tier is dark**. Fix: `/manage` → **"Load national figures (Sircar 2019)."** (I'd do it directly but the Supabase connector is offline this session.)
9. **☐ 👤 Turn on analytics.** Cookieless Plausible is wired and off-by-default. Needs: a Plausible account, the `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` build var on Cloudflare, and the 3 (soon 7) goals defined. See LAUNCH_CHECKLIST §4.
10. **☐ 👤 Custom domain.** Point your real domain at the Worker (currently `one-breath-project.donald-dcd.workers.dev`) and set the site-URL var from item 5.
11. **☐ 🤖/👤 Fire-department geocoding → map + radius search.** USFA rows have addresses but no lat/lng, so `/resources` matches by ZIP/address and there's no map. Backfill coordinates (Census geocoder) to unlock a MapLibre map and true "nearest" distance. I can do the pipeline; it's egress-dependent like the CDC connector.
12. **☐ 👤 Enter curated local resources.** The finder hides rows we don't have: **gas-utility emergency lines, state fire marshals, installers, local CO-code summaries, downloadable toolkits.** Enter via `/manage` as you gather them (or give me a CSV).
13. **☐ 🤖/👤 Landlord + advocacy toolkit assets.** `{{local:toolkit file}}` and `{{local:advocacy_toolkit}}` have no real file — currently print-to-PDF / "on the way." Create the one-pager PDFs when ready.

---

## Tier 3 — Data pipeline enrichment (optional, post-launch OK)

14. **☐ 👤 `CDC_TRACKING_TOKEN`.** Free token from CDC removes the API rate limit so `co_deaths` ingests in a single click instead of sometimes needing a re-run.
15. **☐ 👤 Schedule the connectors.** A Cloudflare Cron / GitHub Action POSTing the ingest endpoint with `INGEST_TOKEN` keeps state/year data fresh; today it's static until re-run.
16. **☐ 👤 AirNow connector run.** Built; needs `AIRNOW_API_KEY` as a secret + a run. Contextual outdoor CO only — never shown as indoor risk.
17. **☐ 🤖 CDC WONDER connector.** The deferred 4th connector — mortality by age/sex/region for the "who's most at risk" and equity content.
18. **☐ 🤖 Stories module.** The `stories` table exists but is empty/unused; the identifiable-victim module (Phase 5, item 4) beyond `/story` was never built.
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
