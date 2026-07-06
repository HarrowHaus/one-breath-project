# Content — the verbatim copy pack

**This folder is the source of truth for every user-facing word on the site.** Claude Code must place this copy verbatim. It must not rewrite, paraphrase, shorten, or "improve" it. If a page needs copy that isn't here, stop and ask — do not improvise.

## The three token types (this is how we avoid guesswork on data)

Copy sometimes contains tokens in `{{ }}`. A token is an instruction, never a blank to fill with a guess.

- **`{{data:indicator|geo|year|source|tag}}`** — a live figure pulled from the internal API. Claude Code wires this to the API and renders the real value with its Measured/Modeled tag and source. **Never invent the number.** If the API has no value for it, hide the sentence rather than guess.
  - Example: `{{data:co_er_visits|US|latest|CDC|Measured}}`
- **`{{verify:...}}`** — a fact that is already written in the copy but must be confirmed against the cited source before publishing (used for the hero story). The wording stays; you're checking accuracy, not rewriting.
- **`{{local:...}}`** — a value that comes from the visitor's location or the resources table at runtime (e.g. nearest fire department). Rendered from data, never guessed.

National constants are written literally and are safe to use as-is (e.g. Poison Control: 1-800-222-1222).

## Page → file map

| Page / area | File |
|---|---|
| Global (nav, footer, disclaimer, buttons, empty states) | `global.md` |
| Page titles & meta descriptions (SEO/social) | `metadata.md` |
| System pages (404, thank-you, confirmations) | `system-pages.md` |
| Landing page | `home.md` |
| Renter journey | `journeys/renter.md` |
| Landlord journey | `journeys/landlord.md` |
| Senior / caregiver journey | `journeys/senior-caregiver.md` |
| Learn hub (index + article set) | `learn/index.md` + `learn/*.md` |
| Experiences (risk tool, invisible gas, harm pyramid) | `experiences.md` |
| Data hub (explorer microcopy, methodology) | `data.md` |
| Resources hub + local finder | `resources.md` |
| Act / advocacy hub | `act.md` |
| About / transparency / privacy / accessibility | `about.md` |

## Rule of thumb
If you're about to type a sentence a visitor will read and it isn't in one of these files, you're drifting. Stop.
