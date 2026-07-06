# Glossary (plain-language)

For the non-coder running this. You don't need to know these to build — this is just so nothing is a mystery.

- **Repo (repository):** the folder of project files, stored on GitHub. This is it.
- **GitHub:** where the repo lives online. Claude Code reads and writes here.
- **Claude Code:** the AI coding tool you paste instructions to. It writes the actual code.
- **Cloudflare Pages:** the service that takes the code from GitHub and puts it online at a real URL, updating automatically when the code changes.
- **Next.js:** the framework the site is built with (React under the hood). Claude Code handles it.
- **USWDS (U.S. Web Design System):** a free, accessible set of ready-made web components and styles. We use its parts and accessibility, not its government branding.
- **Public Sans:** the free typeface the site uses.
- **Postgres / PostGIS:** the database (Postgres) with map/location abilities (PostGIS). Holds the CO figures and local resources.
- **Internal API:** our own data doorway. The site reads numbers from here, not directly from government websites — so it's fast and reliable.
- **Connector / ingestion:** the code that pulls data from a government source into our database.
- **Token (in content):** a `{{...}}` placeholder that tells Claude Code to insert a real value from data. It is never a blank to guess.
- **Measured vs Modeled:** whether a number is counted directly (measured) or estimated (modeled). We always label which.
- **Sub-agent:** a small helper Claude Code delegates to. Ours is the Haiku "git-committer" that saves and publishes finished work.
- **Commit / push:** saving a change and sending it to GitHub (which then updates the live site). The sub-agent does this; you don't.
- **`main`:** the single official version of the code. We always push straight to it — no pull requests.
- **WCAG 2.1 AA:** the accessibility standard we meet (works with screen readers, keyboards, larger text, good contrast).
- **.env / secrets:** private keys and passwords. They live outside the repo and are never committed.
- **CMS (Decap):** the content editor that lets you change words on the site later without code.
