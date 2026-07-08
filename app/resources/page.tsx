/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ResourceFinder } from "@/components/ResourceFinder";

// Resources hub + local finder. Copy verbatim from content/resources.md;
// metadata from content/metadata.md. The emergency block is always first and
// prominent; the finder reads only the internal API.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find carbon monoxide help near you",
  description:
    "Your nearest fire department, poison control, local requirements, and where to get an alarm or inspection.",
};

export default function ResourcesPage() {
  return (
    <div className="usa-section">
      <div className="grid-container">
        {/* Emergency block — ALWAYS first, above everything. */}
        <div className="usa-alert usa-alert--error obp-emergency" role="alert">
          <div className="usa-alert__body">
            <p className="usa-alert__text text-bold">
              If you think you're being poisoned right now, get outside into fresh
              air and call <a href="tel:911">911</a>. Don't wait to feel sure.
            </p>
            <p className="usa-alert__text">
              Poison Control (24/7): <a href="tel:18002221222">1-800-222-1222</a>.
            </p>
          </div>
        </div>

        <div className="usa-prose margin-top-3">
          <h1>Find carbon monoxide help near you</h1>
          <p className="obp-hero__lede">
            Tell us where you are and we'll show you who to call, what your area
            requires, and where to get an alarm or an inspection. Turn on location,
            or type your ZIP — either works.
          </p>
        </div>

        <ResourceFinder />

        <div className="usa-prose margin-top-4">
          <p>
            <Link href="/resources/grants-and-programs">
              Grants and programs for carbon monoxide safety
            </Link>{" "}
            — funding that can pay for alarms and inspections.
          </p>
        </div>
      </div>
    </div>
  );
}
