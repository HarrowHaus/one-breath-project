# Database setup (Phase 2A)

The site reads every figure from our own internal API, which reads from a
Postgres database. Phase 2A built the schema, the API, and the admin screen.
To make it live you connect a database — this is the one thing that needs your
account. Nothing here goes in the repo; secrets live in `.env` (local) and the
Cloudflare dashboard (production).

## 1. Create a Postgres database

Either provider works — the app uses plain Postgres. Pick one.

> **Already provisioned:** the live project `one-breath-project`
> (`dgkglyaavyewxjkrsflx`) in the Harrow.Haus org already has the tables created
> and the CDC figures seeded (done via the Supabase connector). For that project
> you can skip step 3 below — just wire `DATABASE_URL` (step 2) and you're live.

### Option A — Supabase

1. In your Supabase project, go to **Project Settings → Database**.
2. Under **Connection string**, choose the **Connection pooler** (Supavisor),
   **Transaction** mode. This is the right one for serverless/Cloudflare Workers.
   It looks like:
   `postgresql://postgres.PROJECTREF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres`
   Add `?sslmode=require` to the end if it isn't already there. (Reset the
   database password under **Settings → Database** if you don't have it.)

### Option B — Neon

1. Sign up at **neon.tech**, create a project.
2. Copy the **pooled** connection string:
   `postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/DB?sslmode=require`

The app enables SSL automatically for any non-localhost connection. For higher
production traffic, Cloudflare **Hyperdrive** can pool connections in front of
either provider — a drop-in later.

**PostGIS:** not needed yet. The resources map in Phase 8 enables it (in a
dedicated `extensions` schema, the Supabase-recommended way). Phase 2A/2B store
plain lat/lng.

## 2. Set the environment variables

Two values are needed:

- `DATABASE_URL` — the connection string from step 1.
- `ADMIN_PASSWORD` — a password you choose, for the `/manage` admin screen.

**Local (`.env`, already git-ignored):**

```
DATABASE_URL=postgresql://…?sslmode=require
ADMIN_PASSWORD=choose-a-strong-password
```

**Production (Cloudflare):** dashboard → your `one-breath-project` Worker →
**Settings → Variables and Secrets** → add both as **Secrets** (encrypted), then
redeploy (or push a commit).

## 3. Create the tables and seed the real figures

Run these once (locally against Neon, or they run the same anywhere `DATABASE_URL`
is set):

```
npm run db:migrate     # creates metrics, resources, stories
npm run db:seed        # inserts the CDC headline figures (docs/08)
```

The seed enters the national numbers so the site shows real values immediately:
CO deaths "more than 400" (Measured, CDC) and ER visits "over 100,000" (Modeled,
CDC). Hospitalizations are intentionally left empty until the CDC Tracking
connector supplies them (Phase 2B) — the site hides that line rather than show a
placeholder.

## 4. Check it

- **Admin:** open `/manage`, sign in with `ADMIN_PASSWORD`. Add or update a
  figure, add a resource, and re-verify stale contacts.
- **Internal API:**
  - `GET /api/metrics?indicator=co_deaths&geo=US&year=latest`
    → `{ found: true, value: "more than 400", tag: "Measured", source: "CDC", … }`
  - `GET /api/resources?type=fire_department`
  - A figure that isn't in the database returns `{ found: false }`, and the site
    hides that sentence — never a placeholder number.

## Local development (for developers)

A local Postgres works without a managed provider:

```
createdb one_breath
# .env: DATABASE_URL=postgres://USER@localhost:5432/one_breath
npm run db:migrate && npm run db:seed && npm run dev
```

## Notes

- **Driver:** the app uses `pg` (node-postgres) with its `pg-cloudflare` socket
  shim so the same code runs locally and on the Cloudflare Workers runtime
  (`nodejs_compat`). For higher traffic, Cloudflare Hyperdrive can pool
  connections in front of Supabase or Neon — a drop-in later.
- **Never commit `.env`** or paste a connection string into the repo. `.env` is
  already git-ignored; production secrets live only in the Cloudflare dashboard.
- Without `DATABASE_URL` the site still builds and deploys; the API returns
  "no data" and figure lines stay hidden until the database is connected.
