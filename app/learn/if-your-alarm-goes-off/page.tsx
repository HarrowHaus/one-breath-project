/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What to do if your carbon monoxide alarm goes off",
  description: "Don't ignore it and don't panic. The exact steps, in order.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>If your carbon monoxide alarm goes off</h1>
        <p>
          Don't ignore it, and don't panic. A sounding carbon monoxide alarm means:
          get out and get help. Here are the steps, in order.
        </p>
        <ol>
          <li>
            <strong>Get everyone outside into fresh air</strong> — people and pets.
            Don't stop to open windows or hunt for the source. Just get out.
          </li>
          <li>
            <strong>Call <a href="tel:911">911</a></strong> (or your local fire
            department) from outside. Tell them your carbon monoxide alarm is going
            off. They can measure the air and find the source safely.
          </li>
          <li>
            <strong>Do a head count.</strong> Make sure everyone who was inside is out
            and accounted for.
          </li>
          <li>
            <strong>Don't go back in</strong> until the fire department or a qualified
            professional says it's safe — even if the alarm stops. The gas can still
            be there.
          </li>
          <li>
            <strong>If anyone feels sick</strong> — headache, dizziness, nausea,
            confusion, or is drowsy or unconscious — tell the 911 dispatcher. Those
            are signs of poisoning and need medical care now.
          </li>
        </ol>
        <p>
          <strong>A chirp is not the same as an alarm.</strong> A single chirp every
          30–60 seconds usually means a low battery or an alarm that's reached the
          end of its life — replace the battery, or the whole unit if it's expired. A
          steady, loud alarm means get out. When in doubt, treat it as the real thing
          and step outside.
        </p>
        <p>
          Once it's confirmed safe, find out what caused it — often a furnace, water
          heater, blocked flue, or a running engine — and have it fixed before you
          rely on that appliance again.
        </p>
        <p className="margin-top-4">
          <Link className="obp-next" href="/learn">
            → Back to the Learn hub
          </Link>
        </p>
      </div>
    </article>
  );
}
