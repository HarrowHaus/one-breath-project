# Launch checklist

Work top to bottom. The site can be fully built before any of this clears; don't go public until it does.

## Build complete (Phases 0–10 done)
- [ ] Every route in `/docs/07_SITEMAP_AND_ROUTES.md` exists and its internal links resolve.
- [ ] Every page uses the verbatim copy from `/content`; no improvised text.
- [ ] Design matches `/docs/06_DESIGN_SPEC.md` (colors, type, senior-legible sizing).
- [ ] Data explorer, risk tool, and local finder all read from the internal API.
- [ ] Seed data entered (`/docs/08_DATA_DICTIONARY.md`) so real figures show.

## Content integrity gate
- [ ] Every figure on the site is sourced and tagged Measured or Modeled.
- [ ] `{{verify:...}}` facts (the hero story) confirmed against the cited articles.
- [ ] No invented numbers, people, or real-time counters.
- [ ] Fact-check log filled in (`/handoff/FACT_CHECK_LOG.md`).

## Accessibility gate
- [ ] Automated (axe) passes with no critical errors.
- [ ] Manual keyboard pass: everything reachable and operable, visible focus.
- [ ] Screen-reader spot check of home, a journey, and the risk tool.
- [ ] Contrast and 18px base body text confirmed.

## Dark-pattern gate (`/docs/02_DO_NOT_BUILD.md`)
- [ ] No pre-ticked boxes; opt-out as easy as opt-in.
- [ ] No fake urgency/scarcity, no confirmshaming, no concealed costs.
- [ ] No `.gov` banner or USWDS Identifier; independent-nonprofit disclaimer present.
- [ ] Manufacturer firewall intact: no product brand in editorial.

## Legal gate (`/docs/12_LEGAL_CHECKLIST.md`)
- [ ] Privacy policy and accessibility statement finalized (lawyer-reviewed).
- [ ] Data attribution on the sources page.
- [ ] Footer disclaimer live.

## Analytics
- [ ] Privacy-first analytics live; the conversions in `/docs/10_MEASUREMENT.md` are firing.

## Go
- [ ] Point the domain (or keep the Cloudflare subdomain for now).
- [ ] Announce.
