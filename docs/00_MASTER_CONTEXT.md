# 00 — Master Context

**Project:** The One Breath Project (working name). Tagline: **Silent & Preventable.**
An independent nonprofit carbon-monoxide (CO) safety, awareness, education, and advocacy hub. It is **not** a government site and **not** a manufacturer. Audiences: renters, landlords / liability-holders, seniors / caregivers, and the general public.

**Mission of the site:** move people from apathy about an invisible, preventable risk to action, using honest, sourced, behavioral-science-informed design.

## Stack
- **Frontend:** Next.js (React), U.S. Web Design System (USWDS) components + design tokens, Public Sans font.
- **Deploy:** Cloudflare Pages, auto-deploying from the GitHub `main` branch.
- **Data:** Postgres + PostGIS (external managed DB, e.g. Neon or Supabase). A single **internal cached API** that the whole site reads from. The site **never** calls external/government APIs directly at page load — data is ingested into our DB and served from our own API.
- **Charts:** a custom, non-technical data explorer (Observable Plot or visx) reading the internal API, plus Datawrapper embeds for editorial set-piece charts.
- **Maps:** MapLibre GL.
- **Content:** a Git-based headless CMS (e.g. Decap) so non-developers can edit content.
- **Search:** Pagefind. **Analytics:** privacy-first (e.g. Plausible/Fathom), no dark-pattern consent.

## Voice (civic journalist + advocacy)
Declarative and concrete. Lead with one real person before any statistic. Cite the source in the sentence. Honest floors are journalism, not hedging ("at least 400 — and likely more"). End every hard truth within sight of one easy action. Ban: throat-clearing, hedging stacks, symmetrical "on one hand/other hand" mush, windup conclusions, bullet-spam, passive voice where a person and a verb belong. Full guide: `01_VOICE_GUIDE.md`.

## The five NON-NEGOTIABLES (hard constraints)
1. **Honesty:** every figure tagged "Measured" or "Modeled"; every claim traceable to a source. Never invent a number, a person, or a real-time death counter. Modeled data is labeled modeled.
2. **No dark patterns:** no pre-ticked boxes, no forced continuity, no confirmshaming, no fake urgency/scarcity, no concealed costs, no disguised ads. Opt-out as easy as opt-in. Full list: `02_DO_NOT_BUILD.md`.
3. **Accessibility:** WCAG 2.1 AA minimum (USWDS baseline + real testing). Senior-legible defaults.
4. **Manufacturer firewall:** the site never sells and never names a product brand in editorial. Any "find protection" step lists ALL qualifying options and discloses any relationship in plain language. Editorial and commerce stay walled, and the wall is visible.
5. **Not-government:** brand clearly as an independent nonprofit. Do NOT use the federal `.gov` banner or the USWDS "Identifier" component. Borrow USWDS's register and accessibility, not the government identity.

## Hero story (the site's emotional anchor)
Calvin Witherspoon Jr. and Derrick Roper died in their sleep at Allen Benedict Court, a public housing complex in Columbia, SC, in January 2019; none of the apartments had CO detectors. Federal law didn't require them in public housing. After an NBC News investigation, HUD moved to require CO alarms in about 3 million units. Use only publicly reported, attributed facts. Full sourced copy: `03_HERO_DOSSIER.md`.

## Honest national frame (for scale, always sourced/tagged)
Unintentional CO poisoning kills more than 400 people in the U.S. and sends over 100,000 to emergency departments every year (CDC). Deaths are the small tip of a much larger, under-counted harm pyramid. Never inflate; reframe honestly (preventability, full pyramid, undercount, personal conditional risk). See `04_BEHAVIORAL_ARCHITECTURE.md`.
