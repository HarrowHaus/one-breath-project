/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You can't smell carbon monoxide",
  description:
    "The most dangerous myth about carbon monoxide is that you'd notice it. You wouldn't — and here's why that matters.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>You can't smell it</h1>
        <p>
          The most dangerous belief about carbon monoxide is that you'd notice it.
          You wouldn't.
        </p>
        <p>
          Carbon monoxide has no smell. None. The "gas smell" people associate with
          a stove or a leak is an odorant added to natural gas on purpose, so you
          can detect a fuel leak. Carbon monoxide is different — it's a product of
          burning, and it carries no warning odor at all.
        </p>
        <p>
          Most older Americans believe they could sense carbon monoxide in time.
          They can't, and that confidence is exactly what makes the gas so effective
          at killing the people who trust their own senses. If you're waiting to
          smell it, feel it, or see it before you act, you're relying on the one
          thing that will never happen.
        </p>
        <p>
          A smoke alarm won't help either. Smoke alarms sense particles from a fire.
          Carbon monoxide is an invisible gas with no smoke. They're different
          sensors for different dangers, and you need both.
        </p>
        <p>
          The only reliable detector is a carbon monoxide alarm built for the job —
          near where you sleep, tested, and replaced on schedule. Not your nose. Not
          a hunch. An alarm.
        </p>
        <p className="margin-top-4">
          <Link className="obp-next" href="/learn/symptoms">
            → Next: Symptoms — and the one clue
          </Link>
        </p>
      </div>
    </article>
  );
}
