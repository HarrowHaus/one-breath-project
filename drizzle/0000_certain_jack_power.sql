CREATE TABLE "metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"indicator" text NOT NULL,
	"geo_id" text DEFAULT 'US' NOT NULL,
	"geo_level" text DEFAULT 'nation' NOT NULL,
	"year" integer,
	"is_latest" boolean DEFAULT false NOT NULL,
	"value_display" text,
	"value_numeric" double precision,
	"ci_low" double precision,
	"ci_high" double precision,
	"source" text NOT NULL,
	"measured_or_modeled" text NOT NULL,
	"notes" text,
	"retrieved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"geo_id" text,
	"lat" double precision,
	"lng" double precision,
	"phone" text,
	"url" text,
	"notes" text,
	"source" text NOT NULL,
	"retrieved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"location" text,
	"summary" text,
	"media" text,
	"consent_status" text DEFAULT 'public_news' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "metrics_lookup_idx" ON "metrics" USING btree ("indicator","geo_id","year");--> statement-breakpoint
CREATE UNIQUE INDEX "metrics_latest_uniq" ON "metrics" USING btree ("indicator","geo_id") WHERE "metrics"."is_latest";--> statement-breakpoint
CREATE INDEX "resources_type_geo_idx" ON "resources" USING btree ("type","geo_id");