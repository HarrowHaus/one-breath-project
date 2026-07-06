# Phase 5 — Experiences (the affect engines)

**Produces:** the interactive pieces that convert.
**You need first:** nothing.

**Copy:** Use the exact copy in `/content/experiences.md` verbatim. Do not rewrite. Wire {{data:...}} tokens to the internal API (never guess a number); confirm {{verify:...}} facts against the cited source.

## Instruction for Claude Code

```
Build these interactive experiences, each reading the internal API where relevant:
1. "Is your home at risk?" — a short branching questionnaire (fuel-burning appliances? attached garage? alarm age?) returning a plain-language PERSONAL risk read, ONE tailored next action, and an optional "pick a day to test your alarm" reminder (generate a calendar .ics). Never a scare without an action.
2. "The invisible gas" — an honest interactive conveying, without fabricating data, that a room can be lethal with zero sensory cue (defeats the "I'd smell it" belief).
3. "The harm pyramid" — deaths as the small tip atop a far larger base of ER visits, poisonings, and near-misses, each figure sourced/tagged.
4. A stories module for identifiable-victim content, using only attributed public facts (stories table + consent_status).
Follow VOICE and NON-NEGOTIABLES. On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
You can complete the risk tool and get a personalized result with one clear action, and the harm pyramid renders with sourced figures.
