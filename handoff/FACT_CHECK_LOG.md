# Fact-check log

Nothing with a fact or a figure goes live until it's logged here. This is the honesty gate as an artifact — and it's what a grant reviewer or journalist will trust.

## How to use
For every published claim or number, add a row. If you can't fill the Source column, it doesn't publish.

| Page / element | Claim or figure (as shown) | Source (name, year, link) | Measured / Modeled | Verified by | Date |
|---|---|---|---|---|---|
| Harm pyramid + home scale band | co_deaths US — "at least 430" deaths/yr | Sircar et al. 2019, Am J Emerg Med (NVSS annual average), https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/ | Measured (annual average, NVSS) | Claude (sourcing) | 2026-07-07 |
| Harm pyramid + home scale band | co_er_visits US — "about 101,847" ED visits | Sircar et al. 2019, Am J Emerg Med (HCUP NEDS, 2007–2013), https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/ | Modeled (national estimate, 2007–2013) | Claude (sourcing) | 2026-07-07 |
| Harm pyramid | co_hospitalizations US — "about 14,365" hospitalizations | Sircar et al. 2019, Am J Emerg Med (HCUP NIS, 2003–2013), https://pmc.ncbi.nlm.nih.gov/articles/PMC8819702/ | Modeled (national estimate, 2003–2013) | Claude (sourcing) | 2026-07-07 |
| Data explorer | (each state/county figure, by year) | CDC Environmental Public Health Tracking Network (per the API record's source field) | Measured (per the record's tag) | Claude (connector) | 2026-07-07 |
| /story hero | "not one alarm in the entire complex" | NBC News, 2019, [link] | Measured (reported) | | |
| /story hero | HUD moved to require alarms in ~3M units | NBC News / CBS News, [link] | Measured (reported) | | |

Notes on the national figures:
- All three national headline figures share one source (Sircar et al. 2019) so the harm pyramid is internally coherent. Deaths are an NVSS annual average; ER visits and hospitalizations are HCUP-sample national estimates — each labeled with its **period** so it is never read as a current-year measured count.
- These are national estimates, **not** a sum of CDC Tracking's state rows (states with small counts are suppressed; a sum would undercount).

## Rules
- Measured = from a records system (death certificates, hospital/ED records). Name the system and year.
- Modeled = an estimate from a sample or method. Say so, and how.
- Use "at least" with measured counts.
- Re-verify news-based facts against the original article before launch and whenever the copy changes.
- If a figure can't be sourced, remove it — don't soften it.
