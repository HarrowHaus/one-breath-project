/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

// Learn hub index. Copy verbatim from content/learn/index.md; metadata from
// content/metadata.md. Cards link to each article; the footer line points to
// our sources & methods.
export const metadata: Metadata = {
  title: "Learn about carbon monoxide — the invisible killer",
  description:
    "What carbon monoxide is, where it comes from, why you can't sense it, and exactly how to protect your home.",
};

const ARTICLES = [
  {
    href: "/learn/what-carbon-monoxide-is",
    title: "What carbon monoxide is",
    blurb: "A gas you can't see, smell, or taste.",
  },
  {
    href: "/learn/you-cant-smell-it",
    title: "You can't smell it",
    blurb: "The myth that gets people killed.",
  },
  {
    href: "/learn/symptoms",
    title: "Symptoms — and the one clue",
    blurb: "Why it's mistaken for the flu.",
  },
  {
    href: "/learn/what-co-does-to-the-body",
    title: "What it does to your body",
    blurb: "How it harms, and why it can leave lasting damage.",
  },
  {
    href: "/learn/generators-and-storms",
    title: "Generators and storms",
    blurb: "The deadliest mistake during a power outage.",
  },
  {
    href: "/learn/choosing-and-placing-alarms",
    title: "Choosing and placing alarms",
    blurb: "Which to buy, where to put it.",
  },
  {
    href: "/learn/if-your-alarm-goes-off",
    title: "If your alarm goes off",
    blurb: "The exact steps, in order.",
  },
  {
    href: "/learn/seasonal-safety",
    title: "Seasonal safety",
    blurb: "The two winter habits that matter.",
  },
  {
    href: "/learn/faq",
    title: "FAQ",
    blurb: "Quick answers.",
  },
];

export default function LearnPage() {
  return (
    <div className="usa-section">
      <div className="grid-container">
        <div className="usa-prose">
          <h1>Learn about carbon monoxide</h1>
          <p className="obp-hero__lede">
            Carbon monoxide kills quietly, and almost every death is preventable.
            Start here. A few minutes of reading is the difference between a home
            that can warn you and one that can't.
          </p>
        </div>

        <ul className="usa-card-group margin-top-2">
          {ARTICLES.map((a) => (
            <li key={a.href} className="usa-card tablet:grid-col-6 desktop:grid-col-4">
              <Link href={a.href} className="usa-card__container obp-door">
                <div className="usa-card__header">
                  <h2 className="usa-card__heading">{a.title}</h2>
                </div>
                <div className="usa-card__body">
                  <p>{a.blurb}</p>
                </div>
                <div className="usa-card__footer">
                  <span className="obp-door__go" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="usa-prose margin-top-3">
          <p className="text-base">
            Every figure on this site names its source and says whether it was
            measured or modeled.{" "}
            <Link href="/data/methodology">See our sources and methods</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
