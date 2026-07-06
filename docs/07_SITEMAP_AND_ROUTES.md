# 07 — Sitemap & Routes

Fixed URLs. Every internal link in `/content` resolves to one of these. Do not invent alternate paths.

## Top-level nav (five)
| Label | Route |
|---|---|
| Learn | `/learn` |
| Data | `/data` |
| Act | `/act` |
| Resources | `/resources` |
| About | `/about` |

## All routes
- `/` — Home (content: `content/home.md`)
- `/story` — The full Witherspoon / Allen Benedict story (content: hero dossier + voice guide)
- `/risk` — "Is your home at risk?" tool (content: `content/experiences.md`)
- **Journeys**
  - `/renters` (content: `content/journeys/renter.md`)
  - `/landlords` (content: `content/journeys/landlord.md`)
  - `/caregivers` (content: `content/journeys/senior-caregiver.md`)
- **Learn hub** (`/learn` = index)
  - `/learn/what-carbon-monoxide-is`
  - `/learn/you-cant-smell-it`
  - `/learn/symptoms`
  - `/learn/what-co-does-to-the-body`
  - `/learn/generators-and-storms`
  - `/learn/choosing-and-placing-alarms`
  - `/learn/if-your-alarm-goes-off`
  - `/learn/seasonal-safety`
  - `/learn/faq`
  - (content: `content/learn/index.md` + `content/learn/*.md`)
- **Data hub**
  - `/data` — explorer (content: `content/data.md`)
  - `/data/methodology` — Measured vs Modeled
- **Act**
  - `/act` (content: `content/act.md`)
- **Resources**
  - `/resources` — local finder (content: `content/resources.md`)
  - `/resources/grants-and-programs`
- **About**
  - `/about` (content: `content/about.md`)
  - `/about/sources` — sources & methods (may reuse `/data/methodology`)
  - `/about/privacy`
  - `/about/accessibility`
- **System**
  - `/404` (content: `content/system-pages.md`)
  - `/thank-you` (content: `content/system-pages.md`)

## Link resolution notes
- Home doors → `/renters`, `/landlords`, `/caregivers`.
- "Read the full story" → `/story`.
- "Check my home" / "Find out my risk" → `/risk`.
- "Find help near me" / "Find your local contacts" → `/resources`.
- "See the data" / "How we know this" → `/data` or `/data/methodology`.
- Footer legal links → `/about/privacy`, `/about/accessibility`, `/about/sources`.
