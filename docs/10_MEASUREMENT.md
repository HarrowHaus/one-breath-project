# 10 — Measurement Plan

Behavioral design is empirical. Instrument the actions that matter, ignore vanity metrics, and read it monthly.

## The conversions that count (per audience)
- **Renter:** used the request generator (copied/sent the landlord message).
- **Landlord:** downloaded the toolkit, or clicked through to find an installer.
- **Senior/caregiver:** completed the checklist, or set the alarm-test reminder.
- **Everyone:** completed the "Is your home at risk?" tool; set a reminder; added their name to the pledge.

These are the primary success metrics. Pageviews are context, not success.

## How it's set up (Phase 10)
- Privacy-first analytics (e.g. Plausible/Fathom) — no cross-site tracking, honest consent, no dark-pattern banner.
- Each conversion above is a named event.
- A one-screen monthly readout: the conversion counts, top entry pages, and which audience door gets used most.

## How to read it (non-coder version)
- Are people *doing* things (requests, checklists, reminders), not just visiting? That's the whole game.
- If a page gets lots of visits but no actions, the action isn't clear or easy — tell Claude Code to simplify it.
- Watch the risk tool: lots of "higher risk" results but few reminders set means the follow-through step needs work.

## Ethical testing
- A/B test wording you're unsure about (hero framing, CTA labels) with a real control — honestly, never with dark patterns.
- Backfire check: if a scarier variant lowers action, that's fear without efficacy. Efficacy-forward usually wins.

## Field-data loop
Installs and requests generated here become evidence for grants, code adoption, and the recency layer. The site is both the instrument and a data source.
