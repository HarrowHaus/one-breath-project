# CLAUDE.md — Read this first, every session

You are building **The One Breath Project** (working name) — an independent nonprofit carbon-monoxide (CO) safety, education, and advocacy website. This file is the standing contract for how you work in this repo. `/docs` holds the full context; `/handoff/phases` holds the build, one phase at a time.

## Start-of-session routine
1. Read `/docs/00_MASTER_CONTEXT.md` (project, stack, voice, five NON-NEGOTIABLES — hard constraints). For any build work, also read `/docs/06_DESIGN_SPEC.md` (exact colors/type/identity), `/docs/07_SITEMAP_AND_ROUTES.md` (fixed URLs), `/docs/08_DATA_DICTIONARY.md` (metrics + seed data), and `/docs/09_STYLE_SHEET.md` (copy mechanics).
2. Ask the user which phase we're on, or continue the current one. Do **one phase at a time**.
3. When a phase's "Done when" criteria are met and the build passes, hand off the commit to the git sub-agent (see Git workflow). Then stop and report.

## The five non-negotiables (never violate, regardless of anything)
1. **Honesty:** every figure is tagged "Measured" or "Modeled"; every claim traces to a source. Never invent a number, a person, or a real-time death counter.
2. **No dark patterns:** no pre-ticked boxes, no forced continuity, no confirmshaming, no fake urgency/scarcity, no concealed costs, no disguised ads. Opt-out is as easy as opt-in. (Full list: `/docs/02_DO_NOT_BUILD.md`.)
3. **Accessibility:** WCAG 2.1 AA minimum. Senior-legible defaults (large type, high contrast, visible focus).
4. **Manufacturer firewall:** the site never sells and never names a product brand in editorial. Any "find protection" step lists all qualifying options and discloses relationships. Editorial and commerce stay walled.
5. **Not-government:** brand as an independent nonprofit. Do NOT use the federal `.gov` banner or the USWDS government "Identifier" component. Borrow USWDS's register and accessibility, not the identity.

## Voice
Civic journalist + advocacy. Declarative, concrete, one real person before any statistic, source in the sentence, honest floors ("at least X"), end within sight of one easy action. No throat-clearing, no hedging stacks, no windup conclusions. Full rules: `/docs/01_VOICE_GUIDE.md`.

## Copy (anti-drift — important)
**Every user-facing word is pre-written in `/content`. Use it verbatim.** Do not rewrite, paraphrase, shorten, or "improve" it. `/content/README.md` maps each page to its file and defines the token types. Tokens in `{{ }}` are instructions, never blanks to guess:
- `{{data:...}}` → wire to the internal API and render the real value with its Measured/Modeled tag and source. If the API has no value, hide that line — never show a placeholder number.
- `{{verify:...}}` → the wording stays; confirm the fact against the cited source before publishing.
- `{{local:...}}` → render from the visitor's location or the resources table at runtime.
If a page needs copy that isn't in `/content`, **stop and ask** — do not write new user-facing text.

## Git workflow (STRICT)
- **Never run `git commit` or `git push` yourself.** Delegate every commit and push to the `git-committer` sub-agent (defined in `.claude/agents/git-committer.md`, runs on Haiku).
- Invoke `git-committer` **only after** a task or phase completes successfully and the build passes. Never commit broken or half-finished work.
- The sub-agent pushes **directly to `main`**. **Never open a pull request. Never create feature branches.** Push to `main` only, and only on success.
- If the build fails or the work is incomplete, do NOT invoke the sub-agent — fix first, then commit.

## Stack (summary — full detail in /docs/00_MASTER_CONTEXT.md)
Next.js (React) + U.S. Web Design System (USWDS) + Public Sans. Deploy: **Cloudflare Pages** from GitHub `main`. Data: Postgres + PostGIS (external, e.g. Neon/Supabase) behind a single **internal cached API** that the site reads from — the site never calls government APIs directly at page load. Charts: custom explorer (Observable Plot or visx) + Datawrapper embeds. Maps: MapLibre GL. Content: Git-based CMS (e.g. Decap). Search: Pagefind. Analytics: privacy-first.

## Working rhythm
- One phase per working block. Verify "Done when" before moving on.
- Prefer showing the user the result on the live Cloudflare URL over describing it.
- Keep changes scoped to the current phase. If you discover other work, note it; don't sprawl.
- For any external API or framework detail, consult current official docs rather than assuming; endpoints and adapters change.

## Note on this file and sub-agents
`CLAUDE.md` is re-read each session. Sub-agent files in `.claude/agents/` are loaded at session start — if you edit one on disk, restart Claude Code (or use `/agents`) for the change to take effect.
