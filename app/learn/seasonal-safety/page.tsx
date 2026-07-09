/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seasonal carbon monoxide safety",
  description:
    "Most poisonings happen in the cold months. The two habits that keep your home safe all winter.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Seasonal carbon monoxide safety</h1>
        <p>
          Most carbon monoxide poisonings happen in the cold months. It's not a
          coincidence — that's when furnaces and heaters run hardest, windows stay
          shut, and generators come out during storms and outages. The season itself
          raises the risk.
        </p>
        <p>
          <strong>Two habits carry you through winter:</strong>
        </p>
        <ol>
          <li>
            <strong>Get the furnace checked before you need it.</strong> Have a
            qualified technician inspect your furnace, water heater, and any
            fuel-burning appliances once a year, ideally in early fall. A cracked heat
            exchanger or a blocked flue is invisible until an alarm — or a person —
            catches it.
          </li>
          <li>
            <strong>Test your alarms when you change your clocks.</strong> Twice a
            year, when daylight saving time starts and ends, press the test button and
            swap the batteries if needed. If you don't have alarms near the sleeping
            areas, that's the night to fix it.
          </li>
        </ol>
        <p>
          <strong>Watch the high-risk moments:</strong>
        </p>
        <ul>
          <li>
            <strong>Power outages and winter storms:</strong> never run a generator in
            or near the house (see{" "}
            <Link href="/learn/generators-and-storms">generators and storms</Link>).
          </li>
          <li>
            <strong>Warming up a car:</strong> never let it idle in an attached garage,
            even with the door open.
          </li>
          <li>
            <strong>Holiday cooking and gatherings:</strong> never use a gas oven to
            heat the home, and never bring a grill indoors.
          </li>
        </ul>
        <p>
          The pattern is always the same — burning fuel plus a sealed-up house. Break
          that chain with a checked furnace and a working alarm, and winter stops
          being the dangerous season.
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
