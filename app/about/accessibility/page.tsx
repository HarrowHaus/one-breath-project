/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";

// Accessibility. DRAFT statement verbatim from content/about.md.
export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Our commitment to a site everyone can use, and how to reach us if something doesn't work.",
};

export default function AccessibilityPage() {
  return (
    <article className="usa-section">
      <div className="grid-container usa-prose">
        <h1>Accessibility</h1>
        <div className="usa-alert usa-alert--info" role="note">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              Draft statement — to be finalized with a real contact before launch.
            </p>
          </div>
        </div>
        <p>
          We build this site to be usable by everyone, including people using
          screen readers, keyboards, and larger text. We aim to meet WCAG 2.1 AA.
          If something doesn't work for you, tell us and we'll fix it.
        </p>
      </div>
    </article>
  );
}
