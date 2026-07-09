import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Verbatim from content/metadata.md (route "/") and the Open Graph fallback.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The One Breath Project — Silent & Preventable.",
    description:
      "Carbon monoxide kills quietly, and almost every death is preventable. Learn how to protect your home tonight.",
    images: ["/og.png"],
  },
};

// Top navigation — exactly five items (content/global.md, docs/07_SITEMAP_AND_ROUTES.md).
const NAV = [
  { label: "Learn", href: "/learn" },
  { label: "Data", href: "/data" },
  { label: "Act", href: "/act" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

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
        <Analytics />
      </head>
      <body>
        {/* Accessibility: skip link is the first focusable element (WCAG 2.4.1).
            No USWDS government banner and no Identifier component — this is an
            independent nonprofit, not a government site. */}
        <a className="usa-skipnav" href="#main-content">
          Skip to main content
        </a>

        <header className="usa-header usa-header--basic">
          <div className="usa-nav-container">
            <div className="usa-navbar">
              <div className="usa-logo">
                {/* Wordmark + tagline are verbatim site identity (content/global.md). */}
                <em className="usa-logo__text">
                  <Link href="/" title="The One Breath Project">
                    The One Breath Project
                  </Link>
                </em>
                <span className="site-tagline">Silent &amp; Preventable</span>
              </div>
              <button type="button" className="usa-menu-btn">
                Menu
              </button>
            </div>
            <nav aria-label="Primary navigation" className="usa-nav">
              <button type="button" className="usa-nav__close">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/uswds/img/usa-icons/close.svg" role="img" alt="Close" />
              </button>
              <ul className="usa-nav__primary usa-accordion">
                {NAV.map((item) => (
                  <li key={item.href} className="usa-nav__primary-item">
                    <Link className="usa-nav__link" href={item.href}>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main id="main-content">{children}</main>

        <footer className="site-footer">
          <div className="grid-container">
            {/* Footer links — About, sources & methods, privacy, accessibility, contact. */}
            <nav aria-label="Footer" className="footer-links">
              <ul>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/about/sources">Our sources &amp; methods</Link>
                </li>
                <li>
                  <Link href="/about/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/about/accessibility">Accessibility</Link>
                </li>
                <li>
                  <Link href="/about">Contact</Link>
                </li>
              </ul>
            </nav>

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

        {/* USWDS behaviors (mobile nav toggle, accordion). */}
        <Script src="/uswds/js/uswds.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
