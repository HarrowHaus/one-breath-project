# Phase 4 — Landing page + hero

**Produces:** the front door.
**You need first:** nothing (copy is in `/content/home.md`).

**Copy:** Use the exact copy in `/content/home.md` verbatim. Do not rewrite. Wire {{data:...}} tokens to the internal API (never guess a number); confirm {{verify:...}} facts against the cited source.

## Instruction for Claude Code

```
Build the landing page. Order and rules:
1. Affect hero: the Calvin Witherspoon Jr. / Allen Benedict story. Use the hero lede from /docs/01_VOICE_GUIDE.md verbatim. One person, one story. NO statistics inside the hero.
2. Below the hero: the three audience "doors" (Renter, Landlord, Senior/Caregiver), each routing to its journey with its own primary action.
3. Below that: a "scale of the problem" band reading the internal API, showing figures UNITIZED and one at a time (e.g. "at least [N] families this year"), each with a Measured/Modeled tag and source. Never a wall of numbers.
4. A seasonal call-to-action strip ("change your clock, check your alarm") using the alert component.
Also build the full-story page at /story using the hero lede, systemic turn, and reader's turn from /content/home.md and /docs/03_HERO_DOSSIER.md (verify facts against the cited sources). The hero's "Read the full story" links to /story. Every threat statement must have an easy action within sight. Follow all VOICE and NON-NEGOTIABLE rules. On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
The live landing page opens on the Witherspoon story, shows three working doors, and pulls at least one live figure from your database with a source tag.
