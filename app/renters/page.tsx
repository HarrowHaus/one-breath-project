/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { RequestGenerator } from "@/components/RequestGenerator";

// Renter journey. Copy verbatim from content/journeys/renter.md; metadata from
// content/metadata.md. Leads with agency, ends with the request generator.
export const metadata: Metadata = {
  title: "Renters: your right to a carbon monoxide alarm",
  description:
    "You can't rewire the building, but you're not powerless. Know your rights and send your landlord a ready-made request.",
};

export default function RentersPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>You can't rewire your building. But you are not powerless.</h1>
        <p className="obp-hero__lede">
          You can't replace the furnace. But in most places, your landlord is
          responsible for providing working carbon monoxide alarms — and you have
          the right to ask, in writing, and to get an answer.
        </p>

        <h2>What you're actually asking for</h2>
        <p>
          A working carbon monoxide alarm near where you sleep, and a furnace or
          water heater that someone qualified has actually checked. That's the
          standard. It's cheap, it's normal, and it's often the law where you live.
        </p>

        <h2>The request — pre-written. Edit and send.</h2>
        <p className="text-bold">
          Copy this, add your details, and send it to your landlord by email or
          text. Keep a copy — a written request is a record.
        </p>
        <RequestGenerator />

        <h2 className="margin-top-4">If your landlord says no or goes quiet</h2>
        <p>
          You have options, and you're not the first to use them. Your local fire
          department or code-enforcement office can tell you what your city or
          state requires, and many places require CO alarms in rentals.{" "}
          <Link href="/resources">Find your local contacts here</Link>.
        </p>

        <h2>The turn to action</h2>
        <p>
          Carbon monoxide is one of the few dangers you can shut out of a home
          completely. The ask above takes two minutes. Send it tonight.
        </p>
      </div>
    </article>
  );
}
