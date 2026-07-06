# Phase 4B — Learn hub

**Produces:** the education hub and its full article set.
**You need first:** nothing.

**Copy:** Use the exact copy in `/content/learn/index.md` and `/content/learn/*.md` verbatim. Do not rewrite. Titles/descriptions from `/content/metadata.md`. Routes from `/docs/07_SITEMAP_AND_ROUTES.md`.

## Instruction for Claude Code

```
Build the Learn hub and its articles using the components from Phase 3 and the copy in /content/learn/.
- /learn is the index (content/learn/index.md) with cards linking to each article.
- Build each article at its route from /docs/07_SITEMAP_AND_ROUTES.md: what-carbon-monoxide-is, you-cant-smell-it, symptoms, what-co-does-to-the-body, generators-and-storms, choosing-and-placing-alarms, if-your-alarm-goes-off, seasonal-safety, faq.
- Apply the per-page title and meta description from /content/metadata.md.
- Keep the "next article" links working as written. Follow the design spec and style sheet.
On success, hand the commit to the git-committer sub-agent (push to main, no PR).
```

## Done when
`/learn` and all nine articles are live at their routes, each with its title/description, and the internal links between them work.
