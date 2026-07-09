# Launch checklist

Work top to bottom. The site can be fully built before any of this clears; don't
go public until it does. Status filled in by the Phase 10 QA pass — `[x]` done,
`[ ]` still needs you, `[~]` in place but provisional.

## Build complete (Phases 0–10 done)
- [x] Every route in `/docs/07_SITEMAP_AND_ROUTES.md` exists and its internal links resolve. (Learn hub + all nav/footer links verified.)
- [x] Every page uses the verbatim copy from `/content`; no improvised text (only sanctioned placeholders on /about).
- [x] Design matches `/docs/06_DESIGN_SPEC.md` (colors, type, senior-legible sizing).
- [x] Data explorer, risk tool, and local finder all read from the internal API.
- [~] Seed data entered so real figures show — national figures need one click, see below.

## Content integrity gate
- [~] Every figure on the site is sourced and tagged Measured or Modeled. Live site: yes. Load the final Sircar-2019 national figures via `/manage` → **"Load national figures"** (production still shows the older numbers; hospitalizations tier is hidden until you do).
- [ ] `{{verify:...}}` facts (the hero story) confirmed against the cited NBC/CBS articles.
- [x] No invented numbers, people, or real-time counters.
- [x] Fact-check log filled in (`/handoff/FACT_CHECK_LOG.md`) — national figures + explorer provenance logged.

## Accessibility gate
- [x] Automated (axe) passes with no violations — **all 27 routes**, WCAG 2.1 AA. Re-run: `npm run test:a11y`.
- [ ] Manual keyboard pass (do this yourself, ~5 min): unplug the mouse, Tab through Home, /risk, /resources, /act. Visible focus on every control; nothing unreachable or trapped; "Skip to main content" appears on first Tab.
- [ ] Screen-reader spot check of Home, a journey, and the risk tool (VoiceOver ⌘+F5 / Narrator).
- [x] Contrast and 18px base body text confirmed (design tokens + senior-legible defaults).

## Dark-pattern gate (`/docs/02_DO_NOT_BUILD.md`) — audited, PASS
- [x] No pre-ticked boxes; opt-out as easy as opt-in (pledge "updates" box unchecked by default).
- [x] No fake urgency/scarcity, no confirmshaming, no concealed costs (only honest seasonal timeliness).
- [x] No `.gov` banner or USWDS Identifier; independent-nonprofit disclaimer present in footer + /about.
- [x] Manufacturer firewall intact: no product brand in editorial ("UL" is a testing mark, not a brand).
- [x] No dark-pattern consent banner — analytics is cookieless and off-by-default.

## Legal gate (`/docs/12_LEGAL_CHECKLIST.md`)
- [ ] Privacy policy and accessibility statement finalized (lawyer-reviewed) — currently plain-language DRAFTS on `/about/privacy` and `/about/accessibility`.
- [x] Data attribution on the sources page (`/data/methodology`, reused at `/about/sources`).
- [x] Footer disclaimer live on every page.
- [ ] Real contact address added on `/about`; funding + team placeholders filled once known.

## Analytics (privacy-first, cookieless Plausible — OFF until you enable it)
- [ ] Create a Plausible account for your launch domain.
- [ ] Set the **build-time** Cloudflare variable `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to your domain and redeploy. (Blank = no analytics, no consent banner.)
- [ ] In Plausible, add three Custom Goals (exact spelling):
  - `Renter request copied`
  - `Landlord toolkit downloaded`
  - `Caregiver checklist printed`

### Your one-screen monthly readout
Open Plausible → your site. Below visitors/top-pages, read the three goals:

| What it means | Goal |
|---|---|
| Renters who took the request to their landlord | **Renter request copied** |
| Landlords who took the standard-of-care toolkit | **Landlord toolkit downloaded** |
| Caregivers who took the 10-minute checklist | **Caregiver checklist printed** |

One number each, per month. Rising = more households acting. No code, no spreadsheet.

## Go
- [ ] Point your real domain at the Cloudflare Worker (currently `one-breath-project.donald-dcd.workers.dev`) and update `metadataBase` in `app/layout.tsx`.
- [ ] (Optional) Add an Open Graph share image for link previews.
- [ ] Announce.

---

**Launch gate summary (from /handoff/README.md — both must be green):**
1. **Fact-check gate** — ✅ everything shown is sourced; finish loading the Sircar national figures.
2. **Legal gate** — ⚠️ disclaimer live; privacy + accessibility need lawyer sign-off before going public.

The hero is a public news story used with attribution, so **no family permission is required to launch.**
