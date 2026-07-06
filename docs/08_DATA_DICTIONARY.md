# 08 — Data Dictionary

Every `{{data:...}}` token used anywhere in `/content`, defined once. The internal API and admin must support exactly these indicators. Token format: `{{data:indicator|geo|year|source|tag}}`.

## Indicators

| indicator | Meaning | Preferred source | Default tag |
|---|---|---|---|
| `co_deaths` | Accidental (non-fire) CO poisoning deaths | CDC (death certificates) / CDC WONDER | Measured |
| `co_er_visits` | Emergency-department visits for accidental CO poisoning | CDC / CPSC NEISS (national estimate) | Modeled |
| `co_hospitalizations` | Hospital admissions for accidental CO poisoning | CDC Environmental Public Health Tracking Network | Measured |

`geo` = `US` or a state/county (FIPS or name). `year` = a year or `latest`. If a requested value doesn't exist, **hide the sentence** — never show a placeholder number.

## Seed data (enter these via the admin on first build, so the site shows real numbers immediately)

Enter as national records, then let the connectors add state/county detail later. These are CDC headline figures; keep the honest phrasing.

| indicator | geo | year | value (display) | source | tag |
|---|---|---|---|---|---|
| `co_deaths` | US | latest | **"more than 400"** | CDC | Measured |
| `co_er_visits` | US | latest | **"over 100,000"** | CDC | Modeled (national estimate) |
| `co_hospitalizations` | US | latest | *(leave empty until the CDC Tracking connector supplies it — hide the harm-pyramid hospitalization line until then)* | CDC Tracking | Measured |

Notes:
- Store the display phrasing ("more than 400", "over 100,000") so sentences read naturally; keep a numeric value too if the schema needs one (400, 100000).
- `co_deaths` is **Measured** (death certificates); `co_er_visits` is **Modeled** because the national ER figure is an estimate from sampled emergency departments. Show the tag next to the number. This difference is intentional and models our honesty standard.
- **Verify against the current CDC page before launch.** The Consumer Reports/CDC framing used here is "more than 400 deaths and over 100,000 ER visits per year"; confirm it's still current.

## `{{local:...}}` values (from the resources table / visitor location)
`fire_department_name`, `fire_department_phone`, `gas_utility_line`, `state_fire_marshal`, `co_code_summary`, `installers`, `downloads`, `toolkit file`, `advocacy_toolkit`, `place`. All rendered from data at runtime; never guessed. Missing value → hide that row.
