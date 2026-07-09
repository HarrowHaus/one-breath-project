/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { PrintButton } from "@/components/PrintButton";

// Landlord / owner journey. Copy verbatim from content/journeys/landlord.md;
// metadata from content/metadata.md. Leads with defensibility, not fear.
export const metadata: Metadata = {
  title: "Landlords: meet the carbon monoxide standard of care",
  description:
    'After a poisoning, the law asks one question. Here\'s how to answer "yes" — the simple, inexpensive way.',
};

const OBJECTIONS = [
  {
    title: "Aren't smoke detectors enough?",
    content: (
      <p>
        No. Smoke alarms don't detect carbon monoxide, and carbon monoxide gives
        no smoke, smell, or warning. They're different sensors for different
        dangers.
      </p>
    ),
  },
  {
    title: "My building is all electric.",
    content: (
      <p>
        Lower risk, not zero. An attached garage or a shared wall with a unit that
        burns fuel can still bring carbon monoxide in. Check your local code — many
        require alarms based on the garage, not just the appliances.
      </p>
    ),
  },
  {
    title: "Isn't this the tenant's responsibility?",
    content: (
      <p>
        Installation and maintenance of the alarms and appliances is generally the
        owner's. Tenants may be responsible for not disabling them. Providing them
        is on you — and it's what "reasonable owner" means.
      </p>
    ),
  },
  {
    title: "What does compliance actually take?",
    content: (
      <p>
        Alarms near sleeping areas, an annual appliance inspection, and records.
        Start with the toolkit below and your local requirements.
      </p>
    ),
  },
];

export default function LandlordsPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>
          After a poisoning, the law asks one question: did the owner do what a
          reasonable owner would do?
        </h1>
        <p className="obp-hero__lede">
          Everything else follows from your answer. Here is what "yes" looks like —
          and how to be able to say it before anyone has to ask.
        </p>

        <h2>The standard of care — plain version</h2>
        <p>Two things, documented:</p>
        <ol>
          <li>
            <strong>Working carbon monoxide alarms</strong> near the sleeping areas
            of every unit with a fuel-burning appliance or an attached garage —
            installed, tested, and on a replacement schedule.
          </li>
          <li>
            <strong>Annual inspection</strong> of furnaces, water heaters, and
            other gas appliances by a qualified technician, with records kept.
          </li>
        </ol>
        <p>
          Do those two things and keep the paperwork, and you've met the standard
          almost anywhere in the country. Many states now require the alarms
          outright.
        </p>

        <h2>Why this is the cheap side of the ledger</h2>
        <p>
          An alarm costs about $20. An inspection is routine. A carbon monoxide
          death or injury in one of your units is a lawsuit, a headline, and a
          life. The residents of Allen Benedict Court in Columbia, South Carolina
          sued after two men died in a building with no alarms; the case reshaped
          federal housing rules. The protection is the inexpensive part.
        </p>

        <h2>Objections</h2>
        <Accordion items={OBJECTIONS} />

        <h2 className="margin-top-4">Actions</h2>
        <p>
          <PrintButton label="Download the landlord toolkit" event="Landlord toolkit downloaded" />
        </p>
        <p>
          <Link href="/resources">Find a qualified installer near you</Link>.
        </p>
      </div>
    </article>
  );
}
