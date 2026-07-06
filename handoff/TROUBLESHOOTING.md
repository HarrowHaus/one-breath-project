# Troubleshooting (for the non-coder)

You don't fix code — you tell Claude Code what's wrong and let it fix it. Here's how to describe common problems.

**The live site didn't update after a change.**
Say: "The change isn't showing on the Cloudflare URL. Check that the git-committer sub-agent pushed to main and that Cloudflare built successfully — show me the deploy status." Cloudflare rebuilds on each push to `main`; a failed build stops the update.

**Claude Code rewrote copy instead of using ours.**
Say: "This page's text doesn't match `/content`. Use the copy from that file verbatim — do not rewrite. Re-read `/CLAUDE.md` and `/content/README.md`." (Point to the exact content file.)

**A number is showing as blank or as a placeholder.**
That's usually correct — if the database has no verified value, the line hides on purpose. If you expected a number: "Confirm the seed data from `/docs/08_DATA_DICTIONARY.md` is entered in the admin, and that this token is wired to the internal API."

**Claude Code wants to open a pull request or make a branch.**
Say: "No pull requests, no branches. Hand the commit to the git-committer sub-agent, which pushes straight to `main`. See `/CLAUDE.md`."

**It's asking me for a key or password.**
That's normal at data/analytics steps. Put secrets in the local `.env` file or the Cloudflare dashboard — never in the repo. Ask: "Tell me exactly where to paste this so it's not committed." See `.env.example`.

**A phase feels half-done.**
Re-read the "Done when" line in that phase file. If it isn't met, say: "This doesn't meet the Done-when for Phase N — diagnose and fix, then show me on the live site." Don't let it commit until it's met.

**Accessibility check is failing.**
Say: "Run axe and fix every critical issue to WCAG 2.1 AA, then show me the report."

**I edited a sub-agent file and nothing changed.**
Sub-agents load when a session starts. Restart Claude Code (or use `/agents`) after editing `.claude/agents/`.

**It's drifting / forgetting the rules mid-session.**
Say: "Re-read `/CLAUDE.md`, `/docs/00_MASTER_CONTEXT.md`, and the current phase file, then continue." Keep each session to one phase.

**When in doubt:** ask Claude Code to *show you the thing working on the live site*. If you can't see it or use it, it isn't done.
