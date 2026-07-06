# 06 — Design Spec

Concrete visual decisions so nothing about the look is improvised. Register: calm, institutional, trustworthy, senior-legible — the feel of a public-health resource, not a product ad and not a government site.

## Color (build these as design tokens)
- **Primary (headers, links, primary surfaces):** deep blue `#1a4480`.
- **Primary dark (hover/active):** `#162e51`.
- **Accent (used sparingly — the single primary action per page, and the emergency line):** ember `#d54309`. Never use it as a large background; it's for one button and the 911 line.
- **Text:** near-black `#1b1b1b` on white. Secondary text `#565c65`.
- **Backgrounds:** white `#ffffff`; section tint `#f0f0f0`; info tint `#e7f6f8`.
- **Alert colors (USWDS alert component):** info, warning, and emergency variants as USWDS ships them; the seasonal strip uses info; the 911 line uses emergency.

All text/background pairs must pass WCAG 2.1 AA (≥4.5:1 for body, ≥3:1 for large text). Do not introduce colors outside this list without asking.

## Type
- **Font:** Public Sans (USWDS). Load it locally.
- **Base body size:** 18px (larger than the 16px default — senior-legible). Line height 1.6.
- **Scale:** h1 ~40px, h2 ~30px, h3 ~24px, body 18px, small 16px (never smaller for body text).
- **Measure:** cap line length around 70–75 characters for readability.

## Spacing & layout
- Generous whitespace; USWDS spacing tokens. Single-column, content-first layouts. Max content width ~font-friendly (USWDS "desktop" grid).
- **Touch targets:** minimum 44×44px. Large, obvious buttons.
- **Focus states:** a visible, high-contrast focus ring on every interactive element. Never remove outlines.

## Identity (no logo yet — spec, not art)
- **Wordmark:** "The One Breath Project" in Public Sans Semibold, primary blue. Tagline "Silent & Preventable" beneath in secondary text, smaller, letter-spaced slightly.
- **Favicon:** a simple monogram or breath/circle mark in primary blue on white. Keep it plain; it's a placeholder until a designer is hired.
- **Imagery:** documentary, human, dignified. No stock "scare" imagery, no red-alert graphics. When real victim/story photos are used, follow the dignity rules in `/docs/03_HERO_DOSSIER.md`. Every image needs alt text (see `/docs/09_STYLE_SHEET.md`).

## Motion
Minimal and calm. No autoplay, no flashing, no fake countdowns. Respect `prefers-reduced-motion`.

## Responsive
Mobile-first. Everything works and reads at 360px wide and up. Nav collapses to a standard accessible menu on small screens.
