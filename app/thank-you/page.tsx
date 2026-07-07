/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";

// System page — copy verbatim from content/system-pages.md (thank-you).
export const metadata: Metadata = {
  title: "You're in — thank you.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <section className="usa-section">
      <div className="grid-container">
        <div className="usa-prose">
          <h1>You're in — thank you.</h1>
          <p>
            Watch your inbox for the two-minute checklist. Now do the one thing
            that matters most tonight: make sure there's a working carbon monoxide
            alarm near where you sleep.
          </p>
          <ul className="usa-list">
            <li>
              <Link href="/risk">Check my home</Link>
            </li>
            {/* Share becomes a real share action in a later phase; points home for now. */}
            <li>
              <Link href="/">Share this with someone you love</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
