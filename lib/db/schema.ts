import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Core tables per /docs/05_DATA_PLATFORM.md. Content is delegated to the CMS
// (Decap), so no `content` table here. PostGIS lives on the production database
// (Neon) and is used by the resources finder in Phase 8; Phase 2A stores plain
// lat/lng.

// Every figure the site can show. Each row is tagged Measured/Modeled and
// carries its source and retrieval date — the honesty non-negotiable, in the schema.
export const metrics = pgTable(
  "metrics",
  {
    id: serial("id").primaryKey(),
    indicator: text("indicator").notNull(), // co_deaths | co_er_visits | co_hospitalizations
    geoId: text("geo_id").notNull().default("US"), // "US" or FIPS/name
    geoLevel: text("geo_level").notNull().default("nation"), // nation | state | county
    year: integer("year"), // a specific year, or null for the current "latest" headline
    isLatest: boolean("is_latest").notNull().default(false),
    valueDisplay: text("value_display"), // e.g. "more than 400" — read naturally in a sentence
    valueNumeric: doublePrecision("value_numeric"), // e.g. 400, if the schema needs a number
    ciLow: doublePrecision("ci_low"),
    ciHigh: doublePrecision("ci_high"),
    source: text("source").notNull(), // e.g. "CDC"
    measuredOrModeled: text("measured_or_modeled").notNull(), // "Measured" | "Modeled" | "Modeled (national estimate)"
    notes: text("notes"),
    retrievedAt: timestamp("retrieved_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("metrics_lookup_idx").on(t.indicator, t.geoId, t.year),
    // At most one "latest" row per indicator+geography — the upsert target for seeds.
    uniqueIndex("metrics_latest_uniq")
      .on(t.indicator, t.geoId)
      .where(sql`${t.isLatest}`),
  ],
);

// Places and contacts the site points people to (fire departments, poison
// control, utilities, programs). Provenance on every record.
export const resources = pgTable(
  "resources",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(), // fire_department | poison_control | gas_utility | installer | program
    name: text("name").notNull(),
    geoId: text("geo_id"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    phone: text("phone"),
    url: text("url"),
    notes: text("notes"),
    source: text("source").notNull(),
    retrievedAt: timestamp("retrieved_at", { withTimezone: true }).notNull().defaultNow(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
  },
  (t) => [index("resources_type_geo_idx").on(t.type, t.geoId)],
);

// Human stories (the hero dossier is handled as editorial content; this table
// is here for the schema in /docs/05 and future first-person accounts).
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  name: text("name"),
  location: text("location"),
  summary: text("summary"),
  media: text("media"),
  consentStatus: text("consent_status").notNull().default("public_news"),
});
