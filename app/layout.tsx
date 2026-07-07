import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

// Verbatim from content/metadata.md (route "/") and the Open Graph fallback.
export const metadata: Metadata = {
  metadataBase: new URL("https://one-breath-project.pages.dev"),
  title: {
    default: "The One Breath Project — Carbon Monoxide Safety",
    template: "%s · The One Breath Project",
  },
  description:
    "Carbon monoxide is silent and preventable. Real stories, real data, and the simple steps that stop it — for renters, landlords, and families.",
  openGraph: {
    title: "The One Breath Project — Silent & Preventable.",
    description:
      "Carbon monoxide kills quietly, and almost every death is preventable. Learn how to protect your home tonight.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* USWDS compiled stylesheet + fonts/images are vendored under /public/uswds.
            Linked statically (not imported through Next) so the CSS's relative
            ../fonts and ../img URLs resolve to the vendored assets. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/uswds/css/styles.css" />
      </head>
      <body>
        {/* Accessibility: skip link is the first focusable element (WCAG 2.4.1). */}
        <a className="usa-skipnav" href="#main-content">
          Skip to main content
        </a>

        <header className="site-header">
          <div className="grid-container">
            {/* Wordmark + tagline are verbatim site identity (content/global.md). */}
            <Link href="/" className="site-wordmark" aria-label="The One Breath Project — home">
              <span className="site-wordmark__name">The One Breath Project</span>
              <span className="site-wordmark__tagline">Silent &amp; Preventable</span>
            </Link>
          </div>
        </header>

        <main id="main-content">{children}</main>

        <footer className="site-footer">
          <div className="grid-container">
            {/* Required on every page — verbatim from content/global.md. */}
            <p className="site-footer__disclaimer">
              The One Breath Project is an independent nonprofit. We are not a
              government agency and not a manufacturer. The information here is for
              education and does not replace professional inspection or emergency
              services.
            </p>
            <p className="site-footer__emergency">
              Suspect carbon monoxide right now? Get outside and call 911. Poison
              Control: 1-800-222-1222.
            </p>
          </div>
        </footer>

        {/* USWDS behaviors (nav toggle, etc.) — ready for later phases. */}
        <Script src="/uswds/js/uswds.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
