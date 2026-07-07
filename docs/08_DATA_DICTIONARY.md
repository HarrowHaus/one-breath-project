# 08 — Data Dictionary

Every `{{data:...}}` token used anywhere in `/content`, defined once. The internal API and admin must support exactly these indicators. Token format: `{{data:indicator|geo|year|source|tag}}`.

## Sourcing strategy: two layers

CO figures come from two distinct layers, and they must never be mixed:

- **NATIONAL headline figures** (the harm pyramid, the landing scale band) come from a **published national estimate** — Sircar et al. 2019 (below), built on HCUP and NVSS. One coherent, CDC-authored source for all three tiers.
- **SUB-NATIONAL granularity** (the state-by-year data explorer) comes from **CDC Tracking** (state) and, later, **CDC WONDER** (county/demographics).

**Never sum suppressed sub-national data into a national total.** CDC suppresses small state/county counts for privacy, so a sum of states would *undercount* and read as a false "national figure." The national headline is always a published national estimate, not a roll-up of the explorer's state rows.

## Indicators

| indicator | Meaning | Preferred source (national headline) | Default tag |
|---|---|---|---|
| `co_deaths` | Accidental (non-fire) CO poisoning deaths | Sircar et al. 2019 (NVSS annual average) | Measured (annual average, NVSS) |
| `co_er_visits` | Emergency-department visits for accidental CO poisoning | Sircar et al. 2019 (HCUP NEDS, 2007–2013) | Modeled (national estimate, 2007–2013) |
| `co_hospitalizations` | Hospital admissions for accidental CO poisoning | Sircar et al. 2019 (HCUP NIS, 2003–2013) | Modeled (national estimate, 2003–2013) |

Sub-national detail for all three comes from **CDC Environmental Public Health Tracking Network** (state, by year), tagged **Measured** per its own records.

`geo` = `US` or a state/county (FIPS or name). `year` = a year or `latest`. If a requested value doesn't exist, **hide the sentence** — never show a placeholder number.

## Seed data (national headline figures — seeded via `scripts/seed.mjs` and/or the admin)

Shared source for all three: **Sircar et al., "National unintentional carbon monoxide poisoning estimates using hospitalization and emergency department data," Am J Emerg Med (2019)**, CDC authors, using HCUP National Inpatient Sample (hospitalizations, 2003–2013), HCUP Nationwide Emergency Department Sample (ED visits, 2007–2013), and NVSS (deaths, annual average). Link: https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/

| indicator | geo | year | value (display) | numeric | tag |
|---|---|---|---|---|---|
| `co_deaths` | US | latest | **"at least 430"** | 430 | Measured (annual average, NVSS) |
| `co_er_visits` | US | latest | **"about 101,847"** | 101847 | Modeled (national estimate, 2007–2013) |
| `co_hospitalizations` | US | latest | **"about 14,365"** | 14365 | Modeled (national estimate, 2003–2013) |

Notes:
- Store the display phrasing so sentences read naturally; keep the numeric value for charts.
- Every figure carries its **estimate period** in the tag (and notes), so a modeled estimate is never shown as a current-year measured count.
- `co_deaths` is **Measured** (NVSS annual average); `co_er_visits` and `co_hospitalizations` are **Modeled** because they are national estimates projected from HCUP samples. Show the tag next to the number — this difference models our honesty standard.
- **Honest trend:** Sircar reports ED visits **declining** across the study period. Usable as a sourced trend statement, not just a static number.

## Future enrichment sources (record only — do NOT build yet)

- **NPDS / AAPCC poison-center data** — the "exposures" tier (a larger base than ED visits, near-real-time, seasonal). Label as **"exposures reported to poison centers"** (call volume — undercounts, not confirmed poisonings). Manual entry from AAPCC annual reports; no free public API.
- **CPSC NEISS** (already a planned connector) — use its **product-linkage** strength (which appliances/generators cause injuries) for the generators and "where it comes from" content and the landlord/product-safety angle, not just a headline number.
- **CDC WONDER** — mortality by **age/sex/region** (older adults, males, South/Midwest) for the "who's most at risk" content and equity framing.
- **NFPA** — fire-department CO incident responses (~72,000/yr, 2006–2010; dated, some reports paywalled). A second denominator and a tie-in to the local fire-department finder. Manual, dated.

## `{{local:...}}` values (from the resources table / visitor location)
`fire_department_name`, `fire_department_phone`, `gas_utility_line`, `state_fire_marshal`, `co_code_summary`, `installers`, `downloads`, `toolkit file`, `advocacy_toolkit`, `place`. All rendered from data at runtime; never guessed. Missing value → hide that row.
