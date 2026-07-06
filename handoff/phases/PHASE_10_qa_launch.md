# Phase 10 — QA, accessibility, honesty audit, launch prep

**Produces:** a site that's actually safe to publish.
**You need first:** a privacy-first analytics account (e.g. Plausible/Fathom).

## Instruction for Claude Code

```
Do a full pre-launch pass:
1. Accessibility: run automated (axe) AND guide me through manual keyboard and screen-reader checks; fix issues to WCAG 2.1 AA.
2. Dark-pattern audit against /docs/02_DO_NOT_BUILD.md: confirm no pre-ticked boxes, opt-out parity, no fake urgency, no concealed costs, no disguised ads.
3. Honesty audit: confirm EVERY figure on the site has a source and a Measured/Modeled tag, and every resource has a verified_at date. Flag anything unsourced.
4. Firewall check: confirm no product brand appears in editorial and any "find protection" step lists all options with disclosure.
5. Add privacy-first analytics (my account) with an honest consent approach; instrument the key conversions: renter sends request, landlord downloads toolkit, senior completes checklist.
6. Give me a one-screen monthly readout of those conversions I can understand.
Then give me a plain-language launch checklist. On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
The accessibility and dark-pattern audits pass, no figure is unsourced, analytics reports your key conversions, and you have a launch checklist. Then clear the launch gate in /handoff/README.md before going public.
