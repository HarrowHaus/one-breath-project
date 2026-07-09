/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Generator safety: carbon monoxide after a storm",
  description:
    "Portable generators cause deadly poisonings during outages. Where to put one, and where never to.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Generator safety: carbon monoxide after a storm</h1>
        <p>
          When the power goes out, portable generators save the day — and cause some
          of the year's deadliest carbon monoxide poisonings. After hurricanes, ice
          storms, and winter outages, families run a generator to stay warm or keep
          the lights on, put it too close to the house, and are poisoned in their
          sleep. It happens every storm season.
        </p>
        <p>
          A generator's engine produces carbon monoxide the same way a car does — a
          lot of it, fast. Indoors or up against the house, that exhaust finds its
          way inside within minutes.
        </p>
        <p>
          <strong>The rules that keep a generator from killing you:</strong>
        </p>
        <ul>
          <li>
            <strong>Never</strong> run a generator inside a home, basement, garage,
            shed, or any enclosed or partly enclosed space — even with doors and
            windows open. Ventilation is not enough.
          </li>
          <li>
            Place it <strong>outside, well away from the house</strong> — at least 20
            feet — with the exhaust pointed away from doors, windows, and vents.
          </li>
          <li>Keep it dry and follow the manufacturer's instructions.</li>
          <li>
            Put a <strong>battery-powered carbon monoxide alarm</strong> inside, near
            the sleeping areas, before you ever need the generator. During an outage,
            your hardwired alarm may be dark.
          </li>
        </ul>
        <p>
          <strong>If anyone feels sick while a generator is running</strong> —
          headache, dizziness, nausea — get outside into fresh air and call{" "}
          <a href="tel:911">911</a> immediately. Assume it's carbon monoxide until
          proven otherwise.
        </p>
        <p>
          A generator is a tool for outside the house, always. Treated that way, it's
          a lifesaver. Treated casually, it's one of the most dangerous machines
          you'll ever own.
        </p>
        <p className="margin-top-4">
          <Link className="obp-next" href="/learn/choosing-and-placing-alarms">
            → Next: Choosing and placing alarms
          </Link>
        </p>
      </div>
    </article>
  );
}
