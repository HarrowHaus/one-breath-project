# Connecting the site to Cloudflare (Phase 0 deploy)

This is the exact, click-by-click for getting `main` to auto-deploy to a live
URL. You only do this once.

## Why Workers, not "Pages → Connect to Git"

Cloudflare's older Next.js-on-**Pages** adapter (`@cloudflare/next-on-pages`) is
now **deprecated**. Cloudflare's current, supported path is the **OpenNext
adapter** (`@opennextjs/cloudflare`), which deploys to **Cloudflare Workers** and
runs on the Node.js runtime — the runtime the Phase 2 internal API (Postgres)
needs. So we connect the repo through **Workers Builds**, not Pages. Everything
else about your workflow is the same: push to `main`, Cloudflare builds and
deploys, you get a live URL.

The adapter and its settings are already wired in this repo:
`open-next.config.ts`, `wrangler.jsonc` (`nodejs_compat`), and the `deploy` /
`preview` npm scripts. You don't touch those — you just connect the repo.

## Steps in the Cloudflare dashboard

1. Sign in at **dash.cloudflare.com**.
2. Left sidebar → **Workers & Pages** → **Create**.
3. Choose the **Workers** tab → **Import a repository** → **Connect to Git**,
   and authorize Cloudflare to see your GitHub if it asks.
4. Pick the repo **`HarrowHaus/one-breath-project`**.
5. In the build settings, enter exactly:
   - **Production branch:** `main`
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/` (leave as the repo root)
   - **Version command** (for non-production branches, if shown):
     `npx opennextjs-cloudflare build` and `npx wrangler versions upload`
6. **Environment variables:** none are needed for Phase 0. (Phase 2 adds
   `DATABASE_URL`, `ADMIN_PASSWORD`, and `AIRNOW_API_KEY` here as encrypted
   variables — see `.env.example` for the shape. Never put secrets in the repo.)
7. Click **Save and Deploy**.

The Worker is named `one-breath-project` (from `wrangler.jsonc`). The
compatibility date and the `nodejs_compat` flag also come from that file, so
there's nothing to toggle for them in the dashboard.

## Your live URL

After the first successful deploy, Cloudflare shows the live URL on the Worker's
page. It looks like:

```
https://one-breath-project.<your-account-subdomain>.workers.dev
```

Open it: you should see the placeholder site (the wordmark "The One Breath
Project", the tagline "Silent & Preventable", and the footer disclaimer). If you
see that, Phase 0 is live. From now on, every push to `main` redeploys it
automatically.

## Checking it yourself

- Home page: the URL above.
- Serverless API works: open `…workers.dev/api/health` → it returns
  `{"status":"ok","phase":0}`. That proves API routes run as functions, which is
  the foundation the Phase 2 internal API is built on.

## Local preview (optional, for developers)

- `npm run dev` — normal Next.js dev server.
- `npm run preview` — builds with the adapter and serves the actual Worker
  locally via Wrangler, so you can see exactly what Cloudflare will run.
- `npm run deploy` — builds and deploys from your machine (needs `wrangler login`).
