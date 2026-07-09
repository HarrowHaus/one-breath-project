/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carbon monoxide: frequently asked questions",
  description:
    "Straight answers to the most common questions about carbon monoxide, alarms, and staying safe.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Carbon monoxide FAQ</h1>

        <h2>Can I smell carbon monoxide?</h2>
        <p>
          No. It has no smell, color, or taste. The only way to know it's there is a
          carbon monoxide alarm.
        </p>

        <h2>Isn't my smoke alarm enough?</h2>
        <p>
          No. Smoke alarms detect fire particles, not carbon monoxide gas. You need
          both.
        </p>

        <h2>Where should I put a carbon monoxide alarm?</h2>
        <p>
          On every level of your home and near every sleeping area, following the
          manufacturer's instructions. See{" "}
          <Link href="/learn/choosing-and-placing-alarms">
            choosing and placing alarms
          </Link>
          .
        </p>

        <h2>How often do I replace it?</h2>
        <p>
          Most carbon monoxide alarms last five to seven years. Check the date on the
          back and replace it on schedule — an expired alarm can stop protecting you.
        </p>

        <h2>What are the symptoms?</h2>
        <p>
          Headache, dizziness, nausea, weakness, and confusion — a lot like the flu.
          The clue that it's carbon monoxide: you feel better away from home and worse
          when you return. See <Link href="/learn/symptoms">symptoms</Link>.
        </p>

        <h2>What do I do if my alarm goes off?</h2>
        <p>
          Get everyone outside, call 911, and don't go back in until it's declared
          safe. Full steps:{" "}
          <Link href="/learn/if-your-alarm-goes-off">if your alarm goes off</Link>.
        </p>

        <h2>I have an all-electric home. Am I safe?</h2>
        <p>
          Your risk is lower, not zero. An attached garage or a shared wall with a
          fuel-burning unit can still let carbon monoxide in. A single alarm near the
          bedrooms is cheap insurance.
        </p>

        <h2>Is it safe to run a generator in my garage if the door is open?</h2>
        <p>
          No. Never run a generator in any enclosed or partly enclosed space, even
          with the door open. Keep it well outside, away from doors and windows. See{" "}
          <Link href="/learn/generators-and-storms">generators and storms</Link>.
        </p>

        <h2>I'm a renter. Whose job is the alarm?</h2>
        <p>
          Providing and maintaining alarms is generally the landlord's responsibility,
          and many places require them by law. Here's how to ask, in writing:{" "}
          <Link href="/renters">renters</Link>.
        </p>

        <h2>Where do your numbers come from?</h2>
        <p>
          Public sources like the CDC and CPSC, each labeled measured or modeled. See{" "}
          <Link href="/data/methodology">our sources and methods</Link>.
        </p>
      </div>
    </article>
  );
}
