/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Choosing and placing carbon monoxide alarms",
  description:
    "Which alarm to buy, where to put it, how often to test it, and when to replace it.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Choosing and placing carbon monoxide alarms</h1>
        <p>
          An alarm is the one thing that senses what you can't. Here's how to get it
          right.
        </p>
        <p>
          <strong>Which alarm to buy.</strong> Any carbon monoxide alarm certified to
          the current safety standard (look for a recognized testing mark on the
          package, such as UL). A digital display that shows the current level is a
          useful extra, but not required. Combination smoke-and-carbon-monoxide
          alarms are fine as long as they meet the standards for both. Battery-powered
          or battery-backup models keep working during a power outage — which is
          exactly when the risk from generators spikes.
        </p>
        <p>
          <strong>Where to put it.</strong> Put an alarm on every level of your home
          and near every sleeping area, so it can wake you. The goal is simple: if
          carbon monoxide reaches where people sleep, something sounds. Follow the
          manufacturer's instructions for exact placement, and check your local code
          — some places require alarms based on an attached garage, not just the
          appliances.
        </p>
        <p>
          <strong>Where not to put it.</strong> Keep alarms away from spots that
          cause false readings or muffle them: right next to fuel-burning appliances,
          in dead air behind furniture, in very humid spots like directly above a
          shower, or in the path of a draft that blows exhaust away.
        </p>
        <p>
          <strong>Test and replace.</strong> Press the test button regularly — a good
          habit is when you change your clocks each spring and fall. Replace the
          batteries at the same time if it isn't a sealed unit. Carbon monoxide
          alarms don't last forever; most need replacing every five to seven years,
          and there's a date on the back. An expired alarm can quietly stop
          protecting you.
        </p>
        <p>
          The whole setup costs about the price of a few takeout meals, and it's the
          single most effective thing you can do.
        </p>
        <p className="margin-top-4">
          <Link className="obp-next" href="/learn/if-your-alarm-goes-off">
            → Next: If your alarm goes off
          </Link>
        </p>
      </div>
    </article>
  );
}
