# Phase 0 — Project setup, guardrails, live URL

**Produces:** an empty but live, auto-deploying site with guardrails in place.
**You need first:** a GitHub account (this repo pushed to it) and a Cloudflare account.

**Reference:** `/GETTING_STARTED.md` (human setup), `/.env.example` (secrets shape), `/docs/06_DESIGN_SPEC.md`, `/docs/07_SITEMAP_AND_ROUTES.md`.

## Instruction for Claude Code

```
Set up a Next.js (React, App Router) app for The One Breath Project inside this repo and get it deploying to Cloudflare Pages. Steps:
1. Scaffold a current Next.js app in this repository (do not remove /docs, /handoff, /CLAUDE.md, or .claude/). Consult current Cloudflare Pages + Next.js docs for the correct setup and adapter so both static pages and serverless API routes work on Cloudflare (the internal API in Phase 2 will run as serverless functions; the database is external).
2. Connect the GitHub repo to Cloudflare Pages so every push to `main` auto-deploys to a live URL. Tell me exactly which settings to click in the Cloudflare dashboard, and give me the live URL.
3. Install and wire up the U.S. Web Design System (USWDS) per its current docs (designsystem.digital.gov). Set Public Sans as the base font.
4. Add automated accessibility checking (axe) to the build so accessibility regressions fail the build.
5. Add a Git-based headless CMS (e.g. Decap) configured but empty, so non-developers can edit content later.
6. Confirm the guardrail docs are present and that you've read them: /docs/00_MASTER_CONTEXT.md, /docs/01_VOICE_GUIDE.md, /docs/02_DO_NOT_BUILD.md.
Do not build any real pages yet. When the app builds and deploys cleanly, hand the commit to the git-committer sub-agent to push to main.
```

## Done when
You can open your live Cloudflare Pages URL and see a running placeholder site, the accessibility check runs on each build, and `main` has the initial commit (pushed by the git sub-agent, no PR).
