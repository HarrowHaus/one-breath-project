# Database setup (Phase 2A)

The site reads every figure from our own internal API, which reads from a
Postgres database. Phase 2A built the schema, the API, and the admin screen.
To make it live you connect a database — this is the one thing that needs your
account. Nothing here goes in the repo; secrets live in `.env` (local) and the
Cloudflare dashboard (production).

## 1. Create a Postgres database (Neon recommended)

Neon is the smoothest fit for Cloudflare Workers.

1. Sign up at **neon.tech**, create a project (any region near your users).
2. Copy the **pooled** connection string. It looks like:
   `postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/DB?sslmode=require`
3. Enable PostGIS (used by the resources map in Phase 8). In the Neon SQL editor run:
   `CREATE EXTENSION IF NOT EXISTS postgis;`

(Supabase also works; use its connection string. On Workers you may then want
Cloudflare Hyperdrive in front of it — ask and I'll wire it.)

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

A local Postgres works without Neon:

```
createdb one_breath && psql one_breath -c 'CREATE EXTENSION IF NOT EXISTS postgis;'
# .env: DATABASE_URL=postgres://USER@localhost:5432/one_breath
npm run db:migrate && npm run db:seed && npm run dev
```

## Notes

- **Driver:** the app uses `pg` (node-postgres) with its `pg-cloudflare` socket
  shim so the same code runs locally and on the Cloudflare Workers runtime
  (`nodejs_compat`). For higher traffic, Cloudflare Hyperdrive can pool
  connections in front of Neon — a drop-in later.
- **Never commit `.env`** or paste a connection string into the repo. `.env` is
  already git-ignored; production secrets live only in the Cloudflare dashboard.
- Without `DATABASE_URL` the site still builds and deploys; the API returns
  "no data" and figure lines stay hidden until the database is connected.
