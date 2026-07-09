/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What carbon monoxide is",
  description:
    "A gas with no color, smell, or taste, made whenever fuel burns. Where it comes from and why it's so dangerous indoors.",
};

export default function Page() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>What carbon monoxide is</h1>
        <p>
          Carbon monoxide is a gas with no color, no smell, and no taste. It's made
          whenever a fuel burns — natural gas, propane, oil, wood, coal, gasoline,
          charcoal. In a healthy, well-vented appliance, almost all of it goes
          safely outdoors. The danger starts when something fails and the exhaust
          ends up inside instead.
        </p>
        <p>
          You have no way to sense it. There's no odor to catch, no haze to see, no
          taste to notice. That's the whole problem, and it's why carbon monoxide is
          called the invisible killer.
        </p>
        <p>
          <strong>Where it comes from in a home:</strong> furnaces and boilers, gas
          or oil water heaters, gas stoves and ovens, fireplaces and wood stoves,
          portable generators, a car left running in an attached garage, and grills
          used indoors. The common thread is simple — something burning fuel, and
          exhaust that doesn't make it outside.
        </p>
        <p>
          <strong>Why indoors is the danger:</strong> outdoors, carbon monoxide
          disperses into the open air. Sealed inside a home, especially in winter
          with the windows shut and the furnace running, it builds up. At high
          levels it can kill in minutes. At lower levels it poisons slowly, often
          while people sleep.
        </p>
        <p>
          The good news is the flip side of the bad: because it comes from a short
          list of known sources, it's one of the few household dangers you can shut
          out almost completely — with an alarm that can sense what you can't, and
          appliances that someone keeps in good repair.
        </p>
        <p className="margin-top-4">
          <Link className="obp-next" href="/learn/you-cant-smell-it">
            → Next: You can't smell it
          </Link>
        </p>
      </div>
    </article>
  );
}
