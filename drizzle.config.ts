import { defineConfig } from "drizzle-kit";

// Migrations are generated from lib/db/schema.ts and applied with
// `npm run db:migrate` against whatever DATABASE_URL points at (local Postgres
// in dev, Neon in production).
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
