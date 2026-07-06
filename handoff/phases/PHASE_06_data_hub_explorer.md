# Phase 6 — Data hub + granular explorer

**Produces:** the self-serve data explorer for non-technical visitors.
**You need first:** nothing.

**Copy:** Use the exact copy in `/content/data.md` verbatim. Do not rewrite. Wire {{data:...}} tokens to the internal API (never guess a number); confirm {{verify:...}} facts against the cited source.

## Instruction for Claude Code

```
Build the Data hub. Centerpiece: a granular explorer a non-technical person can use, reading ONLY the internal API. Progressive disclosure, one choice at a time:
1. Where (map click OR State->County dropdown; default to visitor location if allowed).
2. What (plain metric chips: Deaths, ER visits, Hospitalizations, each with a one-line definition on tap).
3. When (a simple year slider).
Result: one clean chart, an auto-generated plain-language sentence ("In [county] in [year], at least [N] people went to the ER for accidental CO poisoning — nearly all of it preventable."), a Measured/Modeled tag, the source, and a "Download this data (CSV)" button. Add a methodology page explaining Measured vs Modeled. No walls of numbers; one metric at a time; local-first. On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
A visitor can pick a place, metric, and year and get a chart plus a sourced plain-language sentence and a CSV download.
