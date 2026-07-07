import { DataTag } from "./DataTag";
import type { MetricResult } from "@/lib/db/queries";

// "The harm pyramid" — deaths are the small tip atop a far larger base. Each
// counted tier shows its figure with a Measured/Modeled tag + source; a tier
// with no verified value is hidden (never a placeholder). The uncounted base
// carries no number by design.
type Tier = { label: string; metric?: MetricResult };

export function HarmPyramid({
  deaths,
  hospitalizations,
  erVisits,
}: {
  deaths: MetricResult;
  hospitalizations: MetricResult;
  erVisits: MetricResult;
}) {
  const tiers: Tier[] = [
    { label: "deaths a year", metric: deaths },
    { label: "hospitalized", metric: hospitalizations },
    { label: "emergency-room visits", metric: erVisits },
  ];

  const visible = tiers.filter((t) => t.metric?.found);
  const total = visible.length + 1; // +1 for the uncounted base

  return (
    <div className="obp-pyramid" aria-label="The carbon monoxide harm pyramid">
      {visible.map((t, i) => {
        const m = t.metric!; // found === true here
        // Widen each tier toward the base.
        const width = 45 + (i / Math.max(total - 1, 1)) * 45;
        return (
          <div
            className="obp-pyramid__tier"
            style={{ maxWidth: `${width}%` }}
            key={t.label}
          >
            <span className="obp-pyramid__figure">
              {m.found ? m.value : null}
            </span>{" "}
            <span className="obp-pyramid__label">{t.label}</span>{" "}
            {m.found ? <DataTag tag={m.tag} source={m.source} /> : null}
          </div>
        );
      })}
      <div className="obp-pyramid__tier obp-pyramid__tier--base" style={{ maxWidth: "100%" }}>
        <span className="obp-pyramid__label">
          Below that, uncounted: people poisoned and sent home with the wrong
          diagnosis, and the near-misses an alarm caught in time.
        </span>
      </div>
    </div>
  );
}
