// The national headline figures the harm pyramid and landing scale band show.
// Kept in sync with scripts/seed.mjs (the CLI seeder) — same values, one source.
//
// Source for all three: Sircar et al., "National unintentional carbon monoxide
// poisoning estimates using hospitalization and emergency department data,"
// Am J Emerg Med (2019), CDC authors — HCUP NIS (hospitalizations, 2003–2013),
// HCUP NEDS (ED visits, 2007–2013), and NVSS (deaths, annual average).
// https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/
//
// These are national ESTIMATES, not sums of CDC Tracking's (partly suppressed)
// state rows. Each carries its estimate period in the tag so it is never read
// as a current-year measured count.
import type { MetricInput } from "@/lib/db/queries";

const CITE = "Sircar et al. 2019, Am J Emerg Med. https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/";

export const NATIONAL_FIGURES: MetricInput[] = [
  {
    indicator: "co_deaths",
    geo: "US",
    valueDisplay: "at least 430",
    valueNumeric: 430,
    source: "Sircar et al. 2019 (Am J Emerg Med); NVSS",
    measuredOrModeled: "Measured (annual average, NVSS)",
    notes: `National annual-average unintentional (non-fire) CO poisoning deaths, NVSS. ${CITE}`,
  },
  {
    indicator: "co_er_visits",
    geo: "US",
    valueDisplay: "about 101,847",
    valueNumeric: 101847,
    source: "Sircar et al. 2019 (Am J Emerg Med); HCUP NEDS",
    measuredOrModeled: "Modeled (national estimate, 2007–2013)",
    notes: `National estimate of emergency-department visits for unintentional CO poisoning, HCUP Nationwide Emergency Department Sample 2007–2013. ${CITE}`,
  },
  {
    indicator: "co_hospitalizations",
    geo: "US",
    valueDisplay: "about 14,365",
    valueNumeric: 14365,
    source: "Sircar et al. 2019 (Am J Emerg Med); HCUP NIS",
    measuredOrModeled: "Modeled (national estimate, 2003–2013)",
    notes: `National estimate of hospitalizations for unintentional CO poisoning, HCUP National Inpatient Sample 2003–2013. ${CITE}`,
  },
];
