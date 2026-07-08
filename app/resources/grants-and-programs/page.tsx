import type { Metadata } from "next";
import Link from "next/link";

// Grants & programs directory. Copy verbatim from content/resources.md;
// metadata from content/metadata.md. Short, accurate blurbs; we link to the
// official program pages and tell people to confirm eligibility there.
export const metadata: Metadata = {
  title: "Grants and programs for carbon monoxide safety",
  description:
    "Funding that can pay for alarms and inspections — for landlords, housing authorities, and advocates.",
};

export default function GrantsPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Grants &amp; programs</h1>
        <p className="obp-hero__lede">
          For landlords, housing authorities, and advocates. Short, accurate
          blurbs — verify current program details before relying on them.
        </p>

        <h2>FEMA Fire Prevention &amp; Safety Grants</h2>
        <p>
          Federal grants that can fund fire- and carbon-monoxide-safety projects,
          including alarms and public education.
        </p>

        <h2>HUD Healthy Homes</h2>
        <p>
          Funding aimed at making housing safer and healthier, which can include
          carbon monoxide protection.
        </p>

        <h2>State weatherization assistance (e.g. IHWAP in Illinois)</h2>
        <p>
          Programs that improve low-income homes and can address
          combustion-appliance safety.
        </p>

        <h2>Community Development Block Grants (CDBG)</h2>
        <p>
          Flexible local funding that communities can direct toward housing safety
          improvements.
        </p>

        <p className="text-bold margin-top-4">
          Note: program rules and availability change. We link to the official
          program pages; confirm eligibility there.
        </p>

        <p className="margin-top-3">
          <Link href="/resources">Back to Find help near you</Link>
        </p>
      </div>
    </article>
  );
}
