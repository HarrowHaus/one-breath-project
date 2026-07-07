# Getting Started (zero to your first live page)

You don't need to code. You create a few free accounts, upload this folder, and paste instructions to Claude Code. Follow these in order.

## Step 1 — Put this repo on GitHub
1. Create a free account at github.com if you don't have one.
2. Make a new repository (name it `one-breath-project`, keep it private for now).
3. Upload the contents of this folder to it. (In the GitHub web uploader, drag the files in; or in Claude Code, tell it: "Push this project to my GitHub repo `[your-repo-URL]` on the `main` branch.")

## Step 2 — Connect Cloudflare
1. Create a free account at cloudflare.com.
2. Connect the repo through **Workers Builds** (Cloudflare's current Next.js path — the old Pages adapter is deprecated). The exact click-by-click, build commands, and where your live URL appears are in **`handoff/CLOUDFLARE_DEPLOY.md`**.
3. You don't need to know the build settings — Phase 0 wired them into the repo, and the deploy doc tells you exactly what to enter. For now, just connect the repo.

## Step 3 — Open Claude Code on this repo
- Desktop (Windows) or the mobile app, pointed at the GitHub repo.
- It automatically reads `CLAUDE.md`, so it starts with the rules, the git workflow, and the non-negotiables.

## Step 4 — Run Phase 0
Paste this:
> Read `CLAUDE.md`, then `/docs/00_MASTER_CONTEXT.md`, `/docs/06_DESIGN_SPEC.md`, and `/docs/07_SITEMAP_AND_ROUTES.md`. Then do Phase 0 — follow `/handoff/phases/PHASE_00_setup.md`. When it builds and deploys cleanly, hand the commit to the git-committer sub-agent.

Claude Code will scaffold the site, connect it to Cloudflare, and give you a **live URL**. That's your first win.

## Step 5 — Walk the phases in order
For each one, paste:
> Do Phase N — follow `/handoff/phases/PHASE_0N_*.md`. Use the copy in `/content` verbatim. When the "Done when" is met and the build passes, hand the commit to the git-committer sub-agent.

Check the **"Done when"** line yourself (usually: look at the live URL). Then move on. Order and details: `/handoff/README.md`.

## Accounts you'll create along the way (mostly free)
GitHub · Cloudflare Pages · Neon or Supabase (database, Phase 2) · a free AirNow API key (Phase 2) · the USFA fire-department CSV download (Phase 2) · privacy-first analytics (Phase 10). A domain name can wait until you pick the real nonprofit name.

## If something goes wrong
See `/handoff/TROUBLESHOOTING.md`. The golden move: ask Claude Code to *show you the thing working on the live site*. If you can't see it, it isn't done — and don't let it save broken work.

## The two rules you'll never break
1. Secrets (keys, passwords) go in `.env` or the Cloudflare dashboard — **never** in the repo. (`.env.example` shows the shape.)
2. You don't type git commands. The Haiku sub-agent commits and pushes to `main` after each successful phase. No pull requests.
