# Phase 8 — Resources hub + local finder

**Produces:** "what do I do, near me."
**You need first:** confirm the USFA fire-department data is loaded (Phase 2B).

**Copy:** Use the exact copy in `/content/resources.md` verbatim. Do not rewrite. Wire {{data:...}} tokens to the internal API (never guess a number); confirm {{verify:...}} facts against the cited source.

## Instruction for Claude Code

```
Build the Resources hub with a local resource finder. On geolocation permission OR ZIP entry, query PostGIS for the nearest resources and show a "Your local CO resources" panel:
- The 911 / emergency instruction FIRST and prominent: "If you think you're being poisoned right now, get outside and call 911."
- Nearest fire department(s) with non-emergency line (from the registry data).
- Poison Control: 1-800-222-1222 (always shown).
- Gas utility emergency line and State Fire Marshal (from curated resources).
- Local CO-alarm code info where known.
- Nearby installers (from our resources data) and audience-matched downloadable checklists/toolkits.
Also include a grants & programs directory (FEMA Fire Prevention & Safety, HUD Healthy Homes, IHWAP, CDBG). Every listing shows a verified_at date; flag stale ones in admin. Use MapLibre GL for any map. On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
Entering a ZIP returns a local panel led by the 911 instruction, with a real nearest fire department and Poison Control.
