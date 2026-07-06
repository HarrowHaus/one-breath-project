# Phase 1 — Design system & global chrome

**Produces:** the site's look, header, footer, masthead.
**You need first:** nothing.

**Reference:** Build strictly to `/docs/06_DESIGN_SPEC.md` (exact colors, 18px base type, focus states) and `/docs/07_SITEMAP_AND_ROUTES.md` (the five nav routes). Titles/descriptions from `/content/metadata.md`.

## Instruction for Claude Code

```
Build the global design system and page chrome using USWDS tokens. Requirements:
- A calm, high-contrast, senior-legible theme: large base font size, strong visible focus states, WCAG 2.1 AA contrast. A restrained two-color palette on USWDS tokens.
- Header with a masthead reading "The One Breath Project" and the tagline "Silent & Preventable," plus a focused top nav of no more than five items: Learn, Data, Act, Resources, About.
- A footer on every page with: contact, a required plain-language disclaimer that this is an independent nonprofit and NOT a government site, and placeholder links for Privacy Policy and Accessibility Statement.
- Skip-to-content link and full keyboard navigability.
- Do NOT use the USWDS government banner or the "Identifier" component.
Also build the 404 page and system pages from /content/system-pages.md. Apply page titles/descriptions from /content/metadata.md as pages are created. Show me the header, footer, 404, and a sample content page on the live site. On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
The live site shows the masthead + tagline + five-item nav + footer with the not-government disclaimer, and tab/keyboard navigation works.
