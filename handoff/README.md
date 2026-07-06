# Handoff — how to build this

The build runs in phases, `PHASE_00` through `PHASE_10`, in order. Each phase file has: what it produces, what you (the human) need ready, the instruction for Claude Code, and a **"Done when"** check.

## The rhythm, every phase
1. In Claude Code (this repo open), say: *"Do Phase N — read `/handoff/phases/PHASE_0N_*.md` and follow it."*
2. Claude Code has already read `CLAUDE.md` and the `/docs`, so it has the rules and context.
3. Let it work. When it says it's done, check the **"Done when"** line yourself (usually: look at the live Cloudflare URL).
4. On success, Claude Code hands the commit to the **`git-committer`** sub-agent (Haiku), which pushes straight to `main`. No pull requests. You don't type git commands.
5. Move to the next phase.

## If something's off (check-and-report loop)
You don't read code. Verify with these:
- *"Show me it working on the live site."* If you can't see or use it, it isn't done.
- *"Run the accessibility check and the DO_NOT_BUILD audit and paste the results."*
- *"List every figure on this page with its source and Measured/Modeled tag."* Anything blank is a stop.
- If broken: describe what you see, say *"this doesn't meet the Done-when for Phase N — diagnose, fix, then show me,"* and re-check. Do not let it commit broken work.
- Keep each session to one phase. If a session drifts, tell it to re-read `CLAUDE.md` and the current phase file.

## Build order
- **0** Project setup, guardrails, live URL (Cloudflare Pages)
- **1** Design system & global chrome
- **2A** Data platform: database + internal API · **2B** Data connectors
- **3** Component library
- **4** Landing page + hero (and `/story`)
- **4B** Learn hub + article set
- **5** Experiences (risk tool, invisible-gas demo, harm pyramid, stories)
- **6** Data hub + granular explorer
- **7** Audience journeys (renter / landlord / senior-caregiver)
- **8** Resources hub + local finder
- **9** Advocacy hub + About/Transparency
- **10** QA, accessibility, honesty audit, launch prep

## Launch gate (built ≠ public)
Build everything first. Go public only when both clear:
1. **Fact-check gate:** every published claim is sourced; every number is Measured/Modeled. Nothing unsourced ships.
2. **Legal gate:** real privacy policy + accessibility statement + the "independent nonprofit, not a government site" disclaimer are in place; 501(c)(3) formation underway or complete.

The hero is a public news story used with attribution, so **no family permission is required to launch.** Notifying the family and honoring any takedown request is an optional courtesy, not a blocker.
