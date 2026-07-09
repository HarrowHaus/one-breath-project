/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { Checklist } from "@/components/Checklist";

// Senior / caregiver journey. Copy verbatim from
// content/journeys/senior-caregiver.md; metadata from content/metadata.md.
// Leads with the myth-buster, uses large type and a printable checklist.
export const metadata: Metadata = {
  title: "Seniors & caregivers: you can't smell carbon monoxide",
  description:
    "Most older adults think they'd notice it. They wouldn't. A ten-minute checklist that protects the people you love.",
};

const CHECKLIST = [
  "Is there a carbon monoxide alarm on every level, near where people sleep? If not, that's the first buy.",
  "Press the test button. Does it sound? If not, replace the batteries — or the alarm.",
  "How old is the alarm? Most need replacing every 5–7 years. Check the date on the back.",
  "Has the furnace or gas heater been checked by a professional in the last year?",
  "Save two numbers in the phone: 911, and Poison Control at 1-800-222-1222.",
];

export default function CaregiversPage() {
  return (
    <article className="usa-section obp-caregiver">
      <div className="grid-container usa-prose">
        <h1>You cannot smell carbon monoxide.</h1>
        <p className="obp-hero__lede">
          You cannot see it or taste it. Roughly three out of four older Americans
          believe they would notice it in time. They are wrong — and that belief is
          exactly what makes this gas so good at killing the people who trust their
          own senses. The only thing that notices carbon monoxide is a working
          alarm.
        </p>

        <h2>Why older adults are more at risk</h2>
        <p>
          Carbon monoxide is harder on older bodies, and its early signs —
          headache, dizziness, weakness, confusion — are easy to mistake for age,
          illness, or the flu. People often fall asleep before they realize
          anything is wrong.
        </p>

        <h2>The one thing that gives it away</h2>
        <p>
          If you feel sick at home but better when you leave the house, and worse
          when you come back — treat that as a warning. That pattern is one of the
          few clues carbon monoxide gives you.
        </p>

        <h2>Ten-minute checklist</h2>
        <p>For you or the person you care for. Print this, or do it together on the phone.</p>
        <Checklist items={CHECKLIST} printLabel="Download the checklist" event="Caregiver checklist printed" />
        <p className="margin-top-2">
          <Link href="/resources">Find help near me</Link>
        </p>

        <h2>For caregivers</h2>
        <p>
          If you're helping a parent from a distance, you can order an alarm to
          their door, book their furnace inspection, and walk the checklist with
          them by phone. Ten minutes on the phone tonight is the whole job.
        </p>
      </div>
    </article>
  );
}
