/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Alert } from "@/components/Alert";
import { AudienceDoors } from "@/components/AudienceDoors";
import { DataFigure } from "@/components/DataTag";
import { Hero } from "@/components/Hero";
import { getMetric } from "@/lib/db/queries";

// Landing page. All copy verbatim from content/home.md. Figures are read live
// from our database (never guessed); a figure with no verified value hides its
// whole line rather than showing a placeholder.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [deaths, erVisits] = await Promise.all([
    getMetric({ indicator: "co_deaths", geo: "US", year: "latest" }),
    getMetric({ indicator: "co_er_visits", geo: "US", year: "latest" }),
  ]);

  return (
    <>
      {/* 1. Hero — one person, NO statistics in this block. */}
      <Hero
        title="Calvin Witherspoon Jr. went to sleep in his apartment and never woke up."
        cta={{ label: "Read the full story", href: "/story" }}
      >
        <p>
          So did his neighbor, Derrick Roper. It was January 2019, in public housing
          in Columbia, South Carolina. Investigators found not one carbon monoxide
          alarm in the entire complex. Weeks later, Witherspoon's daughter still
          caught herself dialing her father's number in the mornings, only to reach
          his voicemail.
        </p>
        <p>
          Carbon monoxide has no color, no smell, no taste. The people who died that
          night had no reason to be afraid — there was nothing to smell, and nothing
          to warn them. That is how this gas kills: quietly, in your sleep, in a home
          you trusted. And almost every death like it could have been stopped by a
          $20 alarm and an inspection that never happened.
        </p>
      </Hero>

      {/* 2. The three doors. */}
      <section className="usa-section">
        <div className="grid-container">
          <h2>Wherever you're standing, there's something you can do tonight.</h2>
          <AudienceDoors
            doors={[
              {
                title: "I rent my home.",
                description: "Know your rights and send your landlord the request.",
                href: "/renters",
              },
              {
                title: "I own or manage property.",
                description: "Meet the standard of care — the simple way.",
                href: "/landlords",
              },
              {
                title: "I'm a senior or a caregiver.",
                description:
                  "The one belief that gets people killed — and how to fix it in ten minutes.",
                href: "/caregivers",
              },
            ]}
          />
        </div>
      </section>

      {/* 3. Scale of the problem — one number at a time, each sourced. */}
      <section className="usa-section obp-section-tint">
        <div className="grid-container usa-prose">
          <h2>
            Only a few hundred Americans die this way each year. That sounds small —
            until you look closer.
          </h2>
          {deaths.found ? (
            <p className="obp-scale-line">
              <DataFigure value={deaths.value} tag={deaths.tag} source={deaths.source} />{" "}
              Americans die from accidental carbon monoxide poisoning in a typical
              year — and almost every one was preventable.
            </p>
          ) : null}
          {erVisits.found ? (
            <p className="obp-scale-line">
              <DataFigure
                value={erVisits.value}
                tag={erVisits.tag}
                source={erVisits.source}
              />{" "}
              more end up in an emergency room.
            </p>
          ) : null}
          <p className="obp-scale-line">
            Many others are poisoned and sent home with a flu diagnosis, because the
            early symptoms are identical.
          </p>
          <p className="text-bold">
            This is not a rare tragedy. It is a common, invisible one that we have
            simply agreed not to count.
          </p>
        </div>
      </section>

      {/* 4. Seasonal action strip — the one ember (primary) action on the page. */}
      <section className="usa-section">
        <div className="grid-container">
          <Alert variant="seasonal" heading="Change your clock, check your alarm">
            Most carbon monoxide poisonings happen in the cold months, when furnaces
            and heaters run hardest. Two minutes now: <strong>test your alarm, or get
            one.</strong>
          </Alert>
          <p className="margin-top-2">
            <Link className="usa-button usa-button--big obp-cta" href="/risk">
              Check my home
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
