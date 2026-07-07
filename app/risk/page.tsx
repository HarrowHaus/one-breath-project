/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { HarmPyramid } from "@/components/HarmPyramid";
import { RiskTool } from "@/components/RiskTool";
import { getMetric } from "@/lib/db/queries";

// Phase 5 — the affect engines. Copy verbatim from content/experiences.md and
// content/metadata.md. Harm-pyramid figures are read live from our database;
// any tier without a verified value hides rather than showing a placeholder.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Is your home at risk of carbon monoxide?",
  description:
    "Answer five quick questions — no sign-up — and get a straight read on your home and one thing to do tonight.",
};

export default async function RiskPage() {
  const [deaths, hospitalizations, erVisits] = await Promise.all([
    getMetric({ indicator: "co_deaths", geo: "US", year: "latest" }),
    getMetric({ indicator: "co_hospitalizations", geo: "US", year: "latest" }),
    getMetric({ indicator: "co_er_visits", geo: "US", year: "latest" }),
  ]);

  return (
    <div className="usa-section">
      <div className="grid-container">
        {/* 1. "Is your home at risk?" — the risk tool. */}
        <div className="usa-prose">
          <h1>Is your home at risk?</h1>
          <p className="obp-hero__lede">
            Answer five quick questions. No sign-up, nothing saved. At the end
            you'll get a straight read on your home and one thing to do about it.
          </p>
        </div>
        <RiskTool />

        {/* 2. "The invisible gas" — no fabricated readings, only the absence of a signal. */}
        <section className="usa-section obp-section-tint margin-top-6 padding-y-4">
          <div className="grid-container usa-prose">
            <h2>The invisible gas</h2>
            <p>
              Imagine your kitchen, exactly as it is right now. Now imagine it
              filling with a gas you can't see, can't smell, and can't taste —
              one that makes you sleepy before it makes you scared. You wouldn't
              get up. You wouldn't open a window. That's not a horror story; it's
              just how carbon monoxide works. The only thing in that room that
              would notice is an alarm.
            </p>
          </div>
        </section>

        {/* 3. "The harm pyramid" — deaths are the small tip atop a far larger base. */}
        <section className="usa-section">
          <div className="grid-container usa-prose">
            <h2>The harm pyramid</h2>
            <p>
              Deaths are the part we count. They sit on top of a much larger pile
              we mostly don't.
            </p>
            <HarmPyramid
              deaths={deaths}
              hospitalizations={hospitalizations}
              erVisits={erVisits}
            />
            <p className="margin-top-3">
              The small number at the top is the reason people shrug. The size of
              the base is the reason they shouldn't.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
